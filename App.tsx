/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useColorScheme} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = 'bg-neutral-300 dark:bg-slate-900';

  return <HomeScreen />;
}

export default App;
