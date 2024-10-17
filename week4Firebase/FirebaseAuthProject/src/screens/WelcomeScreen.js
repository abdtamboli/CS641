import React from 'react';
import { View, Text, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import globalStyles from '../styles/globalStyles';

const WelcomeScreen = ({ navigation }) => {
  const logout = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch((error) => console.error(error));
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default WelcomeScreen;