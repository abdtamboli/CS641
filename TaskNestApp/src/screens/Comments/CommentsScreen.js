import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { db, auth } from '../../firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';

const CommentsScreen = ({ route }) => {
  const { taskId } = route.params; // Get task ID from navigation
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userData, setUserData] = useState(null);

  // Fetch logged-in user's data
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  // Fetch comments from Firestore
  const fetchComments = async () => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskSnap = await getDoc(taskRef);
  
      if (taskSnap.exists()) {
        const taskData = taskSnap.data();
  
        // Ensure commentsCount is initialized to 0 if missing
        if (taskData.commentsCount === undefined) {
          await updateDoc(taskRef, { commentsCount: 0 });
        }
  
        setComments(taskData.comments || []);
      } else {
        console.error('Task not found!');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch current user's data
    fetchComments(); // Fetch comments
  }, [taskId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty!');
      return;
    }
  
    const comment = {
      userId: auth.currentUser.uid,
      username: userData?.username || 'Anonymous',
      profilePicture: userData?.profilePicture || 'https://via.placeholder.com/40',
      comment: newComment.trim(),
      timestamp: new Date(), // Set timestamp
    };
  
    try {
      const taskRef = doc(db, 'tasks', taskId);
  
      // Update Firestore: Add comment and increment comment count
      await updateDoc(taskRef, {
        comments: arrayUnion(comment), // Add the new comment
        commentsCount: increment(1), // Increment the comment count
      });
  
      // Update local state
      setComments((prev) => [...prev, comment]); // Add new comment to state
      setNewComment(''); // Clear input field
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to post comment.');
    }
  };

  // Delete a comment
  const handleDeleteComment = async (comment) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);

      await updateDoc(taskRef, {
        comments: arrayRemove(comment), // Remove the comment
        commentsCount: increment(-1), // Decrement the comment count
      });

      setComments((prev) => prev.filter((item) => item !== comment)); // Update local comments state
    } catch (error) {
      console.error('Error deleting comment:', error);
      Alert.alert('Error', 'Failed to delete comment.');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <View style={styles.commentHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
          <Text style={styles.username}>{item.username}</Text>
        </View>
        {/* Delete Button for Comment Owner */}
        {item.userId === auth.currentUser.uid && (
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDeleteComment(item) },
              ])
            }
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp?.toDate
          ? item.timestamp.toDate().toLocaleString() // Firestore Timestamp
          : new Date(item.timestamp).toLocaleString() // Regular JS Date
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Comments List */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComment}
        contentContainerStyle={styles.commentsList}
      />

      {/* Add Comment Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.addButton}>
          <Text style={styles.addButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  commentsList: {
    paddingBottom: 20,
  },
  comment: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align Delete Button to the Right
    marginBottom: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: 'red',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#E91E63',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default CommentsScreen;