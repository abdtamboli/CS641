import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db, auth } from '../firebase/firebase';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';

const TaskCard = ({
  userImage,
  userName,
  location,
  time,
  postText,
  taskImage,
  taskId,
  userId,
  likes = 0,
  likedBy = [],
  commentsCount = 0,
  onCommentPress,
  onDeletePress,
}) => {
  const [isLiked, setIsLiked] = useState(likedBy.includes(auth.currentUser.uid));

  const handleLike = async () => {
    const taskRef = doc(db, 'tasks', taskId);
    try {
      if (isLiked) {
        await updateDoc(taskRef, {
          likes: increment(-1),
          likedBy: arrayRemove(auth.currentUser.uid),
        });
      } else {
        await updateDoc(taskRef, {
          likes: increment(1),
          likedBy: arrayUnion(auth.currentUser.uid),
        });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDeletePress(taskId) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Image source={{ uri: userImage || 'https://via.placeholder.com/40' }} style={styles.userImage} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userLocation}>{location}</Text>
          <Text style={styles.userTime}>{time}</Text>
        </View>
        {/* Show delete button only for the task owner */}
        {auth.currentUser.uid === userId && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="delete-outline" size={24} color="#E91E63" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.postText}>{postText}</Text>

      {taskImage && <Image source={{ uri: taskImage }} style={styles.taskImage} />}

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#E91E63' : '#888'}
          />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onCommentPress(taskId)} style={styles.actionButton}>
          <Icon name="comment-outline" size={24} color="#888" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userDetails: {
    flex: 1, // Ensures the details take the remaining space
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userLocation: {
    fontSize: 12,
    color: '#888',
  },
  userTime: {
    fontSize: 12,
    color: '#888',
  },
  postText: {
    fontSize: 14,
    marginVertical: 10,
  },
  taskImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default TaskCard;