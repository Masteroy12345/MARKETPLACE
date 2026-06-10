import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, Divider, TextInput } from 'react-native-paper';
import { db } from '../services/firebaseConfig';
import { startChat } from '../services/productService.ts';

export default function ProductDetailScreen({ route,navigation }: any) {
  const { product } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

// 2. Écouteur en temps réel (useEffect)
  useEffect(() => {
    const unsubscribe = db.collection('products')
      .doc(product.id)
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const comms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(comms);
      });
    return unsubscribe;
  }, [product.id]);

  const addComment = async () => {
    const productRef = db.collection('products').doc(product.id);

    await db.runTransaction(async (transaction) => {
      // 1. Ajouter le commentaire
      const newCommentRef = productRef.collection('comments').doc();
      transaction.set(newCommentRef, { text: comment, createdAt: new Date() });

      // 2. Incrémenter le compteur
      transaction.update(productRef, {
        commentCount: (product.commentCount || 0) + 1
      });
    });

    setComment('');
  };

  const handleContact = async () => {
    try {
      const chatId = await startChat(product.id, product.sellerId, product.title);

      // Récupérer les détails du chat pour naviguer (ou juste l'ID)
      const chatSnap = await db.collection('chats').doc(chatId).get();

      navigation.navigate('ChatRoom', {
        chat: { id: chatId, ...chatSnap.data() }
      });
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ouvrir la discussion");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: product.imageUrl }} />
        <Card.Content style={styles.content}>
          <Text variant="headlineMedium">{product.title}</Text>
          <Text variant="titleLarge" style={styles.price}>{product.price} FCFA</Text>
          <Text variant="bodyMedium">{product.description}</Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        icon="chat"
        onPress={handleContact}
        style={{ marginTop: 20, backgroundColor: '#6200ee' }}
      >
        Contacter le vendeur
      </Button>

      <View style={styles.commentSection}>
        <Text variant="titleMedium" style={{ marginBottom: 10 }}>
          Commentaires ({comments.length})
        </Text>

        {comments.map((comm) => (
          <View key={comm.id} style={{ marginBottom: 8, padding: 8, backgroundColor: '#eee', borderRadius: 8 }}>
            <Text variant="bodySmall">{comm.text}</Text>
          </View>
        ))}

        <TextInput
          label="Écrire un commentaire..."
          value={comment}
          onChangeText={setComment}
          mode="outlined"
          style={styles.commentInput}
        />
        <Button mode="contained" onPress={addComment}>Publier</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Couleur de fond neutre pour faire ressortir la card
  },
  content: {
    padding: 20,
    gap: 12, // Espacement uniforme entre les éléments (disponible sur les versions récentes de RN)
  },
  price: {
    color: '#6200ee', // Utilisation de votre couleur primaire
    fontWeight: '700',
    marginTop: 8,
  },
  commentSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInput: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sendButton: {
    alignSelf: 'flex-end',
    borderRadius: 8,
  },
});