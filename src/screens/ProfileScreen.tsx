import React from 'react';
import { View } from 'react-native';
import { Button, Avatar, Text } from 'react-native-paper';
import { useAppStore } from '../store/useStore';
import { signOut } from '../services/authService.ts';

export default function ProfileScreen() {
  const { user } = useAppStore();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Avatar.Image size={100} source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/150' }} />
      <Text variant="headlineSmall">{user?.username}</Text>
      <Text variant="headlineSmall">{user?.type}</Text>
      <Button mode="outlined" onPress={() => signOut()}>
        Déconnexion
      </Button>
    </View>
  );
}