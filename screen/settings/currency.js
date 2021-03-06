import React, { useState, useEffect, useContext } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';

import navigationStyle from '../../components/navigationStyle';
import { SafeBlueArea, BlueListItem, BlueText, BlueCard } from '../../BlueComponents';
import { FiatUnit, FiatUnitSource } from '../../models/fiatUnit';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';
const currency = require('../../blue_modules/currency');

const data = Object.values(FiatUnit);

const Currency = () => {
  const { setPreferredFiatCurrency, language } = useContext(BlueStorageContext);
  const [isSavingNewPreferredCurrency, setIsSavingNewPreferredCurrency] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const { navigate, setOptions } = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    setOptions({
      title: loc.settings.currency,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, language]);

  const styles = StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: colors.background,
    },
    activity: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const preferredCurrency = await currency.getPreferredCurrency();
        if (preferredCurrency === null) {
          throw Error();
        }
        setSelectedCurrency(preferredCurrency);
      } catch (_error) {
        setSelectedCurrency(FiatUnit.USD);
      }
    };
    fetchCurrency();
  }, []);

  if (selectedCurrency !== null && selectedCurrency !== undefined) {
    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.flex}>
        <FlatList
          style={styles.flex}
          keyExtractor={(_item, index) => `${index}`}
          data={data}
          initialNumToRender={25}
          extraData={data}
          renderItem={({ item }) => {
            return (
              <BlueListItem
                disabled={isSavingNewPreferredCurrency}
                title={`${item.endPointKey} (${item.symbol})`}
                checkmark={selectedCurrency.endPointKey === item.endPointKey}
                onPress={async () => {
                  setIsSavingNewPreferredCurrency(true);
                  setSelectedCurrency(item);
                  await currency.setPrefferedCurrency(item);
                  await currency.startUpdater();
                  setIsSavingNewPreferredCurrency(false);
                  setPreferredFiatCurrency();
                }}
              />
            );
          }}
        />
        <BlueCard>
          <BlueText>
            {loc.settings.currency_source} {selectedCurrency.source ?? FiatUnitSource.CoinDesk}
          </BlueText>
        </BlueCard>
      </SafeBlueArea>
    );
  }
  return (
    <View style={styles.activity}>
      <ActivityIndicator />
    </View>
  );
};

Currency.navigationOptions = navigationStyle({
  title: loc.settings.currency,
});

export default Currency;
