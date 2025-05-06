import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigationStore } from '~/libs/stateChangePage';
import { pcComponents } from '~/data/pcComponents';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Menu, Search, Home, Settings, User, HelpCircle, Info } from "react-native-feather"
import { Logo, Tool, Product } from '~/assets/icon';
import { usePcBuildStore } from '~/data/usePcBuilds';
import { usePcComponentStore } from '~/data/usePcComponentStore';

// Sample data for categories
const { width } = Dimensions.get("window")
const DRAWER_WIDTH = width * 0.75

const MainScreen = ({ navigation }: any) => {
  const [overlayOpacity, setOverlayOpacity] = useState(0.1); // ban đầu mờ 50%
  const [drawerOpen, setDrawerOpen] = useState(false)
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current
  const navigationStore = useNavigationStore.getState()
  const setCurrentBuild = usePcBuildStore((state) => state.setCurrentBuild)
  const clearComponents = usePcComponentStore((state) => state.clearComponents)
  const router = useRouter();

  const menuItems = [
    { name: "Build", icon: Tool, screen: "/build" },
    { name: "Products", icon: Product, screen: '/(stack)/(tabs)/home/list_product' },
    { name: "Compare", icon: Settings, screen: "Settings" },
    { name: "Profile", icon: User, screen: "/profile" },
    { name: "About", icon: Info, screen: "About" },
  ]

  const navigateToScreen = (screenName: any) => {
    toggleDrawer()
    router.push(screenName)
  }

  const startYourBuild = () => {
    setCurrentBuild("")
    clearComponents()
    router.push("/build")
  }

  const toggleDrawer = () => {
    if (drawerOpen) {
      // Khi chuẩn bị đóng: đổi màu overlay về trong suốt trước
      setOverlayOpacity(0); // <-- Ngay lập tức đổi màu

      // Rồi mới đóng drawer
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      // Mở drawer
      setDrawerOpen(true);
      setOverlayOpacity(0.5); // <-- Khi mở, cho overlay lại mờ 50%
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.iconContainer}>
          <Menu stroke="#000" width={24} height={24} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Logo stroke="#000" width={32} height={32} />
        </View>

        <TouchableOpacity style={styles.iconContainer}>
          <Search stroke="#000" width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.centerContent}>
          <Text style={styles.mainTitle}>Pick Parts. Build Your PC. Compare and Share.</Text>
          <Text style={styles.subTitle}>
            We provide part selection, pricing, and compatibility guidance for do-it-yourself computer builders.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startYourBuild}>
            <Text style={styles.startButtonText}>🔧 Start Your Build</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={[styles.overlay, { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }]} />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Menu</Text>
        </View>

        <View style={styles.drawerContent}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => navigateToScreen(item.screen)}>
              <item.icon stroke="#333" width={20} height={20} />
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentText: {
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: width,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    height: 120,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  screenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

})



export default MainScreen;