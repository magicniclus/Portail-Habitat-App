import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ContactBottomNavigation = ({ onEmailPress, onCallPress }) => {
  return (
    <View style={styles.detailBottomNavigation}>
      <TouchableOpacity 
        style={styles.bottomTab}
        onPress={onEmailPress}
      >
        <Ionicons name="mail" size={24} color="#2E86AB" />
        <Text style={styles.bottomTabText}>Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.bottomTab}
        onPress={onCallPress}
      >
        <Ionicons name="call" size={24} color="#2E86AB" />
        <Text style={styles.bottomTabText}>Appeler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  detailBottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 9999,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  bottomTabText: {
    fontSize: 12,
    color: '#2E86AB',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ContactBottomNavigation;
