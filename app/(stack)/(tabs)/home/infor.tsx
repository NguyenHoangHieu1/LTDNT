import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Graphics Cards</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <LinearGradient colors={['#333333', '#222222']} style={styles.cardGradient}>
            <Image
              source={{
                uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0jKlHyWoB3HOv2qnniF7OplneySjzx.png',
              }}
              style={styles.productImage}
              resizeMode="contain"
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName}>NVIDIA RTX 3050</Text>
              <Text style={styles.productDescription}>
                Entry-level ray tracing GPU with 8GB GDDR6 memory
              </Text>

              <View style={styles.specContainer}>
                <View style={styles.specItem}>
                  <Text style={styles.specValue}>2560</Text>
                  <Text style={styles.specLabel}>CUDA Cores</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specValue}>1.78 GHz</Text>
                  <Text style={styles.specLabel}>Boost Clock</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specValue}>8 GB</Text>
                  <Text style={styles.specLabel}>GDDR6</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recommendedScroll}>
            {['RTX 4060', 'RTX 3060 Ti', 'RTX 4070'].map((item, index) => (
              <View key={index} style={styles.recommendedItem}>
                <View style={styles.recommendedImageContainer}>
                  <Text style={styles.recommendedImagePlaceholder}>GPU</Text>
                </View>
                <Text style={styles.recommendedName}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 18,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  cardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#2A2A2A',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 20,
  },
  specContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  specItem: {
    alignItems: 'center',
  },
  specValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7675', // Coral color similar to the navigation buttons
  },
  specLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  detailsButton: {
    backgroundColor: '#FF7675',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recommendedSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  recommendedScroll: {
    marginLeft: -10,
  },
  recommendedItem: {
    width: 120,
    marginLeft: 10,
  },
  recommendedImageContainer: {
    width: 120,
    height: 100,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendedImagePlaceholder: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  recommendedName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default Index;
