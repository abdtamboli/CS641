import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const tabs = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Search', icon: 'magnify', activeIcon: 'magnify' },
    { name: 'Post', icon: 'plus-circle-outline', activeIcon: 'plus-circle' },
    { name: 'Notifications', icon: 'bell-outline', activeIcon: 'bell' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => onTabPress(tab.name)}
        >
          <Icon
            name={activeTab === tab.name ? tab.activeIcon : tab.icon}
            size={24}
            color={activeTab === tab.name ? '#E91E63' : '#888'}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === tab.name ? '#E91E63' : '#888' },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavigation;