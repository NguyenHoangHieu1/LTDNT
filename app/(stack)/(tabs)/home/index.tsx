import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigationStore } from '~/libs/stateChangePage';
import { pcComponents } from '~/data/pcComponents';

// Sample data for categories
const categories = [
  { id: '1', name: 'Graphics Cards', icon: '🎮', color: ['#FF7675', '#D63031'] },
  { id: '2', name: 'Processors', icon: '⚡', color: ['#74B9FF', '#0984E3'] },
  { id: '3', name: 'Motherboards', icon: '🔌', color: ['#55EFC4', '#00B894'] },
  { id: '4', name: 'Memory (RAM)', icon: '💾', color: ['#A29BFE', '#6C5CE7'] },
  { id: '5', name: 'Storage', icon: '💿', color: ['#FAB1A0', '#E17055'] },
  { id: '6', name: 'Power Supplies', icon: '⚡', color: ['#FFD166', '#F0932B'] },
  { id: '7', name: 'Cases', icon: '📦', color: ['#FFEAA7', '#FDCB6E'] },
  { id: '8', name: 'Cooling', icon: '❄️', color: ['#81ECEC', '#00CEC9'] },
];


const MainScreen = ({ navigation }: any) => {
  const navigationStore = useNavigationStore.getState()
  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => console.log(`Selected category: ${item.name}`)}>
      <LinearGradient
        colors={item.color}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={styles.categoryName}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderProductItem = (item: any, index: any) => {
    const router = useRouter();
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.productItem}
        onPress={() => {
          navigationStore.setData('product', item);
          router.navigate('/home/product_detail')
        }}>
        <View style={styles.productImageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
          ) : (
            <View
              style={[
                styles.productImagePlaceholder,
                { backgroundColor: categories[index % categories.length].color[0] },
              ]}>
              <Text style={styles.productImagePlaceholderText}>{item.type.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productType}>{item.type}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const renderBuildItem = (item: any, index: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.buildItem}
      onPress={() => console.log(`Selected build: ${item.name}`)}>
      <LinearGradient
        colors={categories[index % categories.length].color as [string, string, ...string[]]}
        style={styles.buildGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.buildContent}>
          <Text style={styles.buildName}>{item.name}</Text>
          <Text style={styles.buildCreator}>by {item.creator}</Text>
          <View style={styles.buildStats}>
            <Text style={styles.buildStatText}>{item.parts} parts</Text>
            <Text style={styles.buildStatText}>❤️ {item.likes}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />


      <View style={styles.header}>
        <Text style={styles.headerTitle}>PC Builder</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconButtonText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconButtonText}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Build Your Dream PC</Text>
          <Text style={styles.welcomeSubtitle}>
            Browse parts, create builds, and share with the community
          </Text>
        </View>


        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text
                style={styles.sectionAction}
                onPress={() => router.push('/(stack)/(tabs)/home/list_product')}>
                See All
              </Text>
            </TouchableOpacity>
          </View>


          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>


        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text
                style={styles.sectionAction}
                onPress={() => router.push('/(stack)/(tabs)/home/list_product')}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}>
            {pcComponents.map((item, index) => renderProductItem(item, index))}
          </ScrollView>
        </View>


        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity>
              <Text
                style={styles.sectionAction}
                onPress={() => router.push('/(stack)/(tabs)/home/list_product')}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}>
            {pcComponents.map((item, index) => renderProductItem(item, index))}
          </ScrollView>
        </View>


        <View style={styles.buildsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Builds</Text>
            <TouchableOpacity>
              <Text
                style={styles.sectionAction}
                onPress={() => router.push('/(stack)/(tabs)/home/list_product')}>
                See All
              </Text>
            </TouchableOpacity>
          </View>


          <View style={styles.buildsList}>
            {pcComponents.map((item, index) => renderBuildItem(item, index))}
          </View>
        </View>


        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconButtonText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionAction: {
    fontSize: 14,
    color: '#FF7675',
    fontWeight: '500',
  },
  categoriesSection: {
    marginTop: 10,
    marginBottom: 25,
  },
  categoriesList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  categoryItem: {
    width: 120,
    height: 100,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  featuredSection: {
    marginBottom: 25,
  },
  trendingSection: {
    marginBottom: 25,
  },
  productsList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  productItem: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 120,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImagePlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  productType: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7675',
  },
  buildsSection: {
    marginBottom: 25,
  },
  buildsList: {
    paddingHorizontal: 20,
  },
  buildItem: {
    height: 100,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buildGradient: {
    flex: 1,
    padding: 15,
  },
  buildContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buildName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buildCreator: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buildStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buildStatText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  spacer: {
    height: 20,
  },
});

export default MainScreen;
