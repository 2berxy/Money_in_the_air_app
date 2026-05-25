import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Tracking</Text>
      <Text style={styles.subtitle}>แอปจัดการการเงิน</Text>

      {/* พื้นที่สำหรับใส่รูป Logo ของคุณ */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/chibi.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)/home')}
      >
        <Text style={styles.buttonText}>บันทึกรายรับรายจ่าย</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF008E',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    fontWeight: '500',
  },
  imageContainer: {
    width: 240,
    height: 240,
    backgroundColor: '#fff',
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    shadowColor: '#FF008E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  button: {
    backgroundColor: '#FF008E',
    paddingVertical: 16,
    paddingHorizontal: 45,
    borderRadius: 30,
    shadowColor: '#FF008E',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});