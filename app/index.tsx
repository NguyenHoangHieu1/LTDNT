import React, { useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainScreen = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem('userToken').then((token) => {
      if (initialized && !token) {
        router.replace('/login');
      }
    });
  }, [initialized]);
  useEffect(() => {
    setInitialized(true);
  }, []);
  return <Redirect href={'/login'} />;
};

export default MainScreen;
