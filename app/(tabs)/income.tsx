import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../service/supabase';

export default function IncomeScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // ── ยอดที่ดึงจาก Supabase ──
  const [balance, setBalance] = useState({ total: 0, income: 0, expense: 0 });
  const [balanceLoading, setBalanceLoading] = useState(true);

  const router = useRouter();

  // ดึงยอดใหม่ทุกครั้งที่ focus มาที่หน้านี้
  const fetchBalance = async () => {
    setBalanceLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount');

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
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกรายละเอียด');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('transactions').insert([
      { type: 'income', amount: Number(amount), note: note.trim(), date: new Date() },
    ]);
    setLoading(false);

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    } else {
      Alert.alert('สำเร็จ', 'บันทึกรายรับเรียบร้อย', [
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
    <View style={styles.container}>

      {/* ── Banner ยอดคงเหลือ ── */}
      <View style={styles.balanceBanner}>
        <Text style={styles.bannerLabel}>ยอดเงินคงเหลือ</Text>
        {balanceLoading ? (
          <ActivityIndicator color="#fff" style={{ marginVertical: 6 }} />
        ) : (
          <Text style={styles.bannerTotal}>
            ฿{balance.total.toLocaleString()}
          </Text>
        )}
        <View style={styles.bannerRow}>
          <Text style={styles.bannerIncome}>
            รายรับ: ฿{balance.income.toLocaleString()}
          </Text>
          <Text style={styles.bannerExpense}>
            รายจ่าย: ฿{balance.expense.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* ── ฟอร์ม ── */}
      <View style={styles.form}>
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

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>บันทึกรายรับ</Text>
          }
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Banner
  balanceBanner: {
    backgroundColor: '#1A7A66',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerLabel: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.85,
  },
  bannerTotal: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 6,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  bannerIncome: {
    color: '#fff',
    fontSize: 13,
  },
  bannerExpense: {
    color: '#ff4d4d',
    fontSize: 13,
  },

  // Form
  form: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A7A66',
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1A7A66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});