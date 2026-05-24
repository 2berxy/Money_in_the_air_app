import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#FF008E', 
        tabBarInactiveTintColor: '#A0A0A0',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'หน้าแรก',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="income" 
        options={{ 
          title: 'รายรับ',
          tabBarIcon: ({ color }) => <Ionicons name="arrow-down-circle" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="expense" 
        options={{ 
          title: 'รายจ่าย',
          tabBarIcon: ({ color }) => <Ionicons name="arrow-up-circle" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}