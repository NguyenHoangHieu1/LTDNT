"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useNavigationStore } from "~/libs/stateChangePage"
import { TPcComponent } from "~/data/pcComponents"
import { usePcComponentStore } from '~/data/usePcComponentStore';
import { cpuImageUrls } from "~/data/image"
// import { useNavigation } from "@react-navigation/native"
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import type { RootStackParamList } from "../types"

type ProductDetailScreenProps = {
  route: {
    params: {
      product: {
        id: string
        name: string
        image: string
        price: number
        rating: number
        description: string
        specs: {
          [key: string]: string
        }
        compatibility: string[]
      }
    }
  }
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = () => {
  const product = useNavigationStore.getState().getData<TPcComponent>("product")
  const [quantity, setQuantity] = useState(1)
  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const router = useRouter()
  const addComponent = usePcComponentStore((state) => state.addComponent)
  const hadComponent = usePcComponentStore((state) => state.hasComponent)

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color={i <= rating ? "#FFA500" : "#ccc"}
          style={{ marginRight: 2 }}
        />,
      )
    }
    return stars
  }

  const increaseQuantity = () => setQuantity(quantity + 1)
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const addToBuild = () => {
    addComponent(product)
    router.replace("/(stack)/(tabs)/build")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{product.name}</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image ? product.image : cpuImageUrls }} style={styles.productImage} resizeMode="cover" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>

          <View style={styles.specsContainer}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {Object.entries(product.specs).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specKey} numberOfLines={1}>{key}</Text>
                <Text style={styles.specValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {hadComponent(product) ? <TouchableOpacity style={styles.hasButton} onPress={addToBuild} disabled={true}>
          <Text style={styles.buttonText}>Add to Build</Text>
        </TouchableOpacity> : <TouchableOpacity style={styles.buildButton} onPress={addToBuild}>
          <Text style={styles.buttonText}>Add to Build</Text>
        </TouchableOpacity>}
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
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  imageContainer: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  ratingText: {
    color: "#666",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0084C8",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 15,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#eee",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityValue: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  specsContainer: {
    marginBottom: 20,
  },
  specRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  specKey: {
    flex: 1.5,
    fontSize: 14,
    color: "#666",
  },
  specValue: {
    flex: 1.5,
    fontSize: 14,
    color: "#333",
  },
  compatibilityContainer: {
    marginBottom: 80,
  },
  compatibilityItem: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  homeButton: {
    flex: 1,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  buildButton: {
    backgroundColor: "#00b16a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  hasButton: {
    backgroundColor: '#D3D3D3', // Màu xám
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
})

export default ProductDetailScreen

