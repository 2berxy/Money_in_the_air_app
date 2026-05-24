import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../service/supabase';

export default function ExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState({ total: 0, income: 0, expense: 0 });
  const [balanceLoading, setBalanceLoading] = useState(true);

  const router = useRouter();

  const getCurrentDateString = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('th-TH', options);
  };

  const fetchBalance = async () => {
    setBalanceLoading(true);
    const { data, error } = await supabase.from('transactions').select('type, amount');

    if (!error && data) {
      let inc = 0, exp = 0;
      data.forEach((t: any) => {
        if (t.type === 'income') inc += t.amount;
        else exp += t.amount;
      });
      setBalance({ total: inc - exp, income: inc, expense: exp });
    }
    setBalanceLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
    }, [])
  );

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกจำนวนเงินให้ถูกต้องและมากกว่า 0');
      return;
    }
    if (!note.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกรายละเอียดรายจ่าย');
      return;
    }

    setLoading(true);

    const now = new Date();
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const { error } = await supabase.from('transactions').insert([
      { type: 'expense', amount: Number(amount), note: note.trim(), date: localDate },
    ]);
    
    setLoading(false);

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    } else {
      Alert.alert('สำเร็จ', 'บันทึกรายจ่ายเรียบร้อย', [
        {
          text: 'ตกลง',
          onPress: () => {
            setAmount('');
            setNote('');
            router.push('/(tabs)/home');
          },
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.balanceBanner}>
        <View style={styles.profileRow}>
          <Text style={styles.profileName}>Porameth Rattana</Text>
          <Image 
            source={require('../../assets/Cat.jpg')} 
            style={styles.profileImage} 
          />
        </View>

        <Text style={styles.bannerLabel}>ยอดเงินคงเหลือ</Text>
        {balanceLoading ? (
          <ActivityIndicator color="#fff" style={{ marginVertical: 6 }} />
        ) : (
          <Text style={styles.bannerTotal}>฿{balance.total.toLocaleString()}</Text>
        )}
        <View style={styles.bannerRow}>
          <Text style={styles.bannerIncome}>รายรับ: ฿{balance.income.toLocaleString()}</Text>
          <Text style={styles.bannerExpense}>รายจ่าย: ฿{balance.expense.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>บันทึกรายจ่าย</Text>
        <Text style={styles.dateText}>วันที่ {getCurrentDateString()}</Text>

        <TextInput
          style={styles.input}
          placeholder="จำนวนเงิน (บาท)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="รายละเอียด เช่น ค่าน้ำมัน, ค่าอาหาร"
          value={note}
          onChangeText={setNote}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>บันทึกรายจ่าย</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  balanceBanner: {
    backgroundColor: '#FF008E',
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#FF008E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  profileName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  profileImage: { width: 45, height: 45, borderRadius: 25, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  bannerLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center' },
  bannerTotal: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginVertical: 8 },
  bannerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 10 },
  bannerIncome: { color: '#fff', fontSize: 14, fontWeight: '600' },
  bannerExpense: { color: '#FFD1E3', fontSize: 14, fontWeight: '600' },
  form: { flex: 1, padding: 25, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#ff0000', marginBottom: 5, textAlign: 'center' }, 
  dateText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30, fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});