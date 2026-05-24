import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../service/supabase';

export default function IncomeScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    // Validate UI ตามที่รูปวาดไว้ (ตัวอักษรสีแดง)
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }
    if (!note) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกรายละเอียด');
      return;
    }
    const { error } = await supabase.from('transactions').insert([
      { type: 'income', amount: Number(amount), note: note, date: new Date() }
    ]);

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    } else {
      Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อย', [
        { text: 'ตกลง', onPress: () => {
          setAmount(''); setNote('');
          router.push('/(tabs)/home'); // กลับไปหน้า Home เพื่อรีเฟรช
        }}
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>บันทึกรายรับ</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="จำนวนเงิน (บาท)" 
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput 
        style={styles.input} 
        placeholder="รายละเอียด เช่น เงินเดือน" 
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>บันทึกรายรับ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A7A66', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#1A7A66', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});