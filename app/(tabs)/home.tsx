import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    if (dateString.includes('-') && !dateString.includes('T') && !dateString.includes(' ')) {
      const [year, month, day] = dateString.split('-');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return date.toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Text style={styles.profileName}>Porameth Rattana</Text>
          <Image 
            source={require('../../assets/Cat.jpg')}
            style={styles.profileImage} 
          />
        </View>

        <Text style={styles.headerTitle}>ยอดเงินคงเหลือ</Text>
        <Text style={styles.balance}>฿{balance.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>รายรับ</Text>
            <Text style={styles.income}>+฿{balance.income.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>รายจ่าย</Text>
            <Text style={styles.expense}>-฿{balance.expense.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.listTitle}>ประวัติรายการ</Text>

      {loading ? <ActivityIndicator size="large" color="#FF008E" style={{marginTop: 40}} /> : (
        <FlatList
          data={transactions}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.listIconPlaceholder}>
                 <Text style={{ fontSize: 18 }}>{item.type === 'income' ? '💰' : '💸'}</Text>
              </View>
              <View style={styles.listDetails}>
                <Text style={styles.listNote} numberOfLines={1}>{item.note}</Text>
                <Text style={styles.listDate}>{formatDate(item.date || item.created_at)}</Text>
              </View>
              <Text style={[styles.listAmount, { color: item.type === 'income' ? '#2ECC71' : '#ff0000' }]}>
                {item.type === 'income' ? '+' : '-'}฿{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          )}
          ListEmptyComponent={
             <Text style={styles.emptyText}>ยังไม่มีประวัติรายการ</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#FF008E', 
    padding: 30, 
    paddingTop: 60, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35,
    shadowColor: '#FF008E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 1,
  },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  profileName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  profileImage: { width: 45, height: 45, borderRadius: 25, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  headerTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  balance: { color: '#fff', fontSize: 38, fontWeight: '800', textAlign: 'center', marginVertical: 8 },
  summaryContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20, 
    paddingVertical: 15,
    marginTop: 10,
  },
  summaryBox: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 5 },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 },
  income: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  expense: { color: '#FFD1E3', fontSize: 16, fontWeight: 'bold' },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 25, marginTop: 25, marginBottom: 10 },
  listContainer: { paddingBottom: 20 },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff', 
    padding: 18, 
    marginHorizontal: 20, 
    marginBottom: 12, 
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listIconPlaceholder: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  listDetails: { flex: 1 },
  listNote: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  listDate: { fontSize: 13, color: '#95a5a6', marginTop: 4, fontWeight: '500' },
  listAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30, fontSize: 16 },
});