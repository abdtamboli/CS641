import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext'; // AuthProvider import
import LaunchScreen from './src/screens/LaunchScreen'; // Launch screen import
import AppNavigator from './src/navigation/AppNavigator'; // Updated AppNavigator import
import { LogBox } from 'react-native';

// Ignore specific log messages (optional, for common Expo warnings)
LogBox.ignoreLogs([
  'AsyncStorage has been extracted', // Suppress AsyncStorage warning for Expo
]);

const App = () => {
  const [isLaunchVisible, setLaunchVisible] = useState(true); // Control for the launch screen

  useEffect(() => {
    // Simulate the launch screen duration
    const timer = setTimeout(() => setLaunchVisible(false), 2000); // Show launch for 2 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <AuthProvider>
      {isLaunchVisible ? (
        <LaunchScreen />
      ) : (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      )}
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default App;