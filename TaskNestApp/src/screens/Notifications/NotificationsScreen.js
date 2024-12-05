import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { db, auth } from '../../firebase/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = () => {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', auth.currentUser.uid), // Fetch notifications for the current user
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(fetchedNotifications);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchNotifications();
    return unsubscribe;
  }, []);

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      Alert.alert('Notification deleted successfully.');
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification.');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true, // Mark the notification as read
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        item.isRead ? styles.readNotification : styles.unreadNotification,
      ]}
      onPress={() => {
        handleMarkAsRead(item.id);
        if (item.navigationPath) {
          navigation.navigate(item.navigationPath, item.navigationParams);
        }
      }}
    >
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp?.toDate().toLocaleString() || 'Just now'}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => handleDeleteNotification(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#E91E63" />
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications available</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.notificationList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#F9F9F9',
    borderLeftWidth: 5,
    borderLeftColor: '#E91E63',
  },
  readNotification: {
    backgroundColor: '#ECECEC',
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#E91E63',
    borderRadius: 5,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noNotifications: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 50,
  },
});

export default NotificationScreen;