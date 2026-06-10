import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';



if (!firebase.apps.length) {
  firebase.initializeApp({appId:'com.marketplaceapp',projectId:'marketplaceapp-73fcd' });
}
// Exportez ces instances pour les utiliser dans vos composants ou vos stores Zustand
export const db = firestore();
export const firebaseAuth = auth();
export const fileStorage = storage();
