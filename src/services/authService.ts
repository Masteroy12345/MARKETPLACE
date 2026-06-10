import { firebaseAuth } from './firebaseConfig';

export const signUp = (email: string, pass: string) =>
  firebaseAuth.createUserWithEmailAndPassword(email, pass);

export const signIn = (email: string, pass: string) =>
  firebaseAuth.signInWithEmailAndPassword(email, pass);

export const signOut = () => firebaseAuth.signOut();