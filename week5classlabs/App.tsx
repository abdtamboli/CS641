import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, ActivityIndicator, View, Button, Text } from 'react-native';
import React, { useState } from 'react';

// Component 1: Displays a number and updates it when the button is clicked
function ComponentOne({ initialValue }) {
  const [count, setCount] = useState(initialValue);

  return (
    <View style={styles.componentContainer}>
      <Text>Component 1 - Count: {count}</Text>
      <Button title="Increase Count" onPress={() => setCount(count + 1)} />
    </View>
  );
}

// Component 2: Displays a text and updates it when the button is clicked
function ComponentTwo({ initialText }) {
  const [text, setText] = useState(initialText);

  return (
    <View style={styles.componentContainer}>
      <Text>{text}</Text>
      <Button title="Change Text" onPress={() => setText("Text Changed!")} />
    </View>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ActivityIndicator />
      
      {/* Replace initialValue and initialText with the text/number you want */}
      <ComponentOne initialValue={5} />
      <ComponentTwo initialText="Mobile Web Development" />
      
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  componentContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
});