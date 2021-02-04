import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from 'react-native-elements';
import { BlueButton, BlueCard } from '../../BlueComponents';
import { BitcoinUnit } from '../../models/bitcoinUnits';
import loc, { formatBalance } from '../../loc';
import PropTypes from 'prop-types';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

const Success = () => {
  const pop = () => {
    dangerouslyGetParent().pop();
  };
  const { colors } = useTheme();
  const { dangerouslyGetParent } = useNavigation();
  const { amount, amountSecondary, fee, amountUnit = BitcoinUnit.BTC, amountSecondaryUnit = BitcoinUnit.LOCAL_CURRENCY, invoiceDescription = '', onDonePressed = pop } = useRoute().params;
  const stylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.elevated,
    },
    amountValue: {
      color: colors.alternativeTextColor2,
    },
    amountUnit: {
      color: colors.alternativeTextColor2,
    },
    amountSecondaryUnit: {
      color: colors.alternativeTextColor2,
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
        amountSecondary={amountSecondary}
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
    amountValue: {
      color: colors.alternativeTextColor2,
    },
    amountUnit: {
      color: colors.alternativeTextColor2,
    },
    amountSecondaryUnit: {
      color: colors.alternativeTextColor2,
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
          {formatBalance(amount, amountUnit, true).toString() !== undefined && (
            <>
              <Text style={[styles.amountValue, stylesHook.amountValue]}>{formatBalance(amount, amountUnit, true).toString() || "..."}</Text>
            </>
          )}
        </View>

        <View style={styles.view}>
          {formatBalance(amount, amountSecondaryUnit, true).toString() !== undefined && (
            <>
              <Text style={[styles.amountSecondaryUnit, stylesHook.amountSecondaryUnit]}>{formatBalance(amount, amountSecondaryUnit, true).toString() || "..."}</Text>
            </>
          )}
        </View>

        {fee > 0 && (
          <View>
            <Text style={styles.feeText}>
              {loc.send.create_fee}: {fee} {loc.units[BitcoinUnit.BTC]}
            </Text>
          </View>
        )}

        <Text numberOfLines={0} style={styles.feeText}>
          {invoiceDescription}
        </Text>
      </BlueCard>
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
    </View>
  );
};

SuccessView.propTypes = {
  amount: PropTypes.number,
  amountSecondary: PropTypes.number,
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
    paddingBottom: 16,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 16,
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
