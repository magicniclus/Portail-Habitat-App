import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Linking, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import BottomNavigation from './components/BottomNavigation';
import ContactBottomNavigation from './components/ContactBottomNavigation';
import Header from './components/Header';
import LeadCard from './components/LeadCard';
import ContactDetail from './components/ContactDetail';
import NavigationMenu from './components/NavigationMenu';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'contact-detail', 'navigation', 'settings'
  const [selectedContact, setSelectedContact] = useState(null);
  const [artisanData, setArtisanData] = useState(null);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' ou 'offers'
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Utilisateur connecté, vérifier/créer le document dans Firestore
        await ensureUserDocument(user);
        await loadArtisanData(user.uid);
        setUser(user);
      } else {
        setUser(null);
        setArtisanData(null);
        setAssignedLeads([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadArtisanData = async (userId) => {
    try {
      // Chercher l'artisan associé à cet utilisateur
      const artisansQuery = query(
        collection(db, 'artisans'),
        where('userId', '==', userId)
      );
      const artisansSnapshot = await getDocs(artisansQuery);
      
      if (!artisansSnapshot.empty) {
        const artisanDoc = artisansSnapshot.docs[0];
        const artisanData = { id: artisanDoc.id, ...artisanDoc.data() };
        setArtisanData(artisanData);
        
        // Charger les leads assignés en temps réel depuis Firebase
        console.log('🔄 Chargement des leads pour artisan:', artisanData.id);
        loadAssignedLeads(artisanData.id);
      } else {
        // Si aucun artisan trouvé, créer des données d'exemple pour la démo
        console.log('🆕 Aucun artisan trouvé, création de données d\'exemple');
        await createSampleData(userId);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données artisan:', error);
    }
  };

  const createSampleData = async (userId) => {
    try {
      // Créer un artisan d'exemple
      const artisanRef = doc(collection(db, 'artisans'));
      const artisanData = {
        userId: userId,
        companyName: 'Entreprise Demo',
        firstName: 'Demo',
        lastName: 'Artisan',
        assignedLeads: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(artisanRef, artisanData);
      setArtisanData({ id: artisanRef.id, ...artisanData });

      // Créer des estimations d'exemple selon le schéma
      const estimationsData = [
        {
          sessionId: 'demo-session-1',
          status: 'completed',
          isPublished: false,
          clientInfo: {
            firstName: 'Jean Dupont',
            phone: '+33 6 12 34 56 78',
            email: 'jean.dupont@email.com',
            acceptsCGV: true
          },
          location: {
            postalCode: '75015',
            city: 'Paris',
            department: '75'
          },
          project: {
            propertyType: 'Appartement',
            prestationType: 'Plomberie',
            prestationSlug: 'plomberie',
            surface: 50,
            prestationLevel: 'mid',
            existingState: 'renovation',
            timeline: 'soon'
          },
          pricing: {
            estimationLow: 800,
            estimationMedium: 1200,
            estimationHigh: 1600,
            calculationMethod: 'ai',
            confidenceScore: 85
          },
          createdAt: serverTimestamp(),
          completedAt: serverTimestamp()
        },
        {
          sessionId: 'demo-session-2',
          status: 'completed',
          isPublished: true,
          clientInfo: {
            firstName: 'Marie Martin',
            phone: '+33 6 98 76 54 32',
            email: 'marie.martin@email.com',
            acceptsCGV: true
          },
          location: {
            postalCode: '92100',
            city: 'Boulogne-Billancourt',
            department: '92'
          },
          project: {
            propertyType: 'Maison',
            prestationType: 'Électricité',
            prestationSlug: 'electricite',
            surface: 80,
            prestationLevel: 'high',
            existingState: 'creation',
            timeline: 'urgent'
          },
          pricing: {
            estimationLow: 1200,
            estimationMedium: 1800,
            estimationHigh: 2400,
            calculationMethod: 'statistical',
            confidenceScore: 90
          },
          createdAt: serverTimestamp(),
          completedAt: serverTimestamp()
        },
        {
          sessionId: 'demo-session-3',
          status: 'completed',
          isPublished: false,
          clientInfo: {
            firstName: 'Pierre Durand',
            phone: '+33 6 11 22 33 44',
            email: 'pierre.durand@email.com',
            acceptsCGV: true
          },
          location: {
            postalCode: '92130',
            city: 'Issy-les-Moulineaux',
            department: '92'
          },
          project: {
            propertyType: 'Appartement',
            prestationType: 'Chauffage',
            prestationSlug: 'chauffage',
            surface: 60,
            prestationLevel: 'low',
            existingState: 'good_condition',
            timeline: 'later'
          },
          pricing: {
            estimationLow: 600,
            estimationMedium: 900,
            estimationHigh: 1200,
            calculationMethod: 'manual',
            confidenceScore: 75
          },
          createdAt: serverTimestamp(),
          completedAt: serverTimestamp()
        }
      ];

      // Créer les estimations et récupérer leurs IDs
      const estimationIds = [];
      for (const estimationData of estimationsData) {
        const estimationRef = doc(collection(db, 'estimations'));
        await setDoc(estimationRef, estimationData);
        estimationIds.push(estimationRef.id);
      }

      // Mettre à jour l'artisan avec les assignedLeads
      const assignedLeads = estimationIds.map((estimationId, index) => ({
        estimationId: estimationId,
        assignedAt: serverTimestamp(),
        price: [25, 35, 20][index]
      }));

      await setDoc(artisanRef, {
        ...artisanData,
        assignedLeads: assignedLeads
      });

      // Les leads seront chargés automatiquement via l'écouteur onSnapshot
    } catch (error) {
      console.error('Erreur lors de la création des données d\'exemple:', error);
    }
  };

  const loadAssignedLeads = (artisanId) => {
    try {
      // Écouter les changements de la sous-collection 'leads' de l'artisan
      const leadsCollectionRef = collection(db, 'artisans', artisanId, 'leads');
      const unsubscribe = onSnapshot(leadsCollectionRef, (snapshot) => {
        console.log('📋 Nombre de leads dans la sous-collection:', snapshot.size);
        
        const leads = [];
        snapshot.forEach((doc) => {
          const leadData = doc.data();
          console.log('📄 Lead récupéré - ID:', doc.id);
          console.log('   - clientName:', leadData.clientName);
          console.log('   - status:', leadData.status);
          console.log('   - source:', leadData.source);
          console.log('   - projectType:', leadData.projectType);
          console.log('   - city:', leadData.city);
          
          leads.push({
            id: doc.id,
            clientName: leadData.clientName || 'Client',
            clientEmail: leadData.clientEmail || '',
            clientPhone: leadData.clientPhone || '',
            sector: leadData.projectType || 'Non spécifié',
            location: leadData.city || '',
            description: leadData.projectType || '',
            status: leadData.status || 'nouveau',
            source: leadData.source || '',
            assignedAt: leadData.createdAt?.toDate() || new Date(),
            price: 0 // Prix par défaut
          });
        });
        
        // Trier par date de création (plus récent en premier)
        leads.sort((a, b) => b.assignedAt - a.assignedAt);
        console.log('📊 TOUS les leads récupérés:', leads.length, 'leads');
        console.log('   - Statuts présents:', [...new Set(leads.map(l => l.status))]);
        console.log('   - Sources présentes:', [...new Set(leads.map(l => l.source))]);
        setAssignedLeads(leads);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Erreur lors du chargement des leads:', error);
    }
  };

  const ensureUserDocument = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Créer le document utilisateur selon le schéma Firestore
        await setDoc(userDocRef, {
          email: user.email,
          phone: '',
          role: 'prospect', // Rôle par défaut
          permissions: [],
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          stripeCustomerId: ''
        });
      } else {
        // Mettre à jour lastLoginAt
        await setDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Erreur lors de la création/mise à jour du document utilisateur:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let errorMessage = 'Erreur de connexion';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail('');
      setPassword('');
      setCurrentScreen('dashboard');
      setSelectedContact(null);
      setShowNavigation(false);
      Alert.alert('Déconnexion', 'Vous êtes déconnecté');
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  const handleOpenNavigation = () => {
    setShowNavigation(true);
  };

  const handleCloseNavigation = () => {
    setShowNavigation(false);
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
    setShowNavigation(false);
  };

  const handleBackFromSettings = () => {
    setCurrentScreen('dashboard');
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setCurrentScreen('contact-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setSelectedContact(null);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleForgotPassword = () => {
    Alert.alert('Mot de passe oublié', 'Fonctionnalité à implémenter');
  };

  const handleBecomeArtisan = () => {
    Linking.openURL('https://portailhabitat.fr/devenir-artisan');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://portailhabitat.fr/politique-de-confidentialite');
  };

  const handleCallClient = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application téléphone');
        }
      })
      .catch((err) => Alert.alert('Erreur', 'Erreur lors de l\'ouverture du téléphone'));
  };

  const handleEmailClient = (email, clientName) => {
    const subject = encodeURIComponent(`Contact depuis Portail Habitat - ${clientName}`);
    const body = encodeURIComponent(`Bonjour ${clientName},\n\nJe vous contacte suite à votre demande sur Portail Habitat.\n\nCordialement`);
    const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(emailUrl);
        } else {
          Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application email');
        }
      })
      .catch((err) => Alert.alert('Erreur', 'Erreur lors de l\'ouverture de l\'email'));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (selectedContact && artisanData) {
        const leadDocRef = doc(db, 'artisans', artisanData.id, 'leads', selectedContact.id);
        await updateDoc(leadDocRef, {
          status: newStatus
        });
        
        // Mettre à jour l'état local
        setSelectedContact(prev => ({ ...prev, status: newStatus }));
        setShowStatusPicker(false);
        Alert.alert('Succès', 'Statut mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const getStatusOptions = () => {
    return [
      { value: 'new', label: 'Nouveau' },
      { value: 'contacted', label: 'Contacté' },
      { value: 'converted', label: 'Converti' },
      { value: 'lost', label: 'Perdu' }
    ];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('./assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (user) {
    if (showNavigation) {
      return (
        <View style={styles.navigationOverlay}>
          <TouchableOpacity 
            style={styles.navigationBackdrop} 
            onPress={handleCloseNavigation}
            activeOpacity={1}
          />
          <View style={styles.navigationMenu}>
            <View style={styles.navigationHeader}>
              <TouchableOpacity onPress={handleCloseNavigation}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.navigationContent}>
              <TouchableOpacity style={styles.navigationItem} onPress={handleOpenSettings}>
                <View style={styles.navigationItemContent}>
                  <Ionicons name="settings-outline" size={24} color="#333" />
                  <Text style={styles.navigationItemText}>Paramètres</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navigationItem} onPress={handleLogout}>
                <View style={styles.navigationItemContent}>
                  <MaterialIcons name="logout" size={24} color="#333" />
                  <Text style={styles.navigationItemText}>Se déconnecter</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <StatusBar style="auto" />
        </View>
      );
    }
    
    if (currentScreen === 'settings') {
      return (
        <ScrollView style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity onPress={handleBackFromSettings} style={styles.backButton}>
              <View style={styles.backButtonContent}>
                <Ionicons name="arrow-back" size={20} color="#2E86AB" />
                <Text style={styles.backButtonText}>Retour</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>Paramètres</Text>
            <View style={styles.headerSpacer} />
          </View>
          
          <View style={styles.settingsContent}>
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Compte</Text>
              
              <View style={styles.settingsItem}>
                <Text style={styles.settingsLabel}>Email</Text>
                <Text style={styles.settingsValue}>{user.email}</Text>
              </View>
              
              <TouchableOpacity style={styles.settingsButton}>
                <Text style={styles.settingsButtonText}>Changer le mot de passe</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Informations légales</Text>
              
              <TouchableOpacity style={styles.settingsButton} onPress={handlePrivacyPolicy}>
                <Text style={styles.settingsButtonText}>Politique de confidentialité</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <StatusBar style="auto" />
        </ScrollView>
      );
    }
    
    if (currentScreen === 'contact-detail' && selectedContact) {
      return (
        <>
          <ContactDetail 
            contact={selectedContact}
            onBackPress={handleBackToDashboard}
            formatDate={formatDate}
            formatTime={formatTime}
            showStatusPicker={showStatusPicker}
            setShowStatusPicker={setShowStatusPicker}
            getStatusOptions={getStatusOptions}
            handleStatusChange={handleStatusChange}
          />
          
          <ContactBottomNavigation 
            onEmailPress={() => handleEmailClient(selectedContact.clientEmail, selectedContact.clientName)}
            onCallPress={() => handleCallClient(selectedContact.clientPhone)}
          />
          
          <StatusBar style="auto" />
        </>
      );
    }
    
    return (
      <View style={styles.dashboardContainer}>
        <ScrollView style={styles.scrollableContent}>
          <Header onMenuPress={handleOpenNavigation} />
          
          <View style={styles.dashboardContent}>
            {activeTab === 'leads' ? (
              <View style={styles.section}>
                {assignedLeads.length > 0 ? (
                  assignedLeads.map((lead, index) => (
                    <LeadCard 
                      key={`lead-${lead.estimationId}-${lead.assignedAt?.getTime()}-${index}`}
                      lead={lead}
                      onViewPress={handleViewContact}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      index={index}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>Aucun lead assigné</Text>
                )}
              </View>
            ) : (
              <View style={styles.section}>
                {assignedLeads.filter(lead => lead.source === 'bought' || lead.source === 'priority').length > 0 ? (
                  assignedLeads.filter(lead => lead.source === 'bought' || lead.source === 'priority').map((lead, index) => (
                    <LeadCard 
                      key={`offer-${lead.estimationId}-${lead.assignedAt?.getTime()}-${index}`}
                      lead={lead}
                      onViewPress={handleViewContact}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      index={index}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>Aucun appel d'offre en attente</Text>
                )}
              </View>
            )}
          </View>
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
        
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <NavigationMenu 
          showNavigation={showNavigation}
          onClose={handleCloseNavigation}
          onLogout={handleLogout}
          onSettings={handleOpenSettings}
        />
        
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.logoContainer}>
        <Image 
          source={require('./assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>Bonjour Portail Habitat</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.artisanButton} onPress={handleBecomeArtisan}>
          <Text style={styles.artisanButtonText}>Pas encore artisan ?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrivacyPolicy}>
          <Text style={styles.privacyPolicyText}>Politique de confidentialité</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#2E86AB',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#2E86AB',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  artisanButton: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  artisanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyPolicyText: {
    color: '#2E86AB',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#2E86AB',
  },
  loggedInContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  menuIcon: {
    padding: 8,
  },
  navigationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  navigationBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  navigationMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationHeader: {
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'flex-end',
  },
  navigationContent: {
    padding: 20,
  },
  navigationItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navigationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationItemText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  headerSpacer: {
    width: 40,
  },
  settingsContent: {
    padding: 20,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 15,
  },
  settingsItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  settingsLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  settingsValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  settingsButton: {
    backgroundColor: '#2E86AB',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollableContent: {
    flex: 1,
  },
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
  dashboardContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginLeft: 10,
  },
  leadCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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
  },
  leadSector: {
    fontSize: 14,
    color: '#2E86AB',
    marginTop: 2,
  },
  leadLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  leadDateTime: {
    flexDirection: 'row',
    marginTop: 5,
  },
  leadDate: {
    fontSize: 12,
    color: '#888',
    marginRight: 10,
  },
  leadTime: {
    fontSize: 12,
    color: '#888',
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
  emptyText: {
    fontSize: 14,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E86AB',
    fontWeight: 'bold',
    marginLeft: 5,
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
  detailBottomSpacer: {
    height: 180,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
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
  bottomSpacer: {
    height: 80,
  },
});
