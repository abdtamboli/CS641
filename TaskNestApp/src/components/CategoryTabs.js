import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CategoryTabs = ({ categories, onCategoryPress }) => {
  const [selectedTab, setSelectedTab] = useState(0); // Track the currently selected tab

  const handleTabPress = (index) => {
    setSelectedTab(index); // Update the selected tab
    onCategoryPress(categories[index]); // Notify the parent component
  };

  return (
    <View style={styles.container}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            selectedTab === index && styles.activeTab, // Highlight the selected tab
          ]}
          onPress={() => handleTabPress(index)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === index && styles.activeTabText, // Change text color for selected tab
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#E91E63', // Highlight color for the selected tab
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#FFF', // Text color for the active tab
    fontWeight: 'bold',
  },
});

export default CategoryTabs;