"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { TPcComponent, pcComponents } from "~/data/pcComponents"
import { useNavigationStore } from "~/libs/stateChangePage"
import { useRouter } from "expo-router"


const ComponentSelectionScreen = () => {
  const router = useRouter()
  const { getData, setData } = useNavigationStore.getState()
  const { componentType, currentBuild } = getData<any>("ComponentSelection")
  const [components, setComponents] = useState<TPcComponent[]>([])
  const [filteredComponents, setFilteredComponents] = useState<TPcComponent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price" | "rating">("price")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [compatibleOnly, setCompatibleOnly] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setLoading(true)
    setTimeout(() => {
      // Filter components by type
      const typeComponents = pcComponents.filter((component) => component.type === componentType)
      setComponents(typeComponents)
      setFilteredComponents(typeComponents)
      setLoading(false)
    }, 500)
  }, [componentType])

  useEffect(() => {
    let result = [...components]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (component) =>
          component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          component.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply price filter
    result = result.filter((component) => component.price >= priceRange[0] && component.price <= priceRange[1])

    // Apply compatibility filter if enabled and we have a current build
    if (compatibleOnly && currentBuild && Object.keys(currentBuild).length > 0) {
      result = result.filter((component) => isCompatible(component, currentBuild))
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      } else {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      }
    })

    setFilteredComponents(result)
  }, [searchQuery, sortBy, sortOrder, components, priceRange, compatibleOnly])

  const isCompatible = (component: TPcComponent, build: Record<string, TPcComponent>) => {
    // CPU and Motherboard compatibility
    if (component.type === "CPU" && build.Motherboard) {
      if (component.specs.socket !== build.Motherboard.specs.socket) {
        return false
      }
    }

    if (component.type === "Motherboard" && build.CPU) {
      if (component.specs.socket !== build.CPU.specs.socket) {
        return false
      }
    }

    // RAM and Motherboard compatibility
    if (component.type === "RAM" && build.Motherboard) {
      if (component.specs.type !== build.Motherboard.specs.ramType) {
        return false
      }
    }

    if (component.type === "Motherboard" && build.RAM) {
      if (component.specs.ramType !== build.RAM.specs.type) {
        return false
      }
    }

    // GPU and Power Supply compatibility
    if (component.type === "GPU" && build.PowerSupply) {
      const gpuPower = Number.parseInt(component.specs.powerRequirement)
      const psuPower = Number.parseInt(build.PowerSupply.specs.wattage)
      if (gpuPower > psuPower * 0.6) {
        return false
      }
    }

    return true
  }

  const handleSelectComponent = (component: TPcComponent) => {
    // navigation.navigate("PCBuilder", { selectedComponent: component })
    setData("selectedComponent", component)

  }

  const handleCompareComponents = (component: TPcComponent) => {
    setData("CompareComponents", component)
    // navigation.navigate("CompareComponents", { componentType, firstComponent: component })
  }

  const toggleSort = (type: "price" | "rating") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(type)
      setSortOrder("asc")
    }
  }

  const renderSortIcon = (type: "price" | "rating") => {
    if (sortBy !== type) return null
    return <Ionicons name={sortOrder === "asc" ? "arrow-up" : "arrow-down"} size={16} color="#0084C8" />
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#FFA500" : "#ccc"}
          style={{ marginRight: 2 }}
        />,
      )
    }
    return <View style={styles.starsContainer}>{stars}</View>
  }

  const getComponentTypeTitle = () => {
    switch (componentType) {
      case "CPU":
        return "Processors"
      case "Motherboard":
        return "Motherboards"
      case "RAM":
        return "Memory"
      case "GPU":
        return "Graphics Cards"
      case "Storage":
        return "Storage Devices"
      case "PowerSupply":
        return "Power Supplies"
      case "Case":
        return "PC Cases"
      case "Cooling":
        return "Cooling Solutions"
      default:
        return componentType
    }
  }

  const renderComponentItem = ({ item }: { item: TPcComponent }) => (
    <View style={styles.componentCard}>
      <Image source={{ uri: item.image }} style={styles.componentImage} resizeMode="contain" />
      <View style={styles.componentInfo}>
        <Text style={styles.componentName}>{item.name}</Text>
        <Text style={styles.componentDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.componentDetails}>
          <Text style={styles.componentPrice}>${item.price}</Text>
          {renderStars(item.rating)}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.selectButton} onPress={() => handleSelectComponent(item)}>
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.compareButton} onPress={() => handleCompareComponents(item)}>
            <Text style={styles.compareButtonText}>Compare</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getComponentTypeTitle()}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${getComponentTypeTitle().toLowerCase()}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.filterButton, sortBy === "price" && styles.activeFilterButton]}
            onPress={() => toggleSort("price")}
          >
            <Text style={[styles.filterButtonText, sortBy === "price" && styles.activeFilterButtonText]}>
              Price {renderSortIcon("price")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, sortBy === "rating" && styles.activeFilterButton]}
            onPress={() => toggleSort("rating")}
          >
            <Text style={[styles.filterButtonText, sortBy === "rating" && styles.activeFilterButtonText]}>
              Rating {renderSortIcon("rating")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Show:</Text>
          <TouchableOpacity
            style={[styles.filterButton, compatibleOnly && styles.activeFilterButton]}
            onPress={() => setCompatibleOnly(!compatibleOnly)}
          >
            <Text style={[styles.filterButtonText, compatibleOnly && styles.activeFilterButtonText]}>
              {compatibleOnly ? "Compatible Only" : "All Components"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0084C8" />
          <Text style={styles.loadingText}>Loading components...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredComponents}
          renderItem={renderComponentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No components found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  filterContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
    width: 60,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#eee",
  },
  activeFilterButton: {
    backgroundColor: "#E1F5FE",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterButtonText: {
    color: "#0084C8",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 10,
  },
  componentCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  componentDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  componentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  componentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0084C8",
  },
  starsContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectButton: {
    backgroundColor: "#0084C8",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  compareButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#0084C8",
    flex: 1,
    alignItems: "center",
  },
  compareButtonText: {
    color: "#0084C8",
    fontWeight: "500",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
})

export default ComponentSelectionScreen

