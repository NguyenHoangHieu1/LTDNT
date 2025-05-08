"use client"

import { useState } from "react"
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
} from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"
import axios from "axios"
import { useRouter } from "expo-router"

interface ComponentInfo {
  name: string
  price: number
  performance_score: number
}

interface BuildResult {
  components: {
    [component: string]: ComponentInfo
  }
  total_price: number
  total_performance_score: number
}

export default function App() {
  const [selectedBuildType, setSelectedBuildType] = useState("Budget Gaming")
  const [budget, setBudget] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [result, setResult] = useState<BuildResult | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const buildTypes = ["Budget Gaming", "Mid-Range Gaming", "High-End Gaming", "Office", "Workstation"]

  // Component icons mapping
  const componentIcons = {
    cpu: require("./assets/cpu.png"),
    gpu: require("./assets/gpu.png"),
    ram: require("./assets/ram.png"),
    motherboard: require("./assets/motherboard.png"),
    storage: require("./assets/storage.png"),
    keyboard: require("./assets/keyboard.png"),
    mouse: require("./assets/mouse.png"),
  }

  const handleGenerate = async () => {
    if (!budget || isNaN(Number(budget))) {
      alert("Please enter a valid budget.")
      return
    }
    setResult(null)
    setLoading(true)

    try {
      const response = await axios.post("http://10.0.2.2:5001/suggest", {
        budget: Number(budget),
        purpose: selectedBuildType,
      })

      if (response.data.error) {
        alert(response.data.error)
        setResult(null)
      } else {
        setResult(response.data)
      }
    } catch (error) {
      console.error(error)
      alert("Failed to get configuration.")
    } finally {
      setLoading(false)
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const selectOption = (option: string) => {
    setSelectedBuildType(option)
    setDropdownOpen(false)
  }

  // Format number to 2 decimal places
  const formatNumber = (num: number) => {
    return Math.round(num * 100) / 100
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Tool Pc Generate</Text>
          </View>

          {/* <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.viewToggleButton}
            onPress={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}>
            <Text style={styles.viewToggleText}>{viewType === 'grid' ? '📋' : '📱'}</Text>
          </TouchableOpacity>
        </View> */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
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
              onRequestClose={() => setDropdownOpen(false)}
            >
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownOpen(false)}>
                <View style={[styles.dropdownMenu, { top: 180 }]}>
                  {buildTypes.map((type) => (
                    <TouchableOpacity key={type} style={styles.dropdownItem} onPress={() => selectOption(type)}>
                      <Text
                        style={[styles.dropdownItemText, selectedBuildType === type && styles.dropdownItemTextSelected]}
                      >
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

          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Suggested Build</Text>

              {Object.entries(result).map(([key, value]) => {
                if (key !== "total_price" && key !== "total_performance_score") {
                  const componentKey = key.toLowerCase()
                  return (
                    <View key={key} style={styles.componentCard}>
                      <View style={styles.componentHeader}>
                        <Text style={styles.componentType}>{key.toUpperCase()}</Text>
                        <View style={styles.scoreContainer}>
                          <Text style={styles.scoreText}>Score: {formatNumber(value.performance_score)}</Text>
                        </View>
                      </View>

                      <View style={styles.componentDetails}>
                        <Text style={styles.componentName}>{value.name}</Text>
                        <Text style={styles.componentPrice}>${value.price}</Text>
                      </View>
                    </View>
                  )
                }
                return null
              })}

              <View style={styles.totalContainer}>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Total Price:</Text>
                  <Text style={styles.totalValue}>${result.total_price}</Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Performance Score:</Text>
                  <Text style={styles.totalValue}>{formatNumber(result.total_performance_score)}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={loading}>
            <Text style={styles.generateButtonText}>{loading ? "Generating..." : "Generate"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // Chữ trong header: trắng để tương phản với gradient xanh
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000000",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    marginRight: 15,
  },
  dropdownMenu: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333333",
  },
  dropdownItemTextSelected: {
    color: "#0891B2",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  currencySymbol: {
    paddingLeft: 12,
    fontSize: 18,
    color: "#0891B2",
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
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  generateButton: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    color: "#333333",
  },
  componentCard: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  componentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  componentType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0891B2",
  },
  scoreContainer: {
    backgroundColor: "#e6f7ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    color: "#0891B2",
    fontWeight: "500",
  },
  componentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  componentName: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
    paddingRight: 8,
  },
  componentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
  },
  totalContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  totalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
  },
  componentIcon: {
    width: 24,
    height: 24,
  },
})
