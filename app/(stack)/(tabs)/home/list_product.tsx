import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Filter, Search } from 'react-native-feather';

// Sample data for GPUs
const gpuData = [
  {
    id: '1',
    name: 'NVIDIA RTX 3050',
    brand: 'Gigabyte',
    price: '$249',
    specs: '8GB GDDR6, 2560 CUDA Cores',
    rating: 4.3,
    reviews: 128,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0jKlHyWoB3HOv2qnniF7OplneySjzx.png',
    inStock: true,
  },
  {
    id: '2',
    name: 'NVIDIA RTX 4060',
    brand: 'MSI',
    price: '$299',
    specs: '8GB GDDR6X, 3072 CUDA Cores',
    rating: 4.5,
    reviews: 87,
    image: null,
    inStock: true,
  },
  {
    id: '3',
    name: 'NVIDIA RTX 3060 Ti',
    brand: 'ASUS',
    price: '$399',
    specs: '8GB GDDR6, 4864 CUDA Cores',
    rating: 4.7,
    reviews: 256,
    image: null,
    inStock: true,
  },
  {
    id: '4',
    name: 'AMD Radeon RX 6600',
    brand: 'Sapphire',
    price: '$279',
    specs: '8GB GDDR6, 1792 Stream Processors',
    rating: 4.2,
    reviews: 112,
    image: null,
    inStock: true,
  },
  {
    id: '5',
    name: 'NVIDIA RTX 4070',
    brand: 'EVGA',
    price: '$599',
    specs: '12GB GDDR6X, 5888 CUDA Cores',
    rating: 4.8,
    reviews: 94,
    image: null,
    inStock: false,
  },
  {
    id: '6',
    name: 'AMD Radeon RX 7600',
    brand: 'XFX',
    price: '$269',
    specs: '8GB GDDR6, 2048 Stream Processors',
    rating: 4.1,
    reviews: 76,
    image: null,
    inStock: true,
  },
  {
    id: '7',
    name: 'NVIDIA RTX 4060 Ti',
    brand: 'Zotac',
    price: '$449',
    specs: '16GB GDDR6, 4352 CUDA Cores',
    rating: 4.6,
    reviews: 63,
    image: null,
    inStock: true,
  },
  {
    id: '8',
    name: 'AMD Radeon RX 6700 XT',
    brand: 'PowerColor',
    price: '$429',
    specs: '12GB GDDR6, 2560 Stream Processors',
    rating: 4.4,
    reviews: 142,
    image: null,
    inStock: true,
  },
];

// Sample data for CPUs
const cpuData = [
  {
    id: '1',
    name: 'AMD Ryzen 5 5600X',
    brand: 'AMD',
    price: '$199',
    specs: '6 Cores, 12 Threads, 3.7GHz Base',
    rating: 4.7,
    reviews: 312,
    image: null,
    inStock: true,
  },
  {
    id: '2',
    name: 'Intel Core i5-12600K',
    brand: 'Intel',
    price: '$249',
    specs: '10 Cores, 16 Threads, 3.7GHz Base',
    rating: 4.6,
    reviews: 187,
    image: null,
    inStock: true,
  },
  {
    id: '3',
    name: 'AMD Ryzen 7 5800X3D',
    brand: 'AMD',
    price: '$329',
    specs: '8 Cores, 16 Threads, 3.4GHz Base',
    rating: 4.9,
    reviews: 156,
    image: null,
    inStock: false,
  },
  {
    id: '4',
    name: 'Intel Core i7-13700K',
    brand: 'Intel',
    price: '$409',
    specs: '16 Cores, 24 Threads, 3.4GHz Base',
    rating: 4.8,
    reviews: 134,
    image: null,
    inStock: true,
  },
  {
    id: '5',
    name: 'AMD Ryzen 9 7900X',
    brand: 'AMD',
    price: '$449',
    specs: '12 Cores, 24 Threads, 4.7GHz Base',
    rating: 4.7,
    reviews: 98,
    image: null,
    inStock: true,
  },
  {
    id: '6',
    name: 'Intel Core i9-13900K',
    brand: 'Intel',
    price: '$589',
    specs: '24 Cores, 32 Threads, 3.0GHz Base',
    rating: 4.8,
    reviews: 112,
    image: null,
    inStock: true,
  },
];

// Category data
const categories = {
  'Graphics Cards': {
    title: 'Graphics Cards',
    data: gpuData,
    color: ['#FF7675', '#D63031'],
    icon: '🎮',
  },
  Processors: {
    title: 'Processors',
    data: cpuData,
    color: ['#74B9FF', '#0984E3'],
    icon: '⚡',
  },
};

const CategoryScreen = ({ route, navigation }: any) => {
const CategoryScreen = ({ route, navigation }: any) => {
  // In a real app, you would get the category from route.params
  // For this example, we'll default to 'Graphics Cards'
  const categoryName = route?.params?.category || 'Graphics Cards';
  //@ts-ignore
  const category = categories[categoryName];


  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'


  // Filter options
  const filterOptions = ['All', 'In Stock', 'NVIDIA', 'AMD'];


  // Filter products based on search and active filter
  const filteredProducts = category.data.filter((product: any) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'In Stock') return matchesSearch && product.inStock;
    if (activeFilter === 'NVIDIA') return matchesSearch && product.name.includes('NVIDIA');
    if (activeFilter === 'AMD') return matchesSearch && product.name.includes('AMD');


    return matchesSearch;
  });

  const renderProductItem = ({ item }: any) => (
    <TouchableOpacity

  const renderProductItem = ({ item }: any) => (
    <TouchableOpacity
      style={viewType === 'grid' ? styles.gridItem : styles.listItem}
      onPress={() => console.log(`Selected product: ${item.name}`)}>
      <View style={viewType === 'grid' ? styles.gridImageContainer : styles.listImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
        ) : (
          <View style={[styles.productImagePlaceholder, { backgroundColor: category.color[0] }]}>
            <Text style={styles.productImagePlaceholderText}>{item.brand.charAt(0)}</Text>
          </View>
        )}
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>


      <View style={viewType === 'grid' ? styles.gridProductInfo : styles.listProductInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productSpecs} numberOfLines={1}>
          {item.specs}
        </Text>

        <View style={styles.productRating}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviews})</Text>
        </View>


        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />


      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft stroke="#FFFFFF" width={24} height={24} />
        </TouchableOpacity>


        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{category.title}</Text>
          <Text style={styles.headerSubtitle}>{filteredProducts.length} products</Text>
        </View>


        <View style={styles.headerActions}>
          <TouchableOpacity
          <TouchableOpacity
            style={styles.viewToggleButton}
            onPress={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}>
            <Text style={styles.viewToggleText}>{viewType === 'grid' ? '📋' : '📱'}</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search stroke="#AAAAAA" width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search graphics cards..."
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>


        <TouchableOpacity style={styles.filterButton}>
          <Filter stroke="#FFFFFF" width={20} height={20} />
        </TouchableOpacity>


        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.filterOptionText}>Sort</Text>

          {/* <SortAsc stroke="#FFFFFF" width={20} height={20} /> */}
        </TouchableOpacity>
      </View>


      <View style={styles.filterOptionsContainer}>
        <FlatList
          data={filterOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterOptionButton,
                activeFilter === item && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(item)}>
              <Text
                style={[styles.filterOptionText, activeFilter === item && styles.activeFilterText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterOptionsList}
        />
      </View>


      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={viewType === 'grid' ? 2 : 1}
        key={viewType} // Force re-render when view type changes
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No products found</Text>
            <Text style={styles.emptyListSubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
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
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  headerActions: {
    flexDirection: 'row',
  },
  viewToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggleText: {
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#333333',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterOptionsContainer: {
    marginVertical: 10,
  },
  filterOptionsList: {
    paddingHorizontal: 15,
  },
  filterOptionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333333',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#FF7675',
  },
  filterOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  activeFilterText: {
    fontWeight: 'bold',
  },
  productsList: {
    padding: 10,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: '47.5%',
  },
  listItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  gridImageContainer: {
    height: 120,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  listImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gridProductInfo: {
    padding: 12,
  },
  listProductInfo: {
    padding: 12,
    flex: 1,
  },
  productBrand: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  productSpecs: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 6,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  reviewCount: {
    fontSize: 12,
    color: '#AAAAAA',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7675',
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
});

export default CategoryScreen;
