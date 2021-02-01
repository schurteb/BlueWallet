import React, { useState, useEffect, useContext } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import navigationStyle from '../../components/navigationStyle';
import { SafeBlueArea, BlueListItem, BlueText, BlueCard } from '../../BlueComponents';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';
const theme = require('../../blue_modules/theme');

const data = Object.values(['auto', 'light', 'dark']);

const Theme = () => {
  const { setPreferredTheme } = useContext(BlueStorageContext);
  const [isSavingNewPreferredTheme, setIsSavingNewPreferredTheme] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const { colors } = useTheme();
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
    const fetchTheme = async () => {
      try {
        const preferredTheme = await theme.getPreferredTheme();
        if (preferredTheme === null) {
          throw Error();
        }
        setSelectedTheme(preferredTheme);
      } catch (_error) {
        setSelectedTheme('auto');
      }
    };
    fetchTheme();
  }, []);

  if (selectedTheme !== null && selectedTheme !== undefined) {
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
                disabled={isSavingNewPreferredTheme}
                title={`${item}`}
                checkmark={selectedTheme === item}
                onPress={async () => {
                  setIsSavingNewPreferredTheme(true);
                  setSelectedTheme(item);
                  await theme.setPreferredTheme(item);
                  //await theme.startUpdater();
                  setIsSavingNewPreferredTheme(false);
                  setPreferredTheme();
                }}
              />
            );
          }}
        />
        <BlueCard>
          <BlueText>
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

Theme.navigationOptions = navigationStyle({
  title: loc.settings.theme,
});

export default Theme;
