import React, { useEffect, useState } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useAppStore } from '../store/useStore.ts';
import { db } from '../services/firebaseConfig.ts';

export default function ChatRoomScreen({ route }: any) {
  const { chat } = route.params;
  const [text, setText] = useState('');
  const { user } = useAppStore();
  const [messages, setMessages] = useState<any[]>([]);


  // Réception instantanée via onSnapshot
  useEffect(() => {
    return db.collection('chats').doc(chat.id).onSnapshot(doc => {
      const data = doc.data();
      if (data?.messages) setMessages(data.messages.reverse()); // Inverser pour les plus récents en bas
    });
  }, [chat.id]);

  const sendMessage = async () => {
    await db.collection('chats').doc(chat.id).update({
      messages: firestore.FieldValue.arrayUnion({
        message: text,
        senderId: user?.uid,
        createdAt: new Date()
      })
    });
    setText('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <FlatList
        data={messages}
        inverted // Très important pour garder les messages en bas
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.senderId === user?.uid ? styles.myBubble : styles.theirBubble]}>
            <Text style={item.senderId === user?.uid ? styles.myText : styles.theirText}>
              {item.message}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Message..." />
        <IconButton icon="send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  bubble: { padding: 12, margin: 8, borderRadius: 15, maxWidth: '80%' },
  myBubble: { backgroundColor: '#6200ee', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  myText: { color: '#fff' },
  theirText: { color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#fff' }
});