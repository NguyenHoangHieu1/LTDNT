import React from 'react';
import { Stack } from 'expo-router';

const AdminLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'Admin', headerShown: false }} />
      <Stack.Screen name="cpu" options={{ headerTitle: 'Manage CPUs' }} />
      <Stack.Screen name="motherboard" options={{ headerTitle: 'Manage Motherboards' }} />
      <Stack.Screen name="gpu" options={{ headerTitle: 'Manage GPUs' }} />
      <Stack.Screen name="ram" options={{ headerTitle: 'Manage RAM' }} />
      <Stack.Screen name="storage" options={{ headerTitle: 'Manage Storage' }} />
      <Stack.Screen name="keyboard" options={{ headerTitle: 'Manage Keyboards' }} />
      <Stack.Screen name="mouse" options={{ headerTitle: 'Manage Mice' }} />
      <Stack.Screen name="[id]" options={{ headerTitle: 'Edit Component' }} />
      <Stack.Screen name="add" options={{ headerTitle: 'Add Component' }} />
    </Stack>
  );
};

export default AdminLayout;
