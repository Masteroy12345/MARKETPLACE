import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // CORRECT
import HomeScreen from '../screens/HomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ProfileScreen from '../screens/ProfileScreen.tsx';
import ChatListScreen from '../screens/ChatListScreen.tsx';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#6200ee' }}>
      <Tab.Screen
        name="Marketplace"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="shopping" color={color} size={26} /> }}
      />
      <Tab.Screen
        name="Vendre"
        component={AddProductScreen}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="plus-circle" color={color} size={26} /> }}
      />
      <Tab.Screen
        name="Messages"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="message-text" color={color} size={26} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" color={color} size={26} /> }}
      />
    </Tab.Navigator>
  );
}