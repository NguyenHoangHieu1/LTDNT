import React from "react";
import { Stack } from "expo-router";

const BuildLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "Build", headerShown: false }}
      />
      <Stack.Screen
        name="list_prd_base_categories"
        options={{
          headerShown: false, // Ẩn toàn bộ header
        }}
      />
    </Stack>
  );
};

export default BuildLayout;