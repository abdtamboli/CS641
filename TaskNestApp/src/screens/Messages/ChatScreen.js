import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { db, auth } from '../../firebase/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  Timestamp,
  doc,
  deleteDoc,
} from 'firebase/firestore';

const ChatScreen = ({ route }) => {
  const { receiverId, receiverName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = () => {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('senderId', 'in', [auth.currentUser.uid, receiverId]),
        where('receiverId', 'in', [auth.currentUser.uid, receiverId]),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchMessages();
    return unsubscribe;
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: auth.currentUser.uid,
        receiverId,
        message: newMessage.trim(),
        timestamp: Timestamp.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = (messageId, senderId) => {
    if (auth.currentUser.uid !== senderId) {
      Alert.alert('Error', 'You can only delete your own messages.');
      return;
    }

    Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'messages', messageId));
          } catch (error) {
            console.error('Error deleting message:', error);
            Alert.alert('Error', 'Failed to delete message.');
          }
        },
      },
    ]);
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleDeleteMessage(item.id, item.senderId)}
      style={[
        styles.message,
        item.senderId === auth.currentUser.uid
          ? styles.outgoingMessage
          : styles.incomingMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp?.toDate().toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  messagesList: {
    padding: 10,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  outgoingMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  incomingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#E91E63',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ChatScreen;