import { db } from './firebaseConfig';
import { Product } from '../types';
import {useAppStore} from "../store/useStore.ts";

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await db.collection('products').get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};


export const startChat = async (productId: string, sellerId: string, productTitle: string) => {
  const currentUserId = useAppStore.getState().user?.uid;
  // Chercher si un chat existe déjà pour ce produit entre ces deux personnes
  const existingChat = await db.collection('chats')
      .where('productId', '==', productId)
      .where('usersIds', 'array-contains', currentUserId)
      .get();

  if (!existingChat.empty) return existingChat.docs[0].id;

  console.log("-------------aaa--------------",{
    productId,
    usersIds: [currentUserId, sellerId],
    title: productTitle,
    messages: [],
    createdAt: new Date()
  })


  // Créer un nouveau chat
  const newChat = await db.collection('chats').add({
    productId,
    usersIds: [currentUserId, sellerId],
    title: productTitle,
    messages: [],
    createdAt: new Date()
  });
  console.log("-------------aaaa--------------")

  return newChat.id;
};