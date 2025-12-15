import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LeadCard = ({ lead, onViewPress, formatDate, formatTime }) => {
  return (
    <View style={styles.leadCard}>
      <View style={styles.leadInfo}>
        <Text style={styles.leadClient}>{lead.clientName}</Text>
        <Text style={styles.leadSector}>{lead.sector}</Text>
        <Text style={styles.leadLocation}>{lead.location}</Text>
        <View style={styles.leadDateTime}>
          <Text style={styles.leadDate}>{formatDate(lead.assignedAt)}</Text>
          <Text style={styles.leadTime}>{formatTime(lead.assignedAt)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => onViewPress(lead)}
      >
        <Text style={styles.viewButtonText}>Voir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  leadCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86AB',
  },
  leadInfo: {
    flex: 1,
  },
  leadClient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  leadSector: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  leadLocation: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  leadDateTime: {
    flexDirection: 'row',
    gap: 10,
  },
  leadDate: {
    fontSize: 12,
    color: '#2E86AB',
    fontWeight: 'bold',
  },
  leadTime: {
    fontSize: 12,
    color: '#2E86AB',
  },
  viewButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LeadCard;
