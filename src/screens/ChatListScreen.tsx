import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { List, Avatar } from 'react-native-paper';
import { db } from '../services/firebaseConfig';
import { useAppStore } from '../store/useStore';

export default function ChatListScreen({ navigation }: any) {
  const { user } = useAppStore();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    return db.collection('chats')
      .where('usersIds', 'array-contains', user?.uid)
      .onSnapshot(snapshot => {
        setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
  }, []);

  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => (
        <List.Item
          title={item.title}
          description={item.messages[item.messages.length - 1]?.message || "Aucun message"}
          left={props => <List.Icon {...props} icon="chat" />}
          onPress={() => navigation.navigate('ChatRoom', { chat: item })}
        />
      )}
    />
  );
}