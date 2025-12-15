import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'leads' && styles.activeTab]}
        onPress={() => setActiveTab('leads')}
      >
        <Ionicons 
          name="clipboard-outline" 
          size={24} 
          color="#2E86AB"
        />
        <Text style={[styles.bottomTabText, activeTab === 'leads' && styles.activeTabText]}>Leads</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'offers' && styles.activeTab]}
        onPress={() => setActiveTab('offers')}
      >
        <Ionicons 
          name="call-outline" 
          size={24} 
          color="#2E86AB"
        />
        <Text style={[styles.bottomTabText, activeTab === 'offers' && styles.activeTabText]}>Appels d'offres</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
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
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10000,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#f0f8ff',
  },
  bottomTabText: {
    fontSize: 12,
    color: '#2E86AB',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#2E86AB',
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
