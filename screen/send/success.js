import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { BlueButton, BlueCard } from '../../BlueComponents';
import { BitcoinUnit } from '../../models/bitcoinUnits';
import loc, { formatBalanceWithoutSuffix } from '../../loc';
import PropTypes from 'prop-types';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

const Success = () => {
  const pop = () => {
    dangerouslyGetParent().pop();
  };
  const { colors } = useTheme();
  const { dangerouslyGetParent } = useNavigation();
  const { amount, fee, amountUnit = BitcoinUnit.BTC, amountSecondaryUnit = BitcoinUnit.LOCAL_CURRENCY, invoiceDescription = '', onDonePressed = pop } = useRoute().params;
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
  });
  useEffect(() => {
    console.log('send/success - useEffect');
    ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={[styles.root, stylesHook.root]}>
      <SuccessView
        amount={amount}
        amountUnit={amountUnit}
        amountSecondaryUnit={amountSecondaryUnit}
        fee={fee}
        invoiceDescription={invoiceDescription}
        onDonePressed={onDonePressed}
      />
      <View style={styles.buttonContainer}>
        <BlueButton onPress={onDonePressed} title={loc.send.success_done} />
      </View>
    </SafeAreaView>
  );
};

export default Success;

export const SuccessView = ({ amount, amountUnit, amountSecondaryUnit, fee, invoiceDescription, shouldAnimate = true }) => {
  const animationRef = useRef();
  const { colors } = useTheme();

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
  });

  useEffect(() => {
    if (shouldAnimate) {
      animationRef.current.reset();
      animationRef.current.resume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  return (
    <View style={styles.root}>
      <BlueCard style={styles.amount}>

        <View style={styles.firstView}>
          <Text style={[styles.value, stylesHook.value]}>
          {formatBalanceWithoutSuffix(amount, amountUnit, true)}{' '}
            {amountUnit !== BitcoinUnit.LOCAL_CURRENCY && (
              <Text style={[styles.valueUnit, stylesHook.valueUnit]}>{loc.units[amountUnit]}</Text>
            )}
          </Text>
        </View>

        <View style={styles.view}>
          <Text style={[styles.secondaryValue, stylesHook.secondaryValue]}>
            {formatBalanceWithoutSuffix(amount, amountSecondaryUnit, true)}{' '}
            {amountSecondaryUnit !== BitcoinUnit.LOCAL_CURRENCY && (
              <Text style={[styles.valueSecondaryUnit, stylesHook.valueSecondaryUnit]}>{loc.units[amountSecondaryUnit]}</Text>
            )}
          </Text>
        </View>

        {fee >= 0 && (
          <View style={styles.firstFeeView}>
            <Text style={[styles.feeValue, stylesHook.feeValue]}>
              {'\n'}{loc.send.create_fee}
            </Text>
          </View>
        )}

        {fee >= 0 && (
          <View style={styles.feeView}>
            <Text style={[styles.feeValue, stylesHook.feeValue]}>
              {formatBalanceWithoutSuffix(fee, amountUnit, true)}{' '}
              {amountUnit !== BitcoinUnit.LOCAL_CURRENCY && (
                <Text style={[styles.feeUnit, stylesHook.feeUnit]}>{loc.units[amountUnit]}</Text>
              )}
            </Text>
            <Text style={[styles.feeSecondaryValue, stylesHook.feeSecondaryValue]}>
              {' ('}
              {formatBalanceWithoutSuffix(fee, amountSecondaryUnit, true)}
              {amountSecondaryUnit !== BitcoinUnit.LOCAL_CURRENCY && (
                <Text style={[styles.feeSecondaryUnit, stylesHook.feeSecondaryUnit]}>{loc.units[amountSecondaryUnit]}</Text>
              )}{') '}
            </Text>
          </View>
        )}

        <View style={[styles.view, stylesHook.view]}>
          <Text style={[styles.memoText, stylesHook.memoText]}>
            {'\n'}{invoiceDescription == undefined ? '' : invoiceDescription}
          </Text>
        </View>

        <View style={styles.ready}>
          <LottieView
            style={styles.lottie}
            source={require('../../img/bluenice.json')}
            autoPlay={shouldAnimate}
            ref={animationRef}
            loop={false}
            progress={shouldAnimate ? 0 : 1}
            colorFilters={[
              {
                keypath: 'spark',
                color: colors.success,
              },
              {
                keypath: 'circle',
                color: colors.success,
              },
              {
                keypath: 'Oval',
                color: colors.successCheck,
              },
            ]}
          />
        </View>

      </BlueCard>
    </View>
  );
};

SuccessView.propTypes = {
  amount: PropTypes.number,
  amountUnit: PropTypes.string,
  amountSecondaryUnit: PropTypes.string,
  fee: PropTypes.number,
  invoiceDescription: PropTypes.string,
  shouldAnimate: PropTypes.bool,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  buttonContainer: {
    padding: 58,
  },
  amount: {
    alignItems: 'center',
  },
  firstView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 0,
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
  amountValue: {
    fontSize: 36,
    fontWeight: '600',
  },
  amountUnit: {
    fontSize: 16,
    marginHorizontal: 4,
    paddingBottom: 6,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  amountSecondaryUnit: {
    fontSize: 16,
    marginHorizontal: 4,
    paddingBottom: 6,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  feeText: {
    color: '#37c0a1',
    fontSize: 14,
    marginHorizontal: 4,
    paddingBottom: 6,
    fontWeight: '500',
    alignSelf: 'center',
  },
  ready: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 43,
    marginBottom: 53,
  },
  lottie: {
    width: 400,
    height: 400,
  },
});
