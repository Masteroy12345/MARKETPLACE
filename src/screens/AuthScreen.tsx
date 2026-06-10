import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, Avatar, ActivityIndicator, RadioButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { signUp, signIn } from '../services/authService';
import { db, fileStorage } from '../services/firebaseConfig';
import { useAppStore } from '../store/useStore';
import { PROFILE_TYPE } from '../types';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const { setUser } = useAppStore(); // Utilisation de setUser venant de Zustand
  const { control, handleSubmit } = useForm({
    defaultValues: { email: '', password: '', username: '',type:'' }
  });

  const uploadAvatar = async (uri: string, uid: string) => {
    const ref = fileStorage.ref(`avatars/${uid}`);
    await ref.putFile(uri);
    return await ref.getDownloadURL();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isLogin) {
        const userCred = await signIn(data.email, data.password);
        // Récupérer le profil complet depuis Firestore après le login
        const userDoc = await db.collection('users').doc(userCred.user.uid).get();
        setUser({ uid: userCred.user.uid, ...userDoc.data() } as any);
      } else {
        const userCred = await signUp(data.email, data.password);
        let photoUrl = '';
        if (avatarUri) {
          photoUrl = await uploadAvatar(avatarUri, userCred.user.uid);
        }
        const newUser: any = {
          uid: userCred.user.uid,
          email: data.email,
          username: data.username,
          type: data.type, // Maintenant typé par l'enum
          avatarUrl: photoUrl,
          createdAt: new Date()
        };
        await db.collection('users').doc(userCred.user.uid).set(newUser);
        setUser(newUser);
      }
    } catch (e: any) { Alert.alert(e.message); }
    finally { setLoading(false); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      {!isLogin && (
        <TouchableOpacity onPress={() => launchImageLibrary({mediaType: 'photo'}, (res) => setAvatarUri(res.assets?.[0].uri || null))}>
          <Avatar.Image size={80} source={{ uri: avatarUri || 'https://via.placeholder.com/150' }} style={styles.avatar} />
        </TouchableOpacity>
      )}

      <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
        <TextInput label="Email" value={value} onChangeText={onChange} mode="outlined" style={styles.input} />
      )} />

      {!isLogin && (
        <Controller control={control} name="username" render={({ field: { onChange, value } }) => (
          <TextInput label="Nom d'utilisateur" value={value} onChangeText={onChange} mode="outlined" style={styles.input} />
        )} />
      )}

      {!isLogin && (
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <View style={styles.radioGroup}>
              <Text variant="bodyMedium">Je suis un : </Text>
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioOption}>
                  <RadioButton value={PROFILE_TYPE.USER} />
                  <Text>Acheteur</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value={PROFILE_TYPE.SELLER} />
                  <Text>Vendeur</Text>
                </View>
              </RadioButton.Group>
            </View>
          )}
        />
      )}

      <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
        <TextInput label="Mot de passe" value={value} onChangeText={onChange} secureTextEntry mode="outlined" style={styles.input} />
      )} />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>{isLogin ? 'Connexion' : 'S\'inscrire'}</Button>
      <Button onPress={() => setIsLogin(!isLogin)}>{isLogin ? 'Créer un compte' : 'Déjà inscrit ? Connectez-vous'}</Button>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Fond blanc propre
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 24,
    backgroundColor: '#e0e0e0', // Couleur de fond pour l'avatar par défaut
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9', // Très léger gris pour distinguer les inputs
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  switchButton: {
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});