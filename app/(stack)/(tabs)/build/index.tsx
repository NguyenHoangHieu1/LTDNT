'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from "../types"
import { useRouter } from 'expo-router';
import type { ComponentType, TPcComponent } from '../../../../data/pcComponents';
import { COLORS } from '~/theme/colors';
import { usePcComponentStore } from '~/data/usePcComponentStore';
import { PcBuild } from '~/data/usePcBuilds';
import { usePcBuildStore } from '~/data/usePcBuilds';
import axios from 'axios';
import { useAuthStore } from '~/data/useAuthStore';

type PCBuilderScreenProps = {
  route: {
    params?: {
      selectedComponent?: TPcComponent;
    };
  };
};

const PCBuilderScreen: React.FC<PCBuilderScreenProps> = () => {
  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [selectedComponents, setSelectedComponents] = useState<{
    [key in ComponentType]?: TPcComponent;
  }>({});
  const userId = useAuthStore((state) => state.user)?._id;
  const [totalPrice, setTotalPrice] = useState(0);
  const [compatibilityIssues, setCompatibilityIssues] = useState<string[]>([]);
  const router = useRouter();
  const components = usePcComponentStore((state) => state.components);
  const getComponentByType = usePcComponentStore((state) => state.getComponentByType);
  const removeComponentByType = usePcComponentStore((state) => state.removeComponent);
  const totalcost = usePcComponentStore((state) => state.getTotalPrice);
  const getAllComponents = usePcComponentStore((state) => state.getAllComponents);
  const allComponents = getAllComponents();
  const clearComponents = usePcComponentStore((state) => state.clearComponents);
  const setComponents = usePcComponentStore((state) => state.setComponents);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buildName, setBuildName] = useState('');
  const addBuild = usePcBuildStore((state) => state.addBuild);
  const crtBuild = usePcBuildStore((state) => state.getCurrentBuild);
  const setCurrentBuild = usePcBuildStore((state) => state.setCurrentBuild);
  const currentBuild = crtBuild();
  const typeToFieldMap: Record<ComponentType, string> = {
    CPU: 'cpuId',
    GPU: 'gpuId',
    Motherboard: 'motherboardId',
    RAM: 'memoryId',
    Storage: 'driveId',
    Keyboard: 'keyboardId',
    Mouse: 'mouseId',
  };

  useEffect(() => {
    if (currentBuild) {
      setComponents(currentBuild.components);
    }
  }, [currentBuild]);

  useEffect(() => {
    let total = 0;
    Object.values(selectedComponents).forEach((component) => {
      if (component) {
        total += component.price;
      }
    });
    setTotalPrice(total);
    checkCompatibility();
  }, [selectedComponents]);

  const addComponent = (component: TPcComponent) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [component.type]: component,
    }));
  };

  const removeComponent = (type: ComponentType) => {
    removeComponentByType(type);
  };

  const checkCompatibility = () => {
    const issues: string[] = [];

    // CPU and Motherboard compatibility
    const cpu = selectedComponents.CPU;
    const motherboard = selectedComponents.Motherboard;
    if (cpu && motherboard) {
      if (cpu.specs.socket !== motherboard.specs.socket) {
        issues.push(
          `CPU socket (${cpu.specs.socket}) is not compatible with motherboard socket (${motherboard.specs.socket})`
        );
      }
    }

    // RAM and Motherboard compatibility
    const ram = selectedComponents.RAM;
    if (ram && motherboard) {
      if (ram.specs.type !== motherboard.specs.ramType) {
        issues.push(
          `RAM type (${ram.specs.type}) is not compatible with motherboard (${motherboard.specs.ramType})`
        );
      }
    }

    // GPU and Power Supply compatibility

    setCompatibilityIssues(issues);
  };

  const navigateToComponentSelection = (type: ComponentType) => {
    // navigation.navigate("ComponentList", { componentType: type })
    // @ts-ignore
    console.log(type);
    router.push({
      pathname: '/(stack)/(tabs)/build/list_prd_base_categories',
      params: { type: JSON.stringify(type) },
    });
  };

  const renderComponentItem = (type: ComponentType, title: string) => {
    let component = getComponentByType(type);
    return (
      <TouchableOpacity
        style={styles.componentCard}
        onPress={() => navigateToComponentSelection(type)}>
        <View style={styles.componentHeader}>
          <Text style={styles.componentTitle}>{title}</Text>
          {component && (
            <TouchableOpacity onPress={() => removeComponent(type)} style={styles.removeButton}>
              <Ionicons name="close-circle" size={24} color="#FF5A5A" />
            </TouchableOpacity>
          )}
        </View>

        {component ? (
          <View style={styles.selectedComponent}>
            <Image
              source={{ uri: component.image }}
              style={styles.componentImage}
              resizeMode="contain"
            />
            <View style={styles.componentInfo}>
              <Text style={styles.componentName}>{component.name}</Text>
              <Text style={styles.componentPrice}>${component.price}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyComponent}>
            <Ionicons name="add-circle" size={40} color={COLORS.MainBlue} />
            <Text style={styles.emptyComponentText}>Select {title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  async function createBuild(
    name: string,
    userId: string,
    totalPrice: number,
    components: TPcComponent[]
  ) {
    const buildData: Record<string, string | number> = {
      name,
      userId,
      totalPrice,
    };

    components.forEach((component) => {
      const field = typeToFieldMap[component.type];
      if (field) {
        buildData[field] = component.id;
      }
    });

    try {
      const response = await axios.post('http://192.168.1.5:5000/api/build', buildData);
      console.log('Build created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating build:', error);
      throw error;
    }
  }

  async function updateBuild(
    name: string,
    userId: string,
    totalPrice: number,
    components: TPcComponent[],
    id: string
  ) {
    const buildData: Record<string, string | number> = {
      name,
      userId,
      totalPrice,
    };

    components.forEach((component) => {
      const field = typeToFieldMap[component.type];
      if (field) {
        buildData[field] = component.id;
      }
    });

    try {
      const response = await axios.put(`http://192.168.1.5:5000/api/build/${id}`, buildData);
      console.log('Build update:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating build:', error);
      throw error;
    }
  }

  const handleCompleteBuild = () => {
    const requiredComponents: ComponentType[] = ['CPU', 'Motherboard', 'RAM', 'Storage'];
    const missingComponents = requiredComponents.filter(
      (type) => !allComponents.some((comp) => comp.type === type)
    );

    if (missingComponents.length > 0) {
      Alert.alert(
        'Incomplete Build',
        `Please select the following components: ${missingComponents.join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (compatibilityIssues.length > 0) {
      Alert.alert(
        'Compatibility Issues',
        'Your build has compatibility issues. Do you want to proceed anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Proceed', onPress: () => completeBuild() },
        ]
      );
    } else {
      if (currentBuild) {
        setBuildName(currentBuild.name);
      }
      setIsModalVisible(true);
    }
  };

  const completeBuild = () => {
    if (!buildName.trim()) {
      Alert.alert('Error', 'Please enter a build name');
      return;
    }

    // Lưu build với tên buildName
    // Alert.alert(
    //   "Build Saved!",
    //   `Your PC build "${buildName}" has been saved!`,
    //   [{
    //     text: "OK", onPress: () => {
    //       setIsModalVisible(false)
    //       const id = nanoid()
    //       const build: PcBuild = {
    //         id: currentBuild ? currentBuild.id : id,
    //         name: currentBuild ? currentBuild.name : buildName,
    //         components: allComponents
    //       }
    //       console.log(build)
    //       addBuild(build)
    //       clearComponents()
    //       setCurrentBuild("")
    //       setBuildName("")
    //       router.navigate("/")
    //     }
    //   }]
    // )
    Alert.alert('Build Saved!', `Your PC build "${buildName}" has been saved!`, [
      {
        text: 'OK',
        onPress: async () => {
          // Đóng modal ngay sau khi nhấn "OK"
          setIsModalVisible(false);

          if (currentBuild) {
            await updateBuild(buildName, userId!, totalcost(), allComponents, currentBuild.id);
          } else {
            await createBuild(buildName, userId!, totalcost(), allComponents);
          }
          clearComponents();
          setCurrentBuild('');
          setBuildName('');
          router.back();
        },
      },
    ]);
  };

  const handleBack = () => {
    setIsModalVisible(false);
    setBuildName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.navigate('/(stack)/(tabs)/home')}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PC Builder</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {compatibilityIssues.length > 0 && (
          <View style={styles.compatibilityWarning}>
            <Ionicons name="warning" size={24} color="#FFA500" />
            <Text style={styles.warningTitle}>Compatibility Issues:</Text>
            {compatibilityIssues.map((issue, index) => (
              <Text key={index} style={styles.warningText}>
                • {issue}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.componentsContainer}>
          {renderComponentItem('CPU', 'CPU')}
          {renderComponentItem('Motherboard', 'Motherboard')}
          {renderComponentItem('RAM', 'RAM')}
          {renderComponentItem('GPU', 'Graphics Card')}
          {renderComponentItem('Storage', 'Storage')}
          {renderComponentItem('Keyboard', 'Keyboard')}
          {renderComponentItem('Mouse', 'Mouse')}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalcost().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteBuild}>
          <Text style={styles.completeButtonText}>Complete Build</Text>
        </TouchableOpacity>
      </View>

      {/* Modal cho popup */}
      <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={handleBack}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Name Your Build</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter build name"
              value={buildName}
              onChangeText={setBuildName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.backButtonModal]}
                onPress={handleBack}>
                <Text style={styles.modalButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={completeBuild}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  backButtonModal: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#00b16a',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  compatibilityWarning: {
    backgroundColor: '#FFF8E1',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  warningText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginTop: 2,
  },
  componentsContainer: {
    padding: 10,
  },
  componentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  selectedComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  componentImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  componentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0084C8',
  },
  emptyComponent: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  emptyComponentText: {
    marginTop: 10,
    color: COLORS.MainBlue,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  completeButton: {
    backgroundColor: '#00b16a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PCBuilderScreen;
