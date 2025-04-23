"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
// import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import type { RootStackParamList } from "../types"
import { useRouter } from 'expo-router';
import type { ComponentType, TPcComponent } from "../../../../data/pcComponents"

type PCBuilderScreenProps = {
  route: {
    params?: {
      selectedComponent?: TPcComponent
    }
  }
}

const PCBuilderScreen: React.FC<PCBuilderScreenProps> = () => {
  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [selectedComponents, setSelectedComponents] = useState<{
    [key in ComponentType]?: TPcComponent
  }>({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [compatibilityIssues, setCompatibilityIssues] = useState<string[]>([])
  const router = useRouter();

  // Add component from route params if available
  // useEffect(() => {
  //   if (route.params?.selectedComponent) {
  //     const component = route.params.selectedComponent
  //     addComponent(component)
  //   }
  // }, [route.params?.selectedComponent])

  // Calculate total price whenever selected components change
  useEffect(() => {
    let total = 0
    Object.values(selectedComponents).forEach((component) => {
      if (component) {
        total += component.price
      }
    })
    setTotalPrice(total)
    checkCompatibility()
  }, [selectedComponents])

  const addComponent = (component: TPcComponent) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [component.type]: component,
    }))
  }

  const removeComponent = (type: ComponentType) => {
    setSelectedComponents((prev) => {
      const newComponents = { ...prev }
      delete newComponents[type]
      return newComponents
    })
  }

  const checkCompatibility = () => {
    const issues: string[] = []

    // CPU and Motherboard compatibility
    const cpu = selectedComponents.CPU
    const motherboard = selectedComponents.Motherboard
    if (cpu && motherboard) {
      if (cpu.specs.socket !== motherboard.specs.socket) {
        issues.push(
          `CPU socket (${cpu.specs.socket}) is not compatible with motherboard socket (${motherboard.specs.socket})`,
        )
      }
    }

    // RAM and Motherboard compatibility
    const ram = selectedComponents.RAM
    if (ram && motherboard) {
      if (ram.specs.type !== motherboard.specs.ramType) {
        issues.push(`RAM type (${ram.specs.type}) is not compatible with motherboard (${motherboard.specs.ramType})`)
      }
    }

    // GPU and Power Supply compatibility
    const gpu = selectedComponents.GPU
    const psu = selectedComponents.PowerSupply
    if (gpu && psu) {
      const gpuPower = Number.parseInt(gpu.specs.powerRequirement)
      const psuPower = Number.parseInt(psu.specs.wattage)
      if (gpuPower > psuPower * 0.6) {
        // Rule of thumb: GPU shouldn't use more than 60% of PSU power
        issues.push(`GPU power requirement (${gpuPower}W) may be too high for the selected power supply (${psuPower}W)`)
      }
    }

    setCompatibilityIssues(issues)
  }

  const navigateToComponentSelection = (type: ComponentType) => {
    // navigation.navigate("ComponentList", { componentType: type })
    // @ts-ignore
    router.navigate("/", { id: 1 })
  }

  const renderComponentItem = (type: ComponentType, title: string) => {
    const component = selectedComponents[type]

    return (
      <TouchableOpacity style={styles.componentCard} onPress={() => navigateToComponentSelection(type)}>
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
            <Image source={{ uri: component.image }} style={styles.componentImage} resizeMode="contain" />
            <View style={styles.componentInfo}>
              <Text style={styles.componentName}>{component.name}</Text>
              <Text style={styles.componentPrice}>${component.price}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyComponent}>
            <Ionicons name="add-circle" size={40} color="#0084C8" />
            <Text style={styles.emptyComponentText}>Select {title}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const handleCompleteBuild = () => {
    const requiredComponents: ComponentType[] = ["CPU", "Motherboard", "RAM", "Storage", "PowerSupply"]
    const missingComponents = requiredComponents.filter((type) => !selectedComponents[type])

    if (missingComponents.length > 0) {
      Alert.alert("Incomplete Build", `Please select the following components: ${missingComponents.join(", ")}`, [
        { text: "OK" },
      ])
      return
    }

    if (compatibilityIssues.length > 0) {
      Alert.alert("Compatibility Issues", "Your build has compatibility issues. Do you want to proceed anyway?", [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed", onPress: () => completeBuild() },
      ])
    } else {
      completeBuild()
    }
  }

  const completeBuild = () => {
    Alert.alert("Build Complete!", `Your PC build has been saved. Total cost: $${totalPrice.toFixed(2)}`, [
      { text: "OK", onPress: () => router.navigate("/") },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
          {renderComponentItem("CPU", "CPU")}
          {renderComponentItem("Motherboard", "Motherboard")}
          {renderComponentItem("RAM", "RAM")}
          {renderComponentItem("GPU", "Graphics Card")}
          {renderComponentItem("Storage", "Storage")}
          {renderComponentItem("PowerSupply", "Power Supply")}
          {renderComponentItem("Case", "Case")}
          {renderComponentItem("Cooling", "Cooling")}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteBuild}>
          <Text style={styles.completeButtonText}>Complete Build</Text>
        </TouchableOpacity>
      </View>
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
  scrollContainer: {
    flex: 1,
  },
  compatibilityWarning: {
    backgroundColor: "#FFF8E1",
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFA500",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  warningText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
    marginTop: 2,
  },
  componentsContainer: {
    padding: 10,
  },
  componentCard: {
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
  componentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    padding: 5,
  },
  selectedComponent: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
    marginBottom: 5,
  },
  componentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0084C8",
  },
  emptyComponent: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
  },
  emptyComponentText: {
    marginTop: 10,
    color: "#0084C8",
    fontWeight: "500",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0084C8",
  },
  completeButton: {
    backgroundColor: "#0084C8",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PCBuilderScreen

