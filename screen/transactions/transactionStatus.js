import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

import {
  BlueButton,
  BlueCard,
  BlueLoading,
  BlueSpacing10,
  BlueSpacing20,
  BlueText,
  BlueTransactionIncomingIcon,
  BlueTransactionOutgoingIcon,
  BlueTransactionPendingIcon,
  SafeBlueArea,
} from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import { HDSegwitBech32Transaction } from '../../class';
import { BitcoinUnit } from '../../models/bitcoinUnits';
import HandoffComponent from '../../components/handoff';
import loc, { formatBalanceWithoutSuffix } from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';

const buttonStatus = Object.freeze({
  possible: 1,
  unknown: 2,
  notPossible: 3,
});

const TransactionsStatus = () => {
  const { setSelectedWallet, wallets, txMetadata, getTransactions } = useContext(BlueStorageContext);
  const { hash } = useRoute().params;
  const { navigate, setOptions } = useNavigation();
  const { colors } = useTheme();
  const wallet = useRef();
  const [isCPFPPossible, setIsCPFPPossible] = useState();
  const [isRBFBumpFeePossible, setIsRBFBumpFeePossible] = useState();
  const [isRBFCancelPossible, setIsRBFCancelPossible] = useState();
  const [tx, setTX] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const stylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.background,
    },
    value: {
      color: colors.alternativeTextColor2,
    },
    secondaryValue: {
      color: colors.alternativeTextColor2,
    },
    feeValue: {
      color: colors.alternativeTextColor2,
    },
    feeSecondaryValue: {
      color: colors.alternativeTextColor2,
    },
    valueUnit: {
      color: colors.alternativeTextColor2,
    },
    valueSecondaryUnit: {
      color: colors.alternativeTextColor2,
    },
    feeUnit: {
      color: colors.alternativeTextColor2,
    },
    feeSecondaryUnit: {
      color: colors.alternativeTextColor2,
    },
    memoText: {
      color: colors.alternativeTextColor,
    },
    iconRoot: {
      backgroundColor: colors.success,
    },
    confirmations: {
      backgroundColor: colors.lightButton,
    },
  });

  useEffect(() => {
    setIsCPFPPossible(buttonStatus.unknown);
    setIsRBFBumpFeePossible(buttonStatus.unknown);
    setIsRBFCancelPossible(buttonStatus.unknown);
  }, []);

  useEffect(() => {
    setOptions({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        shadowOffset: { height: 0, width: 0 },
        backgroundColor: colors.customHeader,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  useEffect(() => {
    for (const w of wallets) {
      for (const t of w.getTransactions()) {
        if (t.hash === hash) {
          console.log('tx', hash, 'belongs to', w.getLabel());
          wallet.current = w;
          break;
        }
      }
    }

    for (const tx of getTransactions(null, Infinity, true)) {
      if (tx.hash === hash) {
        setTX(tx);
        break;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const initialState = async () => {
    try {
      await checkPossibilityOfCPFP();
      await checkPossibilityOfRBFBumpFee();
      await checkPossibilityOfRBFCancel();
    } catch (e) {
      setIsCPFPPossible(buttonStatus.notPossible);
      setIsRBFBumpFeePossible(buttonStatus.notPossible);
      setIsRBFCancelPossible(buttonStatus.notPossible);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initialState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, wallets]);

  useEffect(() => {
    if (wallet) {
      setSelectedWallet(wallet.current.getID());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    console.log('transactions/details - useEffect');
  }, []);

  const calcFee = (tx, unit) => {
    if (!tx || !tx.inputs || !tx.outputs) return "0";

    let fee = 0;

    tx.inputs.forEach(input => {
      fee += input.value;
    });

    tx.outputs.forEach(output => {
      fee -= output.value;
    });

    fee *= 100000000;

    return formatBalanceWithoutSuffix(fee, unit, true).toString();
  };

  const checkPossibilityOfCPFP = async () => {
    if (!wallet.current.allowRBF()) {
      return setIsCPFPPossible(buttonStatus.notPossible);
    }

    const cpfbTx = new HDSegwitBech32Transaction(null, tx.hash, wallet.current);
    if ((await cpfbTx.isToUsTransaction()) && (await cpfbTx.getRemoteConfirmationsNum()) === 0) {
      return setIsCPFPPossible(buttonStatus.possible);
    } else {
      return setIsCPFPPossible(buttonStatus.notPossible);
    }
  };

  const checkPossibilityOfRBFBumpFee = async () => {
    if (!wallet.current.allowRBF()) {
      return setIsRBFBumpFeePossible(buttonStatus.notPossible);
    }

    const rbfTx = new HDSegwitBech32Transaction(null, tx.hash, wallet.current);
    if (
      (await rbfTx.isOurTransaction()) &&
      (await rbfTx.getRemoteConfirmationsNum()) === 0 &&
      (await rbfTx.isSequenceReplaceable()) &&
      (await rbfTx.canBumpTx())
    ) {
      return setIsRBFBumpFeePossible(buttonStatus.possible);
    } else {
      return setIsRBFBumpFeePossible(buttonStatus.notPossible);
    }
  };

  const checkPossibilityOfRBFCancel = async () => {
    if (!wallet.current.allowRBF()) {
      return setIsRBFCancelPossible(buttonStatus.notPossible);
    }

    const rbfTx = new HDSegwitBech32Transaction(null, tx.hash, wallet.current);
    if (
      (await rbfTx.isOurTransaction()) &&
      (await rbfTx.getRemoteConfirmationsNum()) === 0 &&
      (await rbfTx.isSequenceReplaceable()) &&
      (await rbfTx.canCancelTx())
    ) {
      return setIsRBFCancelPossible(buttonStatus.possible);
    } else {
      return setIsRBFCancelPossible(buttonStatus.notPossible);
    }
  };

  const navigateToRBFBumpFee = () => {
    navigate('RBFBumpFee', {
      txid: tx.hash,
      wallet: wallet.current,
    });
  };

  const navigateToRBFCancel = () => {
    navigate('RBFCancel', {
      txid: tx.hash,
      wallet: wallet.current,
    });
  };

  const navigateToCPFP = () => {
    navigate('CPFP', {
      txid: tx.hash,
      wallet: wallet.current,
    });
  };
  const navigateToTransactionDetials = () => {
    navigate('TransactionDetails', { hash: tx.hash });
  };

  const renderCPFP = () => {
    if (isCPFPPossible === buttonStatus.unknown) {
      return (
        <>
          <ActivityIndicator />
          <BlueSpacing20 />
        </>
      );
    } else if (isCPFPPossible === buttonStatus.possible) {
      return (
        <>
          <BlueButton onPress={navigateToCPFP} title={loc.transactions.status_bump} />
          <BlueSpacing10 />
        </>
      );
    }
  };

  const renderRBFCancel = () => {
    if (isRBFCancelPossible === buttonStatus.unknown) {
      return (
        <>
          <ActivityIndicator />
        </>
      );
    } else if (isRBFCancelPossible === buttonStatus.possible) {
      return (
        <>
          <TouchableOpacity style={styles.cancel}>
            <Text onPress={navigateToRBFCancel} style={styles.cancelText}>
              {loc.transactions.status_cancel}
            </Text>
          </TouchableOpacity>
          <BlueSpacing10 />
        </>
      );
    }
  };

  const renderRBFBumpFee = () => {
    if (isRBFBumpFeePossible === buttonStatus.unknown) {
      return (
        <>
          <ActivityIndicator />
          <BlueSpacing20 />
        </>
      );
    } else if (isRBFBumpFeePossible === buttonStatus.possible) {
      return (
        <>
          <BlueButton onPress={navigateToRBFBumpFee} title={loc.transactions.status_bump} />
          <BlueSpacing10 />
        </>
      );
    }
  };

  if (isLoading || !tx) {
    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }} style={[styles.root, stylesHook.root]}>
        <BlueLoading />
      </SafeBlueArea>
    );
  }
  return (
    <SafeBlueArea forceInset={{ horizontal: 'always' }} style={[styles.root, stylesHook.root]}>
      <HandoffComponent
        title={`Bitcoin Transaction ${tx.hash}`}
        type="io.bluewallet.bluewallet"
        url={`https://blockstream.info/tx/${tx.hash}`}
      />

      <StatusBar barStyle="default" />
      <View style={styles.container}>
        <BlueCard>

          <View style={styles.firstView}>
            <Text style={[styles.value, stylesHook.value]}>
              {formatBalanceWithoutSuffix(tx.value, wallet.current.preferredBalanceUnit, true)}{' '}
              {wallet.current.preferredBalanceUnit !== BitcoinUnit.LOCAL_CURRENCY && (
                <Text style={[styles.valueUnit, stylesHook.valueUnit]}>{loc.units[wallet.current.preferredBalanceUnit]}</Text>
              )}
            </Text>
          </View>

          <View style={styles.view}>
            <Text style={[styles.secondaryValue, stylesHook.secondaryValue]}>
              {formatBalanceWithoutSuffix(tx.value, wallet.current.preferredBalanceSecondaryUnit, true)}{' '}
              {wallet.current.preferredBalanceSecondaryUnit !== BitcoinUnit.LOCAL_CURRENCY && (
                <Text style={[styles.valueSecondaryUnit, stylesHook.valueSecondaryUnit]}>{loc.units[wallet.current.preferredBalanceSecondaryUnit]}</Text>
              )}
            </Text>
          </View>

          {calcFee(tx, wallet.current.preferredBalanceUnit) !== "" && (
            <View style={styles.firstFeeView}>
              <Text style={[styles.feeValue, stylesHook.feeValue]}>
                {`\n`}{loc.send.create_fee}
              </Text>
            </View>
          )}

          {calcFee(tx, wallet.current.preferredBalanceUnit) !== "" && (
            <View style={styles.feeView}>
              <Text style={[styles.feeValue, stylesHook.feeValue]}>
                {calcFee(tx, wallet.current.preferredBalanceUnit)}{' '}
                {wallet.current.preferredBalanceUnit !== BitcoinUnit.LOCAL_CURRENCY && (
                  <Text style={[styles.feeUnit, stylesHook.feeUnit]}>{loc.units[wallet.current.preferredBalanceUnit]}</Text>
                )}
              </Text>
              <Text style={[styles.feeSecondaryValue, stylesHook.feeSecondaryValue]}>
                {' ('}
                {calcFee(tx, wallet.current.preferredBalanceSecondaryUnit)}
                {wallet.current.preferredBalanceSecondaryUnit !== BitcoinUnit.LOCAL_CURRENCY && (
                  <Text style={[styles.feeSecondaryUnit, stylesHook.feeSecondaryUnit]}>{loc.units[wallet.current.preferredBalanceSecondaryUnit]}</Text>
                )}{') '}
                </Text>
            </View>
          )}

          {txMetadata !== undefined && txMetadata[tx.hash] !== undefined && txMetadata[tx.hash].memo !== undefined && ( // TODO_BENJ Produces error: Text strings can only be rendered in Text Components
            <View style={[styles.view, stylesHook.view]}>
              <Text style={[styles.memoText, stylesHook.memoText]}>
                {`\n`}{txMetadata[tx.hash].memo}
              </Text>
            </View>
          )}

          <View style={[styles.iconRoot, stylesHook.iconRoot]}>
            <View>
              <Icon name="check" size={50} type="font-awesome" color={colors.successCheck} />
            </View>
            <View style={[styles.iconWrap, styles.margin]}>
              {(() => {
                if (!tx.confirmations) {
                  return (
                    <View style={styles.icon}>
                      <BlueTransactionPendingIcon />
                    </View>
                  );
                } else if (tx.value < 0) {
                  return (
                    <View style={styles.icon}>
                      <BlueTransactionOutgoingIcon />
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.icon}>
                      <BlueTransactionIncomingIcon />
                    </View>
                  );
                }
              })()}
            </View>
          </View>

          <View style={[styles.confirmations, stylesHook.confirmations]}>
            <Text style={styles.confirmationsText}>
              {loc.formatString(loc.transactions.confirmations_lowercase, {
                confirmations: tx.confirmations > 6 ? '6+' : tx.confirmations,
              })}
            </Text>
          </View>
        </BlueCard>

        <View style={styles.actions}>
          {renderCPFP()}
          {renderRBFBumpFee()}
          {renderRBFCancel()}
          <TouchableOpacity style={styles.details} onPress={navigateToTransactionDetials}>
            <Text style={styles.detailsText}>{loc.send.create_details.toLowerCase()}</Text>
            <Icon name="angle-right" size={18} type="font-awesome" color="#9aa0aa" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeBlueArea>
  );
};

export default TransactionsStatus;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
  },
  firstView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 0,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  firstFeeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  feeView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  value: {
    fontSize: 36,
    fontWeight: '600',
  },
  secondaryValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  feeSecondaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueSecondaryUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  feeUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  feeSecondaryUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  memo: {
    alignItems: 'center',
    marginVertical: 8,
  },
  memoText: {
    color: '#9aa0aa',
    fontSize: 16,
  },
  iconRoot: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 43,
    marginBottom: 53,
  },
  iconWrap: {
    minWidth: 30,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 15,
  },
  margin: {
    marginBottom: -40,
  },
  icon: {
    width: 25,
  },
  fee: {
    marginTop: 15,
    marginBottom: 13,
  },
  feeText: {
    color: '#37c0a1',
    fontSize: 14,
    marginHorizontal: 4,
    paddingBottom: 6,
    fontWeight: '500',
    alignSelf: 'center',
  },
  confirmations: {
    borderRadius: 11,
    width: 109,
    height: 21,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationsText: {
    color: '#9aa0aa',
    fontSize: 11,
  },
  actions: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cancel: {
    marginVertical: 16,
  },
  cancelText: {
    color: '#d0021b',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailsText: {
    color: '#9aa0aa',
    fontSize: 14,
    marginRight: 8,
  },
});

TransactionsStatus.navigationOptions = navigationStyle({
  title: '',
});
