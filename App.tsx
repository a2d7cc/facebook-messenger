/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {ScrollView, View, StyleSheet, useColorScheme} from 'react-native';
import {
  Provider as PaperProvider,
  BottomNavigation as Screens,
  Text,
} from 'react-native-paper';

import {SafeAreaProvider} from 'react-native-safe-area-context';

interface NavRoutes {
  key: string;
  title: string;
  focusedIcon: string;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState<NavRoutes[]>([
    {
      key: 'chats',
      title: 'Chats',
      focusedIcon: 'chat',
    },
    {key: 'calls', title: 'Calls', focusedIcon: 'video'},
    {key: 'people', title: 'People', focusedIcon: 'account'},
    {key: 'stories', title: 'Stories', focusedIcon: 'book'},
  ]);

  const renderScene = Screens.SceneMap({
    chats: () => <Text>Music</Text>,
    calls: () => <Text>Albums</Text>,
    people: () => <Text>Albums</Text>,
    stories: () => <Text>Albums</Text>,
  });

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Screens
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});

export default App;
