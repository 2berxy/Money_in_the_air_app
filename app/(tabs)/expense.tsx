import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../service/supabase';

export default function ExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const router = useRouter();

  // ฟังก์ชันแสดงวันที่ปัจจุบัน (ตรงตามเงื่อนไข "แสดงวันเวลาปัจจุบัน" ในภาพ)
  const getCurrentDateString = () => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('th-TH', options);
  };

  const handleSave = async () => {
    // Validate UI ตามเงื่อนไขตัวอักษรสีแดงในภาพ
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกจำนวนเงินให้ถูกต้องและมากกว่า 0');
      return;
    }
    if (!note.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกรายละเอียดรายจ่าย');
      return;
    }

    // ส่งข้อมูลไปที่ Supabase
    const { error } = await supabase.from('transactions').insert([
      { 
        type: 'expense', // ระบุประเภทเป็นรายจ่าย
        amount: Number(amount), 
        note: note.trim(), 
        date: new Date()
      }
    ]);

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    } else {
      Alert.alert('สำเร็จ', 'บันทึกรายจ่ายเรียบร้อย', [
        { 
          text: 'ตกลง', 
          onPress: () => {
            setAmount(''); 
            setNote('');
            router.push('/(tabs)/home'); // ลิงก์กลับหน้าแรกเพื่ออัปเดตข้อมูลยอดคงเหลือ
          }
        }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>บันทึกรายจ่าย</Text>
      
      {/* ส่วนแสดงวันเวลาปัจจุบัน */}
      <Text style={styles.dateText}>วันที่ {getCurrentDateString()}</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="จำนวนเงิน (บาท)" 
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="รายละเอียด เช่น ค่าน้ำมัน, ค่าอาหาร" 
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>บันทึกรายจ่าย</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff', 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#c94c4c', // ใช้โทนสีแดง/ส้มเพื่อให้ต่างจากฝั่งรายรับ
    marginBottom: 10, 
    textAlign: 'center' 
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#c94c4c', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});