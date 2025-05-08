"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Switch, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useFocusEffect, useRouter } from "expo-router"
import { usePcBuildStore } from "~/data/usePcBuilds"
import axios from "axios"
import { TPcComponent } from "~/data/pcComponents"
import { PcBuild } from "~/data/usePcBuilds"
import { useAuthStore } from "~/data/useAuthStore"
// Mock user data
const mockUser = {
  id: "user123",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://placeholder.svg?height=200&width=200",
  joinDate: "January 2023",
}

// Mock saved builds
const mockSavedBuilds = [
  {
    id: "build1",
    name: "Gaming PC",
    date: "2023-08-15",
    totalPrice: 1899.99,
    components: 7,
    thumbnail: "https://placeholder.svg?height=100&width=100",
  },
  {
    id: "build2",
    name: "Workstation",
    date: "2023-07-22",
    totalPrice: 2499.99,
    components: 8,
    thumbnail: "https://placeholder.svg?height=100&width=100",
  },
  {
    id: "build3",
    name: "Budget Build",
    date: "2023-06-10",
    totalPrice: 899.99,
    components: 6,
    thumbnail: "https://placeholder.svg?height=100&width=100",
  },
]

const ProfileScreen: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState(mockUser)
  const [savedBuilds, setSavedBuilds] = useState(mockSavedBuilds)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const setCurrentBuild = usePcBuildStore((state) => state.setCurrentBuild)
  const builds = usePcBuildStore((state) => state.builds)
  const setBuilds = usePcBuildStore((state) => state.setBuilds)
  const userId = useAuthStore((state) => state.user?._id);

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "This feature will be available soon!")
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            // Handle logout logic here
            Alert.alert("Logged out successfully")
          },
        },
      ],
      { cancelable: true },
    )
  }

  async function fetchComponentById(type: string, id: string): Promise<TPcComponent | null> {
    try {
      const res = await axios.get(`http://10.0.2.2:5000/api/${type.toLowerCase()}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch ${type} with id ${id}`, error);
      return null;
    }
  }

  async function transformToPcBuilds(builds: any[]): Promise<PcBuild[]> {
    const pcBuilds: PcBuild[] = await Promise.all(
      builds.map(async (build) => {
        const componentTypes = [
          { key: "cpuId", type: "CPU" },
          { key: "gpuId", type: "GPU" },
          { key: "memoryId", type: "Memory" },
          { key: "motherboardId", type: "Motherboard" },
          { key: "driveId", type: "Drive" },
          { key: "keyboardId", type: "Keyboard" },
          { key: "mouseId", type: "Mouse" },
        ];

        const components = await Promise.all(
          componentTypes
            .filter(({ key }) => build[key]) // kiểm tra có id không
            .map(({ key, type }) => fetchComponentById(type, build[key]))
        );

        return {
          id: build._id,
          name: build.name,
          components: components.filter((c): c is TPcComponent => c !== null),
        };
      })
    );
    return pcBuilds;
  }

  const fetchBuilds = async () => {
    try {
      const res = await axios.get(`http://10.0.2.2:5000/api/build/user/${userId}`, {
        headers: {
          Authorization: `Bearer`,
        },
      });
      const builds = res.data
      const pcBuilds = await transformToPcBuilds(builds);
      setBuilds(pcBuilds);
    } catch (err) {
      console.error("Lỗi khi fetch builds:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBuilds();
    }, [])
  )

  const handleDeleteBuild = async (buildId: string) => {
    try {
      console.log(buildId)
      const res = await axios.delete(`http://10.0.2.2:5000/api/build/${buildId}`);
      console.log(res.data.message);
      fetchBuilds();
    } catch (error) {
      console.error("Lỗi khi xóa build:", error);
    }
  }



  const handleViewBuild = (buildId: string) => {
    console.log(buildId)
    setCurrentBuild(buildId)
    router.push("/(stack)/(tabs)/build")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userJoinDate}>Member since {user.joinDate}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Saved Builds</Text>
          {builds.length > 0 ? (
            builds.map((build) => (
              <View key={build.id} style={styles.buildCard}>
                <Image source={{ uri: "https://placeholder.svg?height=100&width=100" }} style={styles.buildThumbnail} />
                <View style={styles.buildInfo}>
                  <Text style={styles.buildName}>{build.name}</Text>
                  <Text style={styles.buildDate}>Created on 2023-08-15</Text>
                  <View style={styles.buildDetails}>
                    <Text style={styles.buildPrice}>${build.components.reduce((sum, component) => sum + component.price, 0).toFixed(2)}</Text>
                    <Text style={styles.buildComponents}>{build.components.length} components</Text>
                  </View>
                </View>
                <View style={styles.buildActions}>
                  <TouchableOpacity style={styles.buildActionButton} onPress={() => handleViewBuild(build.id)}>
                    <Ionicons name="eye-outline" size={20} color="#0084C8" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buildActionButton} onPress={() => handleDeleteBuild(build.id)}>
                    <Ionicons name="trash-outline" size={20} color="#FF5A5A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyBuilds}>
              <Ionicons name="desktop-outline" size={48} color="#ccc" />
              <Text style={styles.emptyBuildsText}>No saved builds yet</Text>
              <TouchableOpacity style={styles.startBuildButton} onPress={() => router.navigate("/build")}>
                <Text style={styles.startBuildButtonText}>Start a New Build</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#ccc", true: "#0084C8" }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#ccc", true: "#0084C8" }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="pricetag-outline" size={24} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Price Alerts</Text>
            </View>
            <Switch
              value={priceAlerts}
              onValueChange={setPriceAlerts}
              trackColor={{ false: "#ccc", true: "#0084C8" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons name="help-circle-outline" size={24} color="#333" style={styles.aboutIcon} />
            <Text style={styles.aboutLabel}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons name="document-text-outline" size={24} color="#333" style={styles.aboutIcon} />
            <Text style={styles.aboutLabel}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#333" style={styles.aboutIcon} />
            <Text style={styles.aboutLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons name="information-circle-outline" size={24} color="#333" style={styles.aboutIcon} />
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  userJoinDate: {
    fontSize: 12,
    color: "#999",
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#0084C8",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  }, buildCard: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 15,
  },
  buildThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  buildInfo: {
    flex: 1,
  },
  buildName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  buildDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  buildDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  buildPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0084C8",
    marginRight: 10,
  },
  buildComponents: {
    fontSize: 12,
    color: "#666",
  },
  buildActions: {
    flexDirection: "column",
    justifyContent: "center",
  },
  buildActionButton: {
    padding: 8,
  },
  emptyBuilds: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyBuildsText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  startBuildButton: {
    backgroundColor: "#0084C8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  startBuildButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  aboutIcon: {
    marginRight: 15,
  },
  aboutLabel: {
    fontSize: 16,
    flex: 1,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    height: 60,
  },
  footerTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#0084C8",
  },
  tabText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  activeTabText: {
    fontSize: 12,
    color: "#0084C8",
    fontWeight: "500",
    marginTop: 2,
  },
})

export default ProfileScreen
