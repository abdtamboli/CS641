import React, { useState } from 'react';
import {
  FlatList,
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const data = [
  { id: '1', title: 'Apple' },
  { id: '2', title: 'Banana' },
  { id: '3', title: 'Cherry' },
  { id: '4', title: 'Dragonfruit' },
  { id: '5', title: 'Elderberry' },
  { id: '6', title: 'Fig' },
  { id: '7', title: 'Grape' },
];

const ItemListComponent = () => {
  const [query, setQuery] = useState(''); // Query for filtering
  const [filteredData, setFilteredData] = useState(data); // Filtered items

  // Filter the data based on the user's query
  const handleSearch = (text: string) => {
    setQuery(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Show full list if no query
    }
  };

  // Render each item in the FlatList
  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* TextInput for the search query */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={query}
        onChangeText={handleSearch}
      />

      {/* FlatList displaying filtered results */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2', // Light background color
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  list: {
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 8,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#333',
  },
});

export default ItemListComponent;