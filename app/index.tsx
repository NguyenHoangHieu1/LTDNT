import React from 'react';
import { Redirect } from 'expo-router';

const MainScreen = () => {
  return <Redirect href={'/(stack)/(tabs)/home'} />;
};

export default MainScreen;
