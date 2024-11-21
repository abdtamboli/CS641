import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            Alert.alert('Error', 'User data not found!');
          }
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEditProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const updatedData = { profilePicture: result.assets[0].uri };
        const user = auth.currentUser;

        if (user) {
          await updateDoc(doc(db, 'users', user.uid), updatedData);
          setUserData((prev) => ({ ...prev, ...updatedData }));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to update profile picture.');
    }
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleEditProfilePicture}>
        <Image
          source={{ uri: userData.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.cameraIcon}>
          <Icon name="camera" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>
      <Text style={styles.name}>{userData.username}</Text>
      <Text style={styles.email}>{userData.email}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E91E63',
    borderRadius: 15,
    padding: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#E91E63',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;