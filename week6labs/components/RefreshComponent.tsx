import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, Alert } from 'react-native';

const RefreshComponent = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  // Function to handle the refresh logic
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'The content has been refreshed!');
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.text}>Pull down to refresh the content</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text color to contrast with the background
    marginBottom: 20,
  },
});

export default RefreshComponent;