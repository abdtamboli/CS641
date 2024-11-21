import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PostScreen from '../screens/Post/PostScreen';
import CommentsScreen from '../screens/Comments/CommentsScreen';
import MessageListScreen from '../screens/Messages/MessageListScreen';
import ChatScreen from '../screens/Messages/ChatScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen'; // Notifications Screen
import SearchScreen from '../screens/Search/SearchScreen'; // Search Screen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home-outline';
        if (route.name === 'Post') iconName = 'plus-circle-outline';
        if (route.name === 'Messages') iconName = 'message-outline';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#E91E63',
      tabBarInactiveTintColor: '#555',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Post" component={PostScreen} />
    <Tab.Screen name="Messages" component={MessageListScreen} />
  </Tab.Navigator>
);

// Main Stack Navigator
const AppNavigator = () => (
  <Stack.Navigator>
    {/* Auth Screens */}
    <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

    {/* Main Tabs */}
    <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />

    {/* Profile Screen */}
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

    {/* Comments Screen */}
    <Stack.Screen name="Comments" component={CommentsScreen} options={{ title: 'Comments' }} />

    {/* Chat Screen */}
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({
        title: `Chat with ${route.params.receiverName}`,
        headerTintColor: '#FFF',
        headerStyle: { backgroundColor: '#E91E63' },
      })}
    />

    {/* Notifications Screen */}
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        title: 'Notifications',
        headerTintColor: '#FFF',
        headerStyle: { backgroundColor: '#E91E63' },
      }}
    />

    {/* Search Screen */}
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{
        title: 'Search',
        headerTintColor: '#FFF',
        headerStyle: { backgroundColor: '#E91E63' },
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;