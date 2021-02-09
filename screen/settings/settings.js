import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, StatusBar, View } from 'react-native';
import { Icon } from "react-native-elements";
import { useNavigation, useTheme } from '@react-navigation/native';

import navigationStyle from '../../components/navigationStyle';
import { SafeBlueArea, BlueListItem, BlueCardItem, BlueHeaderDefaultSub } from '../../BlueComponents';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import Notifications from '../../blue_modules/notifications';
import { NavContainer, NavIconButton } from "../../components/NavButtons";
import { isCatalyst, isMacCatalina } from "../../blue_modules/environment";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollViewWrapper: {
    flex: 0.92,
  },
  footerNavigationWrapper: {
    flex: 0.08,
    bottom: 0,
    //position: 'absolute',
  },
});

const Settings = () => {
  const { navigate, setOptions } = useNavigation();
  // By simply having it here, it'll re-render the UI if language is changed
  // eslint-disable-next-line no-unused-vars
  const { language } = useContext(BlueStorageContext);
  const { colors } = useTheme();

  useEffect(() => {
    setOptions({
      title: loc.settings.header,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, language]);

  const stylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.customHeader,
    },
    footerNavigationWrapper: {
      backgroundColor: colors.background,
    },
    scrollViewWrapper: {
      backgroundColor: colors.background,
    },
    settingsCardItem: {
      backgroundColor: 'transparent',
      borderColor: colors.foregroundColor,
      borderWidth: 1,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
      height: 100,
    }
  });

  const navigateToWalletsList = () => {
    navigate("WalletsList");
  };

  const navigateToAddWalletRoot = () => {
    navigate("AddWalletRoot");
  };

  const navigateToSettings = () => {
    navigate("Settings");
  };

  const renderScrollView = () => {
    return (
      <View style={[styles.scrollViewWrapper, stylesHook.scrollViewWrapper]}>
        <StatusBar barStyle="default" />

        <ScrollView>
          {/*<BlueHeaderDefaultSub leftText={loc.settings.header} />*/}

          <BlueCardItem leftIcon="settings" leftIconType="octicons" title={loc.settings.general} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('GeneralSettings')} chevron />
          <BlueCardItem leftIcon="coins" leftIconType="font-awesome-5" title={loc.settings.currency} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('Currency')} chevron />
          <BlueCardItem leftIcon="settings-display" leftIconType="material-icons" title={loc.settings.theme} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('Theme')} chevron />
          <BlueCardItem leftIcon="translate" leftIconType="material-icons" title={loc.settings.language} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('Language')} chevron />
          <BlueCardItem leftIcon="lock" leftIconType="simple-line-icons" title={loc.settings.encrypt_title} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('EncryptStorage')} testID="SecurityButton" chevron />
          <BlueCardItem leftIcon="feed" leftIconType="font-awesome" title={loc.settings.network} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('NetworkSettings')} chevron />
          {Notifications.isNotificationsCapable && (
            <BlueCardItem leftIcon="notifications" leftIconType="material-icons" title={loc.settings.notifications} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('NotificationSettings')} chevron />
          )}
          <BlueCardItem leftIcon="user-shield" leftIconType="font-awesome-5" title={loc.settings.privacy} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('SettingsPrivacy')} chevron />
          <BlueCardItem leftIcon="info" leftIconType="simple-line-icons" title={loc.settings.about} containerStyle={stylesHook.settingsCardItem} onPress={() => navigate('About')} testID="AboutButton" chevron />
        </ScrollView>
      </View>
    );
  }

  const renderFooterNavigation = () => {
    return (
      <View style={[styles.footerNavigationWrapper, stylesHook.footerNavigationWrapper]}>
        <NavContainer>
          <NavIconButton
            onPress={navigateToWalletsList}
            icon={<Icon name="wallet" type="simple-line-icon" color={colors.foregroundColor} />}
            //text={loc._.enter_password}
            testID="NavigationHomeButton"
            width={10}
          />
          <NavIconButton
            onPress={navigateToAddWalletRoot}
            icon={<Icon name="plus" type="simple-line-icon" color={colors.foregroundColor} />}
            //text={loc._.enter_password}
            testID="NavigationAddWalletButton"
            width={10}
          />
          <NavIconButton
            onPress={navigateToSettings}
            icon={<Icon name="settings" type="simple-line-icon" color={colors.foregroundColor} />}
            //text={loc._.enter_password + 'again'}
            testID="NavigationSettingsButton"
            width={10}
          />
        </NavContainer>
      </View>
    );
  };

  return (
    <SafeBlueArea forceInset={{ horizontal: 'always' }} style={[styles.root, stylesHook.root]}>
      {renderScrollView()}
      
      {renderFooterNavigation()}
    </SafeBlueArea>
  );
};

export default Settings;
Settings.navigationOptions = navigationStyle({
  title: loc.settings.header,
});
