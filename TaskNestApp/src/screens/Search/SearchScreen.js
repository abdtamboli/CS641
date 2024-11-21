import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const tasksRef = collection(db, 'tasks');
      const usersRef = collection(db, 'users');

      // Fetch tasks matching the search query
      const taskQuery = query(
        tasksRef,
        orderBy('title'),
        startAt(searchQuery),
        endAt(searchQuery + '\uf8ff') // Firestore partial search
      );
      const taskSnapshot = await getDocs(taskQuery);

      // Fetch users matching the search query
      const userQuery = query(
        usersRef,
        orderBy('username'),
        startAt(searchQuery),
        endAt(searchQuery + '\uf8ff')
      );
      const userSnapshot = await getDocs(userQuery);

      // Combine results
      const taskResults = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'task',
        ...doc.data(),
      }));
      const userResults = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'user',
        ...doc.data(),
      }));

      setResults([...taskResults, ...userResults]);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to render each result
  const renderResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        if (item.type === 'user') {
          navigation.navigate('Profile', { userId: item.id });
        } else if (item.type === 'task') {
          navigation.navigate('Comments', { taskId: item.id });
        }
      }}
    >
      <Text style={styles.resultText}>
        {item.type === 'user' ? `User: ${item.username}` : `Task: ${item.title}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for tasks or users..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleSearch} // Trigger search on Enter key
      />

      {/* Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#E91E63" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderResult}
          contentContainerStyle={styles.resultList}
          ListEmptyComponent={<Text style={styles.emptyText}>No results found.</Text>}
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
  searchBar: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  resultList: {
    paddingVertical: 10,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  resultText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default SearchScreen;