import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import navigationStyle from '../../components/navigationStyle';
import { SafeBlueArea, BlueListItem } from '../../BlueComponents';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';

const NetworkSettings = () => {
  const { language } = useContext(BlueStorageContext);
  const { navigate, setOptions } = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    setOptions({
      title: loc.settings.network,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, language]);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  const navigateToElectrumSettings = () => {
    navigate('ElectrumSettings');
  };

  const navigateToLightningSettings = () => {
    navigate('LightningSettings');
  };

  const navigateToBroadcast = () => {
    navigate('Broadcast');
  };

  return (
    <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>
      <ScrollView>
        <BlueListItem title={loc.settings.network_electrum} onPress={navigateToElectrumSettings} chevron />
        <BlueListItem title={loc.settings.lightning_settings} onPress={navigateToLightningSettings} chevron />
        <BlueListItem title={loc.settings.network_broadcast} onPress={navigateToBroadcast} chevron />
      </ScrollView>
    </SafeBlueArea>
  );
};

NetworkSettings.navigationOptions = navigationStyle({
  title: loc.settings.network,
});

export default NetworkSettings;
