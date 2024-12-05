import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { db, auth } from '../../firebase/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

import TopBar from '../../components/TopBar';
import CategoryTabs from '../../components/CategoryTabs';
import TaskCard from '../../components/TaskCard';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('For you');
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data().profilePicture);
        } else {
          console.error('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to fetch user profile.');
      }
    }
  };

  const fetchTasks = () => {
    setLoading(true);

    const q = query(collection(db, 'tasks'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      Alert.alert('Success', 'Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task.');
    }
  };
  const handleNewTaskNotification = async (taskData) => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      usersSnapshot.forEach(async (userDoc) => {
        if (userDoc.id !== auth.currentUser.uid) {
          await addDoc(collection(db, 'notifications'), {
            userId: userDoc.id,
            message: `A new task titled "${taskData.title}" has been posted.`,
            timestamp: new Date(),
          });
        }
      });
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  };
  
  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    console.log(`Selected category: ${category}`);
  };

  const handleCommentPress = (taskId) => {
    navigation.navigate('Comments', { taskId });
  };

  const renderTask = ({ item }) => (
    <TaskCard
      taskId={item.id}
      userId={item.userId} // Pass the task owner's ID
      userImage={item.userImage || 'https://via.placeholder.com/40'}
      userName={item.userName || 'Anonymous'}
      location={item.location || ''}
      time={item.timestamp?.toDate().toLocaleString() || 'Just now'}
      postText={item.description || ''}
      taskImage={item.image || null}
      likes={item.likes || 0}
      likedBy={item.likedBy || []}
      commentsCount={item.commentsCount || 0}
      onCommentPress={handleCommentPress}
      onDeletePress={handleDeleteTask} // Pass delete function
    />
  );

  useEffect(() => {
    fetchUserProfile();
    const unsubscribe = fetchTasks();
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <TopBar
        profileImage={userProfile || 'https://via.placeholder.com/40'}
        onProfilePress={() => navigation.navigate('Profile')}
        onMessagePress={() => navigation.navigate('Messages')} // Navigate to Messages
        onNotificationPress={() => navigation.navigate('Notifications')} // Navigate to Notifications
        navigation={navigation} 
      />

      <CategoryTabs
        categories={['For you', 'Recent', 'Nearby', 'Trending']}
        activeCategory={activeCategory}
        onCategoryPress={handleCategoryPress}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#E91E63" style={styles.loader} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.taskList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loader: {
    marginTop: 20,
  },
  taskList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default HomeScreen;