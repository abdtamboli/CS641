import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View, StyleSheet } from 'react-native';

// Create Stack Navigator
const Stack = createNativeStackNavigator();

// Create Drawer Navigator
const Drawer = createDrawerNavigator();

// Create Tab Navigator
const Tab = createBottomTabNavigator();

// Tab Screens for Home
const HomeTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#6b52ae',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="DetailsTab" component={DetailsScreen} options={{ title: 'Details' }} />
  </Tab.Navigator>
);

// Home Screen Component (with tabs)
const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button color="#6b52ae" title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
};

// Details Screen Component (second tab in Home)
const DetailsScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Button color="#6b52ae" title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
};

// Settings Screen Component
const SettingsScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <Button color="#6b52ae" title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
};

// Profile Screen Component
const ProfileScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Button color="#6b52ae" title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

// Drawer Navigator containing Tab Navigator and Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#f3f3f3',
            width: 240,
          },
          drawerActiveTintColor: '#6b52ae',
          drawerLabelStyle: {
            fontSize: 18,
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeTabNavigator} options={{ title: 'Home Tabs' }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Styles for the screens
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#6b52ae',
  },
});