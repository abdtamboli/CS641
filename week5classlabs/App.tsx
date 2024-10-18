import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, ActivityIndicator, View, Button, Text } from 'react-native';
import React, { useState } from 'react';

// Define prop types for ComponentOne
interface ComponentOneProps {
  initialValue: number;
}

// Component 1: Displays a number and updates it when the button is clicked
function ComponentOne({ initialValue }: ComponentOneProps) {
  const [count, setCount] = useState<number>(initialValue);  // Explicitly set type to number

  return (
    <View style={styles.componentContainer}>
      <Text style={styles.text}>Component 1 - Count: {count}</Text>
      <Button title="Increase Count" onPress={() => setCount(count + 1)} />
    </View>
  );
}

// Define prop types for ComponentTwo
interface ComponentTwoProps {
  initialText: string;
}

// Component 2: Displays a text and updates it when the button is clicked
function ComponentTwo({ initialText }: ComponentTwoProps) {
  const [text, setText] = useState<string>(initialText);  // Explicitly set type to string

  return (
    <View style={styles.componentContainer}>
      <Text style={styles.text}>{text}</Text>
      <Button title="Change Text" onPress={() => setText("Text Changed!")} />
    </View>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ActivityIndicator style={styles.loader} />
      
      {/* Pass the correct props */}
      <ComponentOne initialValue={5} />  {/* Correct prop: initialValue */}
      <ComponentTwo initialText="Mobile Web Development" /> {/* Correct prop: initialText */}
      
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  componentContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  loader: {
    marginBottom: 20,
  }
});