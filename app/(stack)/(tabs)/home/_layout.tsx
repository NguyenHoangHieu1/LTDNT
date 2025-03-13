import React from 'react';
import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'Home', headerShown: false }} />
      <Stack.Screen name="infor" options={{ headerTitle: 'Information', headerShown: false }} />
      <Stack.Screen
        name="list_product"
        options={{ headerTitle: 'List Product', headerShown: false }}
      />
    </Stack>
  );
};

export default HomeLayout;
