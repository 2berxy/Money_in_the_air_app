import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../service/supabase';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({ total: 0, income: 0, expense: 0 });

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else {
      setTransactions(data);
      let inc = 0, exp = 0;
     data.forEach((t: any) => {
        if (t.type === 'income') inc += t.amount;
        else exp += t.amount;
      });
      setBalance({ total: inc - exp, income: inc, expense: exp });
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ยอดเงินคงเหลือ</Text>
        <Text style={styles.balance}>฿{balance.total.toLocaleString()}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.income}>รายรับ: ฿{balance.income.toLocaleString()}</Text>
          <Text style={styles.expense}>รายจ่าย: ฿{balance.expense.toLocaleString()}</Text>
        </View>
      </View>

      {loading ? <ActivityIndicator size="large" color="#1A7A66" style={{marginTop: 20}} /> : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.note}</Text>
              <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
                {item.type === 'income' ? '+' : '-'}฿{item.amount.toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1A7A66', padding: 30, paddingTop: 60, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: '#fff', fontSize: 16, textAlign: 'center' },
  balance: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  income: { color: '#fff', fontSize: 14 },
  expense: { color: '#ff4d4d', fontSize: 14 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginTop: 10, borderRadius: 10 }
});