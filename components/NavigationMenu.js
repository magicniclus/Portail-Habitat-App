import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NavigationMenu = ({ showNavigation, onClose, onLogout, onSettings }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showNavigation) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showNavigation, slideAnim, fadeAnim]);

  if (!showNavigation) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <Animated.View 
        style={[
          styles.navigationPanel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.navigationHeader}>
          <Text style={styles.navigationTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#2E86AB" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.navigationContent}>
          <TouchableOpacity style={styles.navigationItem} onPress={onSettings}>
            <Ionicons name="settings-outline" size={24} color="#2E86AB" />
            <Text style={styles.navigationItemText}>Paramètres</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navigationItem} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
            <Text style={[styles.navigationItemText, styles.logoutText]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10000,
  },
  backdrop: {
    flex: 1,
  },
  navigationPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  navigationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  closeButton: {
    padding: 5,
  },
  navigationContent: {
    flex: 1,
    paddingTop: 20,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  navigationItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  logoutText: {
    color: '#e74c3c',
  },
});

export default NavigationMenu;
