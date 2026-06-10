import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import AddProductScreen from './src/screens/AddProductScreen.tsx';
import TabNavigator from './src/navigation/TabNavigator.tsx';
import ProductDetailScreen from './src/screens/ProductDetailScreen.tsx';
import { useAppStore } from './src/store/useStore.ts';
import { db, firebaseAuth } from './src/services/firebaseConfig.ts';
import AuthScreen from './src/screens/AuthScreen.tsx';
import ChatRoomScreen from './src/screens/ChatRoomScreen.tsx';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3c00ee',
    accent: '#03dac4',
  },
};
export default function App() {

  const { user, setUser } = useAppStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Écouteur Firebase Auth
    const subscriber = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Optionnel : Récupérer le profil complet depuis Firestore
        const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
        setUser({ uid: firebaseUser.uid, ...userDoc.data() } as any);

        // Pour l'instant, on set juste l'user pour débloquer l'UI
        // setUser({ uid: firebaseUser.uid, email: firebaseUser.email } as any);
      } else {
        setUser(null);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  if (initializing) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // L'utilisateur est connecté
            <>
              <Stack.Screen name="MainTabs" component={TabNavigator} />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ headerShown: true, title: 'Détails du produit' }}
              />
              {/* Ajout de la pile ChatRoom ici */}
              <Stack.Screen
                name="ChatRoom"
                component={ChatRoomScreen}
                options={{ headerShown: true, title: 'Discussion' }}
              />
            </>
          ) : (
            // L'utilisateur n'est pas connecté
            <Stack.Screen name="Auth" component={AuthScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}