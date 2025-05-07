import { JSX, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type AdminRoute = 'cpu' | 'motherboard' | 'gpu' | 'ram' | 'storage' | 'keyboard' | 'mouse';

const iconColor = '#0084C8';
const iconSize = 24;

const withFeatherIcon = (name: React.ComponentProps<typeof Feather>['name']) => () => {
  return <Feather name={name} size={iconSize} color={iconColor} />;
};
const withFontAwesome = (name: React.ComponentProps<typeof FontAwesome>['name']) => () => (
  <FontAwesome name={name} size={iconSize} color={iconColor} />
);
const withMaterialIcon =
  (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) => () => (
    <MaterialCommunityIcons name={name} size={iconSize} color={iconColor} />
  );

const componentTypes: {
  name: string;
  icon: () => JSX.Element;
  count: number;
  route: AdminRoute;
}[] = [
  { name: 'CPU', icon: withFeatherIcon('cpu'), count: 12, route: 'cpu' },
  { name: 'Motherboard', icon: withFeatherIcon('box'), count: 8, route: 'motherboard' },
  { name: 'GPU', icon: withFeatherIcon('monitor'), count: 15, route: 'gpu' },
  { name: 'RAM', icon: withFeatherIcon('database'), count: 10, route: 'ram' },
  { name: 'Storage', icon: withFeatherIcon('hard-drive'), count: 14, route: 'storage' },
  { name: 'Keyboard', icon: withFontAwesome('keyboard-o'), count: 6, route: 'keyboard' },
  { name: 'Mouse', icon: withMaterialIcon('mouse'), count: 7, route: 'mouse' },
];

const AdminScreen = () => {
  const router = useRouter();
  const [recentActivity] = useState([
    { action: 'Added', component: 'NVIDIA RTX 4070', time: '2 hours ago', user: 'Admin' },
    { action: 'Updated', component: 'Intel Core i9-13900K', time: '5 hours ago', user: 'Admin' },
    { action: 'Deleted', component: 'Corsair K70 RGB', time: 'Yesterday', user: 'Admin' },
    { action: 'Added', component: 'Samsung 990 PRO NVMe SSD', time: 'Yesterday', user: 'Admin' },
    { action: 'Updated', component: 'G.Skill Trident Z5 RGB', time: '2 days ago', user: 'Admin' },
  ]);

  const navigateToComponent = (route: AdminRoute) => {
    router.push(`/admin/${route}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>72</Text>
            <Text style={styles.statLabel}>Total Components</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Recent Updates</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Manage Components</Text>
        <View style={styles.componentsGrid}>
          {componentTypes.map((component, index) => (
            <TouchableOpacity
              key={index}
              style={styles.componentCard}
              onPress={() => navigateToComponent(component.route)}>
              <View style={styles.componentIconContainer}>{component.icon()}</View>
              <Text style={styles.componentName}>{component.name}</Text>
              <View style={styles.componentFooter}>
                <Text style={styles.componentCount}>{component.count} items</Text>
                <Feather name="arrow-right" size={16} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          {recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityBadge}>
                <Text style={styles.activityBadgeText}>
                  {activity.action === 'Added' ? '+' : activity.action === 'Updated' ? '↻' : '−'}
                </Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>
                  <Text style={styles.activityAction}>{activity.action}</Text> {activity.component}
                </Text>
                <Text style={styles.activityMeta}>
                  {activity.time} by {activity.user}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0084C8',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  componentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  componentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  componentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentCount: {
    fontSize: 12,
    color: '#666',
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#f0f9ff',
  },
  activityBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0084C8',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityAction: {
    fontWeight: 'bold',
  },
  activityMeta: {
    fontSize: 12,
    color: '#666',
  },
});

export default AdminScreen;
