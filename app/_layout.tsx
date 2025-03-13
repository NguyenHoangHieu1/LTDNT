import '../global.css';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(stack)',
};

// Prevent the splash screen from auto-hidng before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loader, error] = useFonts({
    PTSer: require('~/assets/fonts/PTSerifCaption-Regular.ttf'),
    'PTSer-i': require('~/assets/fonts/PTSerifCaption-Italic.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loader) {
      SplashScreen.hideAsync();
    }
  }, [loader]);

  if (!loader) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(stack)" />
        <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
