import { Tabs } from 'expo-router';
import { IconSymbol } from '../../components/ui/IconSymbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#66c0f4',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Belajar',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="book.closed.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="code"
        options={{
          title: 'Kode',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person.circle.fill" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
