import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

interface ComponentInfo {
  name: string;
  price: number;
  performance_score: number;
}

interface BuildResult {
  components: {
    [component: string]: ComponentInfo;
  };
  total_price: number;
  total_performance_score: number;
}

export default function App() {
  const [selectedBuildType, setSelectedBuildType] = useState('Budget Gaming');
  const [budget, setBudget] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [result, setResult] = useState<BuildResult | null>(null);

  const buildTypes = [
    'Budget Gaming',
    'Mid-Range Gaming',
    'High-End Gaming',
    'Office',
    'Workstation',
  ];

  const handleGenerate = async () => {
    if (!budget || isNaN(Number(budget))) {
      alert('Please enter a valid budget.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.6:5000/suggest', {
        budget: Number(budget),
        purpose: selectedBuildType,
      });

      if (response.data.error) {
        alert(response.data.error);
        setResult(null);
      } else {
        setResult(response.data);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to get configuration.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectOption = (option: any) => {
    setSelectedBuildType(option);
    setDropdownOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>PcAI generate</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Build Type</Text>

            {/* Custom Dropdown */}
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
              <Text style={styles.dropdownButtonText}>{selectedBuildType}</Text>
              <Feather name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>

            {/* Dropdown Options Modal */}
            <Modal
              visible={dropdownOpen}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setDropdownOpen(false)}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setDropdownOpen(false)}>
                <View style={[styles.dropdownMenu, { top: 180 }]}>
                  {buildTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => selectOption(type)}>
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedBuildType === type && styles.dropdownItemTextSelected,
                        ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            <Text style={styles.label}>Budget</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={budget}
                onChangeText={setBudget}
                placeholder="Enter your budget"
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Suggested Build</Text>
            {Object.entries(result).map(([key, value]) =>
              key !== 'total_price' && key !== 'total_performance_score' ? (
                <View key={key} style={styles.resultItem}>
                  <Text style={styles.resultComponent}>{key.toUpperCase()}:</Text>
                  <Text style={styles.resultText}>
                    {value.name} - ${value.price} (Score: {value.performance_score})
                  </Text>
                </View>
              ) : null
            )}
            <Text style={styles.totalText}>Total Price: ${result.total_price}</Text>
            <Text style={styles.totalText}>
              Total Performance Score: {result.total_performance_score}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000000',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownItemTextSelected: {
    color: '#0891B2',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  currencySymbol: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#0891B2', // Blue color similar to the price in the image
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  generateButton: {
    backgroundColor: '#10B981', // Green color similar to the button in the image
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 8,
  },
  resultComponent: {
    fontWeight: 'bold',
  },
  resultText: {
    marginLeft: 10,
  },
  totalText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});
