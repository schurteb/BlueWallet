import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Platform, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';

import navigationStyle from '../../components/navigationStyle';
import { BlueLoading, BlueText, BlueSpacing20, BlueListItem, BlueCard } from '../../BlueComponents';
import { useNavigation, useTheme } from '@react-navigation/native';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const GeneralSettings = () => {
  const { isAdancedModeEnabled, setIsAdancedModeEnabled, wallets, isHandOffUseEnabled, setIsHandOffUseEnabledAsyncStorage, language } = useContext(
    BlueStorageContext,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAdancedModeSwitchEnabled, setIsAdancedModeSwitchEnabled] = useState(false);
  const { navigate, setOptions } = useNavigation();
  const { colors } = useTheme();
  const onAdvancedModeSwitch = async value => {
    await setIsAdancedModeEnabled(value);
    setIsAdancedModeSwitchEnabled(value);
  };

  useEffect(() => {
    (async () => {
      setIsAdancedModeSwitchEnabled(await isAdancedModeEnabled());
      setIsLoading(false);
    })();
  });

  useEffect(() => {
    setOptions({
      title: loc.settings.general,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, language]);

  const stylesWithThemeHook = {
    root: {
      ...styles.root,
      backgroundColor: colors.background,
    },
    scroll: {
      ...styles.scroll,
      backgroundColor: colors.background,
    },
    scrollBody: {
      ...styles.scrollBody,
      backgroundColor: colors.background,
    },
  };

  return isLoading ? (
    <BlueLoading />
  ) : (
    <ScrollView style={stylesWithThemeHook.scroll}>
      {wallets.length > 1 && (
        <>
          <BlueListItem component={TouchableOpacity} onPress={() => navigate('DefaultView')} title={loc.settings.default_title} chevron />
        </>
      )}
      {Platform.OS === 'ios' ? (
        <>
          <BlueListItem
            hideChevron
            title={loc.settings.general_continuity}
            Component={TouchableWithoutFeedback}
            switch={{ onValueChange: setIsHandOffUseEnabledAsyncStorage, value: isHandOffUseEnabled }}
          />
          <BlueCard>
            <BlueText>{loc.settings.general_continuity_e}</BlueText>
          </BlueCard>
          <BlueSpacing20 />
        </>
      ) : null}
      <BlueListItem
        Component={TouchableWithoutFeedback}
        title={loc.settings.general_adv_mode}
        switch={{ onValueChange: onAdvancedModeSwitch, value: isAdancedModeSwitchEnabled }}
      />
      <BlueCard>
        <BlueText>{loc.settings.general_adv_mode_e}</BlueText>
      </BlueCard>
      <BlueSpacing20 />
    </ScrollView>
  );
};

GeneralSettings.navigationOptions = navigationStyle({
  title: loc.settings.general,
});

export default GeneralSettings;
