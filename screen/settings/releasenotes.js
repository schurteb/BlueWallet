import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import navigationStyle from '../../components/navigationStyle';
import { SafeBlueArea, BlueCard, BlueText } from '../../BlueComponents';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';

const ReleaseNotes = () => {
  const notes = require('../../release-notes');
  const { language } = useContext(BlueStorageContext);
  const { setOptions } = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    setOptions({
      title: loc.settings.about_release_notes,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, language]);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <SafeBlueArea forceInset={{ horizontal: 'always' }} style={styles.root}>
      <ScrollView>
        <BlueCard>
          <BlueText>{notes}</BlueText>
        </BlueCard>
      </ScrollView>
    </SafeBlueArea>
  );
};

ReleaseNotes.navigationOptions = navigationStyle({
  title: loc.settings.about_release_notes,
});

export default ReleaseNotes;
