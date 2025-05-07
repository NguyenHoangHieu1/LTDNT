import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, X } from 'react-native-feather';
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
import * as componentUtils from '~/data/componentUtils';

type ComponentFormProps = {
  componentType: ComponentType;
  componentId?: string;
  isEditing?: boolean;
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

const specTypesMap: Record<string, Record<string, 'number' | 'boolean' | 'string'>> = {
  CPU: {
    core_count: 'number',
    core_clock: 'number',
    boost_clock: 'number',
    tdp: 'number',
    graphics: 'string',
    smt: 'boolean',
    socket: 'string',
  },
  GPU: {
    chipset: 'string',
    memory: 'number',
    core_clock: 'number',
    boost_clock: 'number',
    color: 'string',
    length: 'number',
  },
  MotherBoard: {
    socket: 'string',
    form_factor: 'string',
    max_memory: 'number',
    memory_slots: 'number',
    color: 'string',
    memory_type: 'string',
  },
  RAM: {
    price_per_gb: 'number',
    color: 'string',
    first_word_latency: 'number',
    cas_latency: 'number',
    speed_mhz: 'number',
    ddr_type: 'string',
    total_capacity: 'number',
  },
  Storage: {
    capacity: 'number',
    price_per_gb: 'number',
    type: 'string',
    cache: 'number',
    form_factor: 'string',
    interface: 'string',
  },
  Keyboard: {
    style: 'string',
    switches: 'string',
    backlit: 'string',
    tenkeyless: 'boolean',
    connection_type: 'string',
    color: 'string',
  },
  Mouse: {
    tracking_method: 'string',
    connection_type: 'string',
    max_dpi: 'number',
    hand_orientation: 'string',
    color: 'string',
  },
};

const ComponentForm = ({ componentType, componentId, isEditing = false }: ComponentFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    specs: {} as Record<string, string>,
    compatibility: [] as string[],
  });

  const [specKeys, setSpecKeys] = useState<string[]>([]);
  const [compatibilityItems, setCompatibilityItems] = useState<string[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newCompatibilityItem, setNewCompatibilityItem] = useState('');

  // Set default spec keys based on component type
  useEffect(() => {
    let defaultSpecKeys: string[] = [];

    switch (componentType) {
      case 'CPU':
        defaultSpecKeys = [
          'core_count',
          'core_clock',
          'boost_clock',
          'tdp',
          'graphics',
          'smt',
          'socket',
        ];
        break;
      case 'GPU':
        defaultSpecKeys = ['chipset', 'memory', 'core_clock', 'boost_clock', 'color', 'length'];
        break;
      case 'Motherboard':
        defaultSpecKeys = [
          'socket',
          'form_factor',
          'max_memory',
          'memory_slots',
          'color',
          'memory_type',
        ];
        break;
      case 'RAM':
        defaultSpecKeys = [
          'price_per_gb',
          'ddr_type',
          'total_capacity',
          'speed_mhz',
          'cas_latency',
          'first_word_latency',
          'color',
        ];
        break;
      case 'Storage':
        defaultSpecKeys = ['capacity', 'price_per_gb', 'type', 'cache', 'form_factor', 'interface'];
        break;
      case 'Keyboard':
        defaultSpecKeys = [
          'style',
          'switches',
          'backlit',
          'tenkeyless',
          'connection_type',
          'color',
        ];
        break;
      case 'Mouse':
        defaultSpecKeys = [
          'tracking_method',
          'connection_type',
          'max_dpi',
          'hand_orientation',
          'color',
        ];
        break;
      default:
        defaultSpecKeys = [];
    }

    if (!isEditing) {
      setSpecKeys(defaultSpecKeys);

      // Initialize specs object with empty values
      const initialSpecs: Record<string, string> = {};
      defaultSpecKeys.forEach((key) => (initialSpecs[key] = ''));
      setFormData((prev) => ({ ...prev, specs: initialSpecs }));
    }
  }, [componentType, isEditing]);

  // Fetch component data if editing
  useEffect(() => {
    if (isEditing && componentId) {
      const fetchComponentData = async () => {
        try {
          const componentData = await apiMap[componentType].getById(componentId);

          const cleanedSpecs = { ...componentData.specs };
          delete cleanedSpecs.__v;
          delete cleanedSpecs._id;

          setFormData({
            name: componentData.name,
            price: componentData.price.toString(),
            description: componentData.description,
            image: componentData.image,
            specs: cleanedSpecs,
            compatibility: Array.isArray(componentData.compatibility)
              ? [...componentData.compatibility]
              : [],
          });
          setSpecKeys(Object.keys(cleanedSpecs));
          setCompatibilityItems(
            Array.isArray(componentData.compatibility) ? [...componentData.compatibility] : []
          );
        } catch (error) {
          console.error('Failed to fetch component data:', error);
          Alert.alert('Error', 'Could not fetch component data');
        } finally {
          setLoading(false);
        }
      };

      fetchComponentData();
    }
  }, [componentId, componentType, isEditing]);

  const handleSpecChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value,
      },
    }));
  };

  const addNewSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) {
      Alert.alert('Error', 'Both specification name and value are required');
      return;
    }

    if (specKeys.includes(newSpecKey)) {
      Alert.alert('Error', 'This specification already exists');
      return;
    }

    setSpecKeys((prev) => [...prev, newSpecKey]);
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [newSpecKey]: newSpecValue,
      },
    }));
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const removeSpec = (keyToRemove: string) => {
    setSpecKeys((prev) => prev.filter((key) => key !== keyToRemove));
    setFormData((prev) => {
      const updatedSpecs = { ...prev.specs };
      delete updatedSpecs[keyToRemove];
      return { ...prev, specs: updatedSpecs };
    });
  };

  const addCompatibilityItem = () => {
    if (!newCompatibilityItem.trim()) {
      Alert.alert('Error', 'Compatibility item cannot be empty');
      return;
    }

    if (compatibilityItems.includes(newCompatibilityItem)) {
      Alert.alert('Error', 'This compatibility item already exists');
      return;
    }

    setCompatibilityItems((prev) => [...prev, newCompatibilityItem]);
    setFormData((prev) => ({
      ...prev,
      compatibility: [...prev.compatibility, newCompatibilityItem],
    }));
    setNewCompatibilityItem('');
  };

  const removeCompatibilityItem = (itemToRemove: string) => {
    setCompatibilityItems((prev) => prev.filter((item) => item !== itemToRemove));
    setFormData((prev) => ({
      ...prev,
      compatibility: prev.compatibility.filter((item) => item !== itemToRemove),
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name?.trim()) {
      Alert.alert('Error', 'Component name is required');
      return;
    }

    if (!formData.price?.trim() || isNaN(Number.parseFloat(formData.price))) {
      Alert.alert('Error', 'Valid price is required');
      return;
    }

    try {
      const classifyFunction = componentUtils[`classify${componentType}Purpose`];
      const calculateScoreFunction = componentUtils[`calculate${componentType}Score`];

      let updatedSpecs = { ...formData.specs };
      if (classifyFunction) {
        updatedSpecs.purpose = classifyFunction(updatedSpecs);
      }
      if (calculateScoreFunction) {
        updatedSpecs.performance_score = calculateScoreFunction(updatedSpecs);
      }

      const newFormData = {
        ...formData,
        specs: updatedSpecs,
      };

      console.log(newFormData);

      const api = apiMap[componentType];
      if (isEditing && componentId) {
        await api.update(componentId, newFormData);
        Alert.alert('Success', `${componentType} component "${formData.name}" has been updated.`);
      } else {
        await api.create(formData);
        Alert.alert('Success', `${componentType} component "${formData.name}" has been added.`);
      }
      router.back(); // Go back after success
    } catch (error) {
      console.error('Failed to submit component data:', error);
      Alert.alert('Error', 'Could not save component data');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0084C8" />
        <Text style={styles.loadingText}>Loading component data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title}>
            {isEditing ? `Edit ${componentType}: ${formData?.name}` : `Add New ${componentType}`}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${componentType} name`}
              value={formData.name}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              value={formData.price}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, price: text }))}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              value={formData.description}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image URL</Text>
            <View style={styles.imageInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter image URL"
                value={formData.image}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, image: text }))}
              />
              <TouchableOpacity style={styles.imageButton}>
                <Camera stroke="#fff" width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.sectionTitle}>Specifications</Text>

            {specKeys
              .filter((key) => key !== 'purpose' && key !== 'performance_score')
              .map((key) => {
                const inputType = specTypesMap[componentType]?.[key] || 'string';

                return (
                  <View key={key} style={styles.specItem}>
                    <View style={styles.specContent}>
                      <Text style={styles.specKey}>{key}</Text>
                      {inputType === 'boolean' ? (
                        <Switch
                          value={formData.specs[key] === 'true'}
                          onValueChange={(val) => handleSpecChange(key, val.toString())}
                        />
                      ) : (
                        <TextInput
                          style={styles.specInput}
                          placeholder={`Enter ${key}`}
                          value={String(formData.specs[key] ?? '')}
                          onChangeText={(text) =>
                            handleSpecChange(
                              key,
                              inputType === 'number' ? text.replace(/[^0-9.]/g, '') : text
                            )
                          }
                          keyboardType={inputType === 'number' ? 'numeric' : 'default'}
                        />
                      )}
                    </View>
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeSpec(key)}>
                      <X stroke="#fff" width={16} height={16} />
                    </TouchableOpacity>
                  </View>
                );
              })}

            <View style={styles.addSpecContainer}>
              <TextInput
                style={[styles.input, styles.addSpecInput]}
                placeholder="Spec name"
                value={newSpecKey}
                onChangeText={setNewSpecKey}
              />
              <TextInput
                style={[styles.input, styles.addSpecInput]}
                placeholder="Spec value"
                value={newSpecValue}
                onChangeText={setNewSpecValue}
              />
              <TouchableOpacity style={styles.addButton} onPress={addNewSpec}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.sectionTitle}>Compatibility</Text>

            {compatibilityItems.map((item, index) => (
              <View key={index} style={styles.compatibilityItem}>
                <Text style={styles.compatibilityText}>{item}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeCompatibilityItem(item)}>
                  <X stroke="#fff" width={16} height={16} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addCompatibilityContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Add compatibility item"
                value={newCompatibilityItem}
                onChangeText={setNewCompatibilityItem}
              />
              <TouchableOpacity style={styles.addButton} onPress={addCompatibilityItem}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Component' : 'Save Component'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF5A5A',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#0084C8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0084C8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  specContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  specKey: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  specInput: {
    fontSize: 16,
  },
  removeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FF5A5A',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addSpecContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addSpecInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#0084C8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  compatibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  compatibilityText: {
    flex: 1,
    fontSize: 16,
  },
  addCompatibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComponentForm;
