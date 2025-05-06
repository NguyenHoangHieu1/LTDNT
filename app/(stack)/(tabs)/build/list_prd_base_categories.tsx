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
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams } from 'expo-router';
import { TPcComponent, pcComponents } from "~/data/pcComponents"
import { usePcComponentStore } from '~/data/usePcComponentStore';
import axios from 'axios';

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
        image: null,
        inStock: true,
    },
    {
        id: '2',
        name: 'Intel Core i5-12600K',
        brand: 'Intel',
        price: '$249',
        specs: '10 Cores, 16 Threads, 3.7GHz Base',
        image: null,
        inStock: true,
    },
    {
        id: '3',
        name: 'AMD Ryzen 7 5800X3D',
        brand: 'AMD',
        price: '$329',
        specs: '8 Cores, 16 Threads, 3.4GHz Base',
        image: null,
        inStock: false,
    },
    {
        id: '4',
        name: 'Intel Core i7-13700K',
        brand: 'Intel',
        price: '$409',
        specs: '16 Cores, 24 Threads, 3.4GHz Base',
        image: null,
        inStock: true,
    },
    {
        id: '5',
        name: 'AMD Ryzen 9 7900X',
        brand: 'AMD',
        price: '$449',
        specs: '12 Cores, 24 Threads, 4.7GHz Base',
        image: null,
        inStock: true,
    },
    {
        id: '6',
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        price: '$589',
        specs: '24 Cores, 32 Threads, 3.0GHz Base',
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



// Định nghĩa màu của header
const HEADER_COLORS = COLORS.MainBlue; // Gradient xanh dương nhạt đến đậm

const LstPrdBaseCategorySc = ({ route, navigation }: any) => {
    // In a real app, you would get the category from route.params
    // For this example, we'll default to 'Graphics Cards'
    const categoryName = route?.params?.category || 'Graphics Cards';
    const components = usePcComponentStore((state) => state.components)
    const addComponent = usePcComponentStore((state) => state.addComponent)
    const hasComponent = usePcComponentStore((state) => state.hasComponent)

    //@ts-ignore
    const category = categories[categoryName];
    const { type } = useLocalSearchParams();
    const typeObj = type ? JSON.parse(type as string) : null;

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

    const [items, setItems] = useState<TPcComponent[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);

    let apiUrl;
    switch (typeObj) {
        case 'CPU':
            apiUrl = 'http://192.168.1.5:5000/api/cpu/paginated';
            break;
        case 'Motherboard':
            apiUrl = 'http://192.168.1.5:5000/api/motherboard/paginated';
            break;
        case 'RAM':
            apiUrl = 'http://192.168.1.5:5000/api/memory/paginated';
            break;
        case 'GPU':
            apiUrl = 'http://192.168.1.5:5000/api/gpu/paginated';
            break;
        case 'Storage':
            apiUrl = 'http://192.168.1.5:5000/api/drive/paginated';
            break;
        case 'Keyboard':
            apiUrl = 'http://192.168.1.5:5000/api/keyboard/paginated';
            break;
        case 'Mouse':
            apiUrl = 'http://192.168.1.5:5000/api/mouse/paginated';
            break;
        default:
            return;
    }

    const fetchBuilds = useCallback(async () => {
        if (loading || (totalPages && page > totalPages)) return;

        setLoading(true);
        console.log(apiUrl)
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
        addComponent(item)
        router.back()
    }

    const renderProductItem = ({ item }: any) => (
        <TouchableOpacity
            style={viewType === 'grid' ? styles.gridItem : styles.listItem}
            onPress={() => console.log(`Selected product: ${item.name}`)}>
            <View style={viewType === 'grid' ? styles.gridImageContainer : styles.listImageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
                ) : (
                    <View style={[styles.productImagePlaceholder, { backgroundColor: HEADER_COLORS[0] }]}>
                        {/* <Text style={styles.productImagePlaceholderText}>{item.brand.charAt(0)}</Text> */}
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
                <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.productSpecs} numberOfLines={1}>
                    {/* {item.specs} */}
                    {Object.entries(item.specs)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' ')}
                </Text>

                <View style={styles.productRating}>
                </View>

                <View style={styles.priceAndAddContainer} pointerEvents="box-none">
                    <Text style={styles.productPrice}>{item.price}$</Text>
                    {hasComponent(item) ? <TouchableOpacity
                        style={styles.hasButton}
                        disabled={true}
                        onPress={() => addComponentAndMove(item)}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity> : <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addComponentAndMove(item)}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                    }


                </View>
            </View>
        </TouchableOpacity>
    );

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

                <TouchableOpacity style={styles.filterButton}>
                    <Filter stroke="#000000" width={20} height={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.sortButton}>
                    <Text style={styles.filterOptionText}>Sort</Text>
                    {/* <SortAsc stroke="#000000" width={20} height={20} /> */}
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
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
        borderColor: "#eee"
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