import React from "react";
import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "Profile", headerShown: false }}
      />
    </Stack>
  );
};

export default ProfileLayout;