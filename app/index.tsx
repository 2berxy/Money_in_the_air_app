import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Tracking</Text>
      <Text style={styles.subtitle}>แอปจัดการการเงิน</Text>

      {/* รูป Logo */}
      <Image
        source={require('../assets/bank.png')}
        style={styles.logo}
        resizeMode="contain"
      />

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A7A66',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 40,
  },

  button: {
    backgroundColor: '#1A7A66',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});