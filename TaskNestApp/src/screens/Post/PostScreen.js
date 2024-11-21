import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { db, auth } from '../../firebase/firebase';
import { collection, addDoc, doc, getDoc, getDocs } from 'firebase/firestore';

const PostScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
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
            console.error('User data not found!');
            Alert.alert('Error', 'User data not found!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to fetch user data.');
        }
      }
    };

    fetchUserData();
  }, []);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(location.coords);

      if (address.length > 0) {
        const { city, region, country } = address[0];
        setLocation(`${city}, ${region}, ${country}`);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to fetch location. Please try again.');
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleNotification = async (taskData) => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      usersSnapshot.forEach(async (userDoc) => {
        if (userDoc.id !== auth.currentUser.uid) {
          await addDoc(collection(db, 'notifications'), {
            userId: userDoc.id,
            message: `A new task titled "${taskData.title}" has been posted.`,
            timestamp: new Date(),
            isRead: false,
          });
        }
      });
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Error', 'Title, description, and location are required!');
      return;
    }

    if (!userData) {
      Alert.alert('Error', 'User data is not loaded. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'You must be logged in to post a task.');
        setLoading(false);
        return;
      }

      const taskData = {
        userId: user.uid,
        userImage: userData.profilePicture || 'https://via.placeholder.com/40',
        userName: userData.username || 'Anonymous',
        location,
        title,
        description,
        image: image || null,
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
        comments: [],
        commentsCount: 0,
      };

      await addDoc(collection(db, 'tasks'), taskData);

      await handleNotification(taskData);

      Alert.alert('Success', 'Task posted successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setImage(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error posting task:', error);
      Alert.alert('Error', 'Failed to post task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Post a New Task</Text>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Task Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity style={styles.locationButton} onPress={fetchLocation}>
            <Icon name="map-marker" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Icon name="camera-plus" size={24} color="#FFF" />
          <Text style={styles.imageButtonText}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Post Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#FFF',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostScreen;