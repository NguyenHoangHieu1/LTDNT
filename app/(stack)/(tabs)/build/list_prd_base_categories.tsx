import React, { useState, useCallback, useEffect } from 'react';
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
import { COLORS } from '~/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { TPcComponent, pcComponents } from '~/data/pcComponents';
import { usePcComponentStore } from '~/data/usePcComponentStore';
import axios from 'axios';
import { useNavigationStore } from '~/libs/stateChangePage';
import { API_IMAGE_URL, API_URL } from '~/libs/api';

// Định nghĩa màu của header
const HEADER_COLORS = COLORS.MainBlue; // Gradient xanh dương nhạt đến đậm

const LstPrdBaseCategorySc = ({ route, navigation }: any) => {
  // In a real app, you would get the category from route.params
  // For this example, we'll default to 'Graphics Cards'
  const categoryName = route?.params?.category || 'Graphics Cards';
  const components = usePcComponentStore((state) => state.components);
  const addComponent = usePcComponentStore((state) => state.addComponent);
  const hasComponent = usePcComponentStore((state) => state.hasComponent);

  //@ts-ignore
  const { type } = useLocalSearchParams();
  const typeObj = type ? JSON.parse(type as string) : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'

  const [items, setItems] = useState<TPcComponent[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);

  let apiUrl;
  switch (typeObj) {
    case 'CPU':
      apiUrl = API_URL + '/cpu/paginated';
      break;
    case 'Motherboard':
      apiUrl = API_URL + '/motherboard/paginated';
      break;
    case 'RAM':
      apiUrl = API_URL + '/memory/paginated';
      break;
    case 'GPU':
      apiUrl = API_URL + '/gpu/paginated';
      break;
    case 'Storage':
      apiUrl = API_URL + '/drive/paginated';
      break;
    case 'Keyboard':
      apiUrl = API_URL + '/keyboard/paginated';
      break;
    case 'Mouse':
      apiUrl = API_URL + '/mouse/paginated';
      break;
    default:
      return;
  }

  const fetchBuilds = useCallback(async () => {
    if (loading || (totalPages && page > totalPages)) return;

    setLoading(true);
    console.log(apiUrl);
    try {
      const res = await axios.get(apiUrl, {
        params: { page },
        headers: {
          Authorization: `Bearer yourToken`, // nếu API có bảo vệ
        },
      });

      setItems((prev) => [...prev, ...res.data.items]);
      setTotalPages(res.data.totalPages);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, loading]);

  useEffect(() => {
    fetchBuilds();
  }, []);

  const addComponentAndMove = (item: any) => {
    addComponent(item);
    router.back();
  };

  const productDetail = (product: TPcComponent) => {
    useNavigationStore.getState().setData('product', product);
    router.push('/(stack)/(tabs)/home/product_detail');
  };

  const fetchBuildsByQuery = useCallback(
    async (query = '') => {
      if (loading || (totalPages && page > totalPages)) return;

      let apiUrl;
      switch (typeObj) {
        case 'CPU':
          apiUrl = API_URL + '/cpu/paginated';
          break;
        case 'Motherboard':
          apiUrl = API_URL + '/motherboard/paginated';
          break;
        case 'RAM':
          apiUrl = API_URL + '/memory/paginated';
          break;
        case 'GPU':
          apiUrl = API_URL + '/gpu/paginated';
          break;
        case 'Storage':
          apiUrl = API_URL + '/drive/paginated';
          break;
        case 'Keyboard':
          apiUrl = API_URL + '/keyboard/paginated';
          break;
        case 'Mouse':
          apiUrl = API_URL + '/mouse/paginated';
          break;
        default:
          return;
      }

      setLoading(true);
      try {
        const res = await axios.get(apiUrl, {
          params: {
            page,
            name: query.trim(), // thêm query tìm kiếm
          },
          headers: {
            Authorization: `Bearer yourToken`,
          },
        });

        setItems((prev) => [...prev, ...res.data.items]);
        setTotalPages(res.data.totalPages);
        setPage((prev) => prev + 1);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    },
    [page, totalPages, loading, activeFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([]);
      setPage(1); // reset về trang đầu
      fetchBuildsByQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  const renderProductItem = ({ item }: any) => {
    console.log(API_IMAGE_URL + item.specs.image);
    return (
      <TouchableOpacity
        style={viewType === 'grid' ? styles.gridItem : styles.listItem}
        onPress={() => productDetail(item)}>
        <View style={viewType === 'grid' ? styles.gridImageContainer : styles.listImageContainer}>
          {item.image ? (
            <Image
              source={{ uri: 'http://10.0.2.2:5000/uploads/cpu/cpu2.jpg' }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.productImagePlaceholder, { backgroundColor: HEADER_COLORS[0] }]}>
              {/* <Text style={styles.productImagePlaceholderText}>{item.brand.charAt(0)}</Text> */}
            </View>
          )}
        </View>

        <View style={viewType === 'grid' ? styles.gridProductInfo : styles.listProductInfo}>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productSpecs} numberOfLines={1}>
            {/* {item.specs} */}
            {Object.entries(item.specs)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' ')}
          </Text>

          <View style={styles.productRating}></View>

          <View style={styles.priceAndAddContainer} pointerEvents="box-none">
            <Text style={styles.productPrice}>{item.price}$</Text>
            {hasComponent(item) ? (
              <TouchableOpacity
                style={styles.hasButton}
                disabled={true}
                onPress={() => addComponentAndMove(item)}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={() => addComponentAndMove(item)}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{typeObj} Products</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search stroke="#666666" width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${typeObj} products`}
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Use combination of id and index
        numColumns={viewType === 'grid' ? 2 : 1}
        key={viewType}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No products found</Text>
            <Text style={styles.emptyListSubtext}>Try adjusting your search or filters</Text>
          </View>
        }
        onEndReached={fetchBuilds}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Màu nền chính: trắng
  },
  header: {
    maxHeight: 60,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    // Chữ trong header: trắng để tương phản với gradient xanh
  },
  headerActions: {
    flexDirection: 'row',
  },
  viewToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0', // Nút toggle: xám nhạt
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
    backgroundColor: '#FFFFFF', // Nền của thanh tìm kiếm: trắng
  },
  searchInputContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0', // Ô tìm kiếm: xám nhạt
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
    color: '#000000', // Chữ trong ô tìm kiếm: đen
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F0F0', // Nút filter: xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F0F0', // Nút sort: xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterOptionsContainer: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF', // Nền của filter options: trắng
  },
  filterOptionsList: {
    paddingHorizontal: 15,
  },
  filterOptionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0', // Nút filter: xám nhạt
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#74B9FF', // Nút filter active: xanh nhạt (phù hợp với header)
  },
  filterOptionText: {
    color: '#000000', // Chữ của filter: đen
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF', // Chữ của filter active: trắng
    fontWeight: 'bold',
  },
  productsList: {
    padding: 10,
    backgroundColor: '#FFFFFF', // Nền của danh sách sản phẩm: trắng
  },
  gridItem: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: '47.5%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  listItem: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  gridImageContainer: {
    height: 120,
    backgroundColor: '#E0E0E0', // Nền placeholder của hình ảnh: xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  listImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#E0E0E0', // Nền placeholder của hình ảnh: xám nhạt
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
    color: '#FFFFFF', // Chữ trong placeholder: trắng
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền badge "Out of Stock": đen mờ
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  outOfStockText: {
    color: '#FFFFFF', // Chữ "Out of Stock": trắng
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
    color: '#666666', // Chữ thương hiệu: xám đậm
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000', // Tên sản phẩm: đen
    marginBottom: 4,
  },
  productSpecs: {
    fontSize: 12,
    color: '#666666', // Thông số: xám đậm
    marginBottom: 6,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFD700', // Điểm đánh giá: vàng
    fontWeight: 'bold',
  },
  priceAndAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Giá và nút Add chia đều không gian
  },
  addButton: {
    backgroundColor: '#28A745', // Màu xanh lá cây
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hasButton: {
    backgroundColor: '#D3D3D3', // Màu xám
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF', // Chữ trắng
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666666', // Số lượng đánh giá: xám đậm
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7675', // Giá: đỏ hồng (giữ nguyên)
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Chữ "No products found": đen
    marginBottom: 8,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: '#666666', // Chữ phụ: xám đậm
    textAlign: 'center',
  },
});

export default LstPrdBaseCategorySc;
