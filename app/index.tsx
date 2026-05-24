import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // ตั้งเวลาให้หน้าโหลดแสดง 2 วินาที แล้วเปลี่ยนไปหน้า welcome
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ไอคอนธนาคาร */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/bank.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>Money Tracking</Text>
      {/* แก้ไขข้อความตรงนี้เป็น "รายรับรายจ่ายของฉัน" */}
      <Text style={styles.subtitle}>รายรับรายจ่ายของฉัน</Text>

      {/* วงกลม Loading */}
      <ActivityIndicator size="large" color="#FF008E" style={{ marginTop: 30 }} />

      {/* ข้อความเครดิตด้านล่างสุด */}
      <Text style={styles.footerText}>
        Created by 6852D10010{'\n'}-SAU-
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF008E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF008E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
});