import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Edit, Plus, Search, Trash2 } from 'react-native-feather';
import type { ComponentType, TPcComponent } from '~/data/pcComponents';
import {
  cpuAPI,
  gpuAPI,
  motherboardAPI,
  driveAPI,
  memoryAPI,
  keyboardAPI,
  mouseAPI,
} from '~/libs/api';

type ComponentListViewProps = {
  componentType: ComponentType;
  title?: string;
};

const apiMap = {
  CPU: cpuAPI,
  GPU: gpuAPI,
  Motherboard: motherboardAPI,
  RAM: memoryAPI,
  Storage: driveAPI,
  Keyboard: keyboardAPI,
  Mouse: mouseAPI,
};

const ComponentListView = ({ componentType, title }: ComponentListViewProps) => {
  const router = useRouter();
  const [components, setComponents] = useState<TPcComponent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const apiInstance = apiMap[componentType];

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await apiInstance.getPaginated(page, 10);

      const filtered = response.items.filter((item: TPcComponent) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setComponents(filtered);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1); // Reset to the first page when refreshing
    await fetchComponents(); // Re-fetch the components
    setRefreshing(false);
  };

  useEffect(() => {
    fetchComponents();
  }, [page, searchQuery]);

  const handleAddComponent = () => {
    router.push(`/admin/add?type=${componentType}`);
  };

  const handleEditComponent = (id: string) => {
    router.push(`/admin/${id}?type=${componentType}` as any);
  };

  const handleDeleteComponent = (id: string, name: string) => {
    Alert.alert('Delete Component', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await apiInstance.delete(id);
            Alert.alert('Deleted', `${name} has been removed.`);
            fetchComponents();
          } catch (err) {
            Alert.alert('Error', 'Could not delete component.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }: { item: TPcComponent }) => (
    <View style={styles.componentCard}>
      <View style={styles.componentHeader}>
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.componentImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>{componentType.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.componentInfo}>
          <Text style={styles.componentName}>{item.name}</Text>
          <Text style={styles.componentPrice}>${item.price}</Text>
          <View style={styles.specHighlights}>
            {Object.entries(item.specs)
              .slice(1, 3)
              .map(([key, value], index) => (
                <Text key={index} style={styles.specItem}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </Text>
              ))}
          </View>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditComponent(item.id)}>
          <Edit stroke="#fff" width={16} height={16} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteComponent(item.id, item.name)}>
          <Trash2 stroke="#fff" width={16} height={16} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search stroke="#666" width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${componentType}s...`}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setPage(1); // reset page
            }}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddComponent}>
          <Plus stroke="#fff" width={20} height={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <>
          <FlatList
            data={components}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No {componentType}s found</Text>
                <TouchableOpacity style={styles.addEmptyButton} onPress={handleAddComponent}>
                  <Text style={styles.addEmptyButtonText}>Add {componentType}</Text>
                </TouchableOpacity>
              </View>
            }
            onRefresh={handleRefresh} // Trigger on pull to refresh
            refreshing={refreshing} // Control the refresh state
          />
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.pageButton, page === 1 && styles.disabledButton]}
              onPress={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}>
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageIndicator}>
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.pageButton, page === totalPages && styles.disabledButton]}
              onPress={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}>
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0084C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  componentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  componentImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  componentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0084C8',
    marginBottom: 8,
  },
  specHighlights: {
    flexDirection: 'column',
  },
  specItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#0084C8',
  },
  deleteButton: {
    backgroundColor: '#FF5A5A',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  addEmptyButton: {
    backgroundColor: '#0084C8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addEmptyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 16,
  },

  pageButton: {
    width: 90,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },

  disabledButton: {
    backgroundColor: '#ccc',
  },

  pageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  pageIndicator: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ComponentListView;
