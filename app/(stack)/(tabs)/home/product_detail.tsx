"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useNavigationStore } from "~/libs/stateChangePage"
import { TPcComponent } from "~/data/pcComponents"
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
    // Navigate to PC Builder screen with this product
    // navigation.navigate("PCBuilder", { selectedComponent: product })
    // @ts-ignore
    router.push({
      // @ts-ignore
      pathname: "/(stack)/pc-builder",
      // @ts-ignore
      params: { selectedComponent: product },
    })
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
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars(product.rating)}</View>
            <Text style={styles.ratingText}>{product.rating} stars</Text>
          </View>
          <Text style={styles.price}>${product.price}</Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          <View style={styles.specsContainer}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {Object.entries(product.specs).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specKey}>{key}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.compatibilityContainer}>
            <Text style={styles.sectionTitle}>Compatible With</Text>
            {product.compatibility.map((item: any, index: any) => (
              <Text key={index} style={styles.compatibilityItem}>
                • {item}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.navigate("/")}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buildButton} onPress={addToBuild}>
          <Text style={styles.buttonText}>Add to Build</Text>
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
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  specValue: {
    flex: 2,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    height: 60,
  },
  homeButton: {
    flex: 1,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  buildButton: {
    flex: 1,
    backgroundColor: "#0084C8",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ProductDetailScreen

