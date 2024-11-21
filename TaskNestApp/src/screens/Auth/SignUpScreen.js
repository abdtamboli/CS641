import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const { signUp } = useAuth();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const userCredential = await signUp(email.trim(), password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      Alert.alert(
        'Verify Your Email',
        'A verification link has been sent to your email. Please verify your email before logging in.'
      );

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username,
        email: email.trim(),
        profilePicture: profilePicture || null,
      });

      // Redirect to Sign-In Screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSelectProfilePicture = async () => {
    try {
      // Request permissions if not already granted
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to access the photo library. Please enable permissions in your app settings.'
        );
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfilePicture(result.assets[0].uri); // Set the selected image URI
      } else {
        console.log('Image picker was canceled.');
      }
    } catch (error) {
      console.error('Error opening image picker:', error);
      Alert.alert('Error', 'Something went wrong while picking an image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SIGN UP</Text>

      {/* Profile Picture Upload */}
      <TouchableOpacity style={styles.profilePictureContainer} onPress={handleSelectProfilePicture}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <View style={styles.profilePicturePlaceholder}>
            <Icon name="camera-plus" size={40} color="#888" />
          </View>
        )}
        <View style={styles.iconOverlay}>
          <Icon name="camera" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email.toLowerCase()} // Force lowercase
        onChangeText={(text) => setEmail(text.toLowerCase())}
        autoCapitalize="none"
      />

      {/* Password Input with Eye Icon */}
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input with Eye Icon */}
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Icon name={isConfirmPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Sign-Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Already Have an Account */}
      <Text style={styles.signInText}>
        Already have an account?{' '}
        <Text
          style={styles.signInLink}
          onPress={() => navigation.navigate('SignIn')}
        >
          SIGN IN
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#E7ECF3',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E91E63',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#E91E63',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  signInText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  signUpLink: {
    fontWeight: 'bold',
    color: '#E91E63',
  },
});

export default SignUpScreen;