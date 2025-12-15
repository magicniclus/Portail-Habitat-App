import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Header = ({ onMenuPress }) => {
  return (
    <View style={styles.dashboardHeader}>
      <Image 
        source={require('../assets/icon.png')} 
        style={styles.headerLogo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={onMenuPress} style={styles.menuIcon}>
        <Feather name="menu" size={24} color="#2E86AB" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  menuIcon: {
    padding: 5,
  },
});

export default Header;
