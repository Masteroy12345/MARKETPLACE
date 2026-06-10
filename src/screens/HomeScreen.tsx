import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator, Divider } from 'react-native-paper';
import { db } from '../services/firebaseConfig';
import { useAppStore } from '../store/useStore';

const HomeScreen = ({navigation}:any) => {
  const { products, setProducts } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.collection('products').onSnapshot(snapshot => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods as any);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <ActivityIndicator animating={true} style={styles.loader} size="large" />;

  return (
    <FlatList
      data={products}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card style={styles.card} elevation={2}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}>
          {/*<Card.Cover source={{ uri: 'https://via.placeholder.com/150' }} />*/}
          <Card.Cover source={{ uri: item.imageUrl }} />
          <Card.Title
            subtitle={`${item.price} FCFA • ${item.commentCount || 0} commentaire(s)`}
            title={item.title}  />
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: { marginBottom: 16, borderRadius: 12 },
  loader: { flex: 1, justifyContent: 'center' }
});

export default HomeScreen;