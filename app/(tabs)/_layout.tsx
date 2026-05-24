import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1A7A66', headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'หน้าแรก' }} />
      <Tabs.Screen name="income" options={{ title: 'รายรับ' }} />
      <Tabs.Screen name="expense" options={{ title: 'รายจ่าย' }} />
    </Tabs>
  );
}