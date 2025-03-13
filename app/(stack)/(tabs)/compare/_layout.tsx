import React from "react";
import { Stack } from "expo-router";

const CompareLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "Compare", headerShown: false }}
      />
    </Stack>
  );
};

export default CompareLayout;