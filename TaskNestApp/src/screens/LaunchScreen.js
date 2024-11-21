import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LaunchScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Transition after the animation
    }, 2500); // Match animation duration (3 seconds here)

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animation.json')} // Path to your animation JSON file
        autoPlay
        loop={false} // Play animation once
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Your brand color
  },
  animation: {
    width: 200, // Set the size of the animation
    height: 200,
  },
});

export default LaunchScreen;