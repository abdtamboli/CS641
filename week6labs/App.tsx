import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ItemListComponent from './components/ItemListComponent'; // Import the FlatList component

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ItemListComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Light background color
  },
});