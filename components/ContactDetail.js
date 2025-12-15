import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ContactDetail = ({ 
  contact, 
  onBackPress, 
  formatDate, 
  formatTime, 
  showStatusPicker, 
  setShowStatusPicker,
  getStatusOptions,
  handleStatusChange 
}) => {
  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <View style={styles.backButtonContent}>
            <Ionicons name="arrow-back" size={20} color="#2E86AB" />
            <Text style={styles.backButtonText}>Retour</Text>
          </View>
        </TouchableOpacity>
        <Image 
          source={require('../assets/icon.png')} 
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView style={styles.detailScrollView}>
        <View style={styles.detailContent}>
          <Text style={styles.detailTitle}>Détail du contact</Text>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Nom du client</Text>
            <Text style={styles.detailValue}>{contact.clientName}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Secteur</Text>
            <Text style={styles.detailValue}>{contact.sector}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Localisation</Text>
            <Text style={styles.detailValue}>{contact.location}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Date d'attribution</Text>
            <Text style={styles.detailValue}>{formatDate(contact.assignedAt)}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Heure</Text>
            <Text style={styles.detailValue}>{formatTime(contact.assignedAt)}</Text>
          </View>
          
          {contact.description && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{contact.description}</Text>
            </View>
          )}
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Prix du lead</Text>
            <Text style={styles.detailValue}>{contact.price}€</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Statut</Text>
            <TouchableOpacity 
              style={styles.statusContainer}
              onPress={() => setShowStatusPicker(true)}
            >
              <Text style={[styles.detailValue, styles.statusText]}>{contact.status}</Text>
              <Ionicons name="chevron-down" size={16} color="#2E86AB" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailBottomSpacer} />
        </View>
      </ScrollView>
      
      {/* Modal de sélection de statut */}
      {showStatusPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.statusPickerModal}>
            <Text style={styles.modalTitle}>Changer le statut</Text>
            {getStatusOptions().map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  contact.status === option.value && styles.selectedStatusOption
                ]}
                onPress={() => handleStatusChange(option.value)}
              >
                <Text style={[
                  styles.statusOptionText,
                  contact.status === option.value && styles.selectedStatusOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowStatusPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E86AB',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  detailScrollView: {
    flex: 1,
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  statusText: {
    color: '#2E86AB',
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  detailBottomSpacer: {
    height: 180,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  statusPickerModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 15,
    textAlign: 'center',
  },
  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedStatusOption: {
    backgroundColor: '#2E86AB',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedStatusOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ContactDetail;
