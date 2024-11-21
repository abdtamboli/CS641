import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db, auth } from '../firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const TopBar = ({ profileImage, onProfilePress, navigation }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = () => {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', auth.currentUser.uid), // Fetch notifications for the logged-in user
        where('read', '==', false) // Filter unread notifications
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setUnreadCount(snapshot.size); // Update unread count dynamically
        },
        (error) => {
          console.error('Error fetching unread notifications:', error);
          Alert.alert('Error', 'Failed to fetch notifications.');
        }
      );

      return unsubscribe;
    };

    const unsubscribe = fetchUnreadNotifications();
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity onPress={onProfilePress}>
        <Image
          source={{ uri: profileImage || 'https://via.placeholder.com/40' }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

     {/* Search Bar */}
     <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search')} // Navigate to SearchScreen
      >
        <Icon name="magnify" size={20} color="#888" style={styles.searchIcon} />
        <Text style={styles.searchInput}>Search</Text>
      </TouchableOpacity>

      {/* Notification Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={styles.notificationIcon}
      >
        <Icon name="bell-outline" size={24} color="#888" />
        {unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Message Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Messages')}
        style={styles.messageIcon}
      >
        <Icon name="message-outline" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#DDD',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  notificationIcon: {
    marginLeft: 10,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#E91E63',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageIcon: {
    marginLeft: 10,
  },
});

export default TopBar;