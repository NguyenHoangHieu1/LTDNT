import React from "react";
import { Stack } from "expo-router";

const AILayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerTitle: "Build", headerShown: false }}
            />
        </Stack>
    );
};

export default AILayout;