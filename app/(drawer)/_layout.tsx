import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

// import { HeaderButton } from '~/components/HeaderButton';
import Colors from '~/utils/Colors';

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.bg_dark,
        },
        headerTintColor: Colors.white,
        drawerStyle: {
          backgroundColor: Colors.bg_dark,
        },
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.white,
      }}>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'PC Builder',
          drawerLabel: 'PC Builder',
          drawerIcon: ({ size, color }) => <MaterialIcons name="build" size={size} color={color} />,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <HeaderButton />
          //   </Link>
          // ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
