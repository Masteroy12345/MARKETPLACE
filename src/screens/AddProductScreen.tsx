import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import { db, fileStorage as storage } from '../services/firebaseConfig';
import { useAppStore } from '../store/useStore.ts';

export default function AddProductScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAppStore();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', price: '', category: '' }
  });

  const selectImage = (fromCamera: boolean) => {
    const options = { mediaType:'photo' as const};
    // const options = { mediaType: 'photo' as const, quality: 0.5 };
    const callback = (res: any) => { if (res.assets) setImageUri(res.assets[0].uri); };

    if (fromCamera) launchCamera(options, callback);
    else launchImageLibrary(options, callback);
  };

  const onSubmit = async (data: any) => {
    if (!imageUri) return Alert.alert("Erreur", "Une photo est obligatoire");
    setLoading(true);
    try {
      const ref = storage.ref(`products/${Date.now()}`);
      await ref.putFile(imageUri);
      const url = await ref.getDownloadURL();

      await db.collection('products').add({
        ...data,
        price: Number(data.price),
        imageUrl: url,
        sellerName: user?.username,
        sellerId: user?.uid,
        commentCount: 0,
        createdAt: new Date()
      });
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Erreur", "Échec de l'upload");
    }
    finally { setLoading(false); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Vendre un produit</Text>
      {
        user?.type=='seller'?
          <>
            <View style={styles.imageRow}>
              <Button icon="camera" onPress={() => selectImage(true)}>Camera</Button>
              <Button icon="image" onPress={() => selectImage(false)}>Galerie</Button>
            </View>
            {imageUri && <Text style={styles.success}>Photo prête !</Text>}

            <Controller control={control} name="title" rules={{ required: true }} render={({ field: { onChange, value } }) => (
              <TextInput label="Nom du produit" value={value} onChangeText={onChange} mode="outlined" style={styles.input} />
            )} />

            <Controller control={control} name="category" rules={{ required: true }} render={({ field: { onChange, value } }) => (
              <TextInput label="Catégorie" value={value} onChangeText={onChange} mode="outlined" style={styles.input} />
            )} />

            <Controller control={control} name="price" rules={{ required: true }} render={({ field: { onChange, value } }) => (
              <TextInput label="Prix (FCFA)" value={value} onChangeText={onChange} mode="outlined" keyboardType="numeric" style={styles.input} />
            )} />

            <Controller control={control} name="description" rules={{ required: true }} render={({ field: { onChange, value } }) => (
              <TextInput label="Description détaillée" value={value} onChangeText={onChange} mode="outlined" multiline numberOfLines={4} style={styles.input} />
            )} />

            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitBtn}>
              Publier l'annonce
            </Button>
          </>
          :
          <>
            <Text>Vous n'etes pas vendeur</Text>
            <Button mode="contained" onPress={handleSubmit(()=>{})} style={styles.submitBtn}>
              Devenir Vendeur
            </Button>

          </>
      }

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { marginBottom: 20, textAlign: 'center' },
  imageRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  input: { marginBottom: 10 },
  submitBtn: { marginTop: 20, paddingVertical: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  success: { color: 'green', textAlign: 'center', marginBottom: 10 }
});