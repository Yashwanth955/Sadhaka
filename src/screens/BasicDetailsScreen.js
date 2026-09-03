import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  TextInput, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const SPORTS_LIST = [
  'Cricket',
  'Football',
  'Badminton',
  'Athletics',
  'Hockey',
  'Basketball',
  'Volleyball',
  'Kabaddi',
  'Kho-Kho',
  'Wrestling',
  'Boxing'
];

export default function BasicDetailsScreen({ navigation }) {
  const { currentUser, updateUserProfile } = useAuth();
  const [gender, setGender] = useState('male'); // 'male' (Boy) | 'female' (Girl)
  const [primarySport, setPrimarySport] = useState('Cricket');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!height || !weight) {
      Alert.alert('Required Details', 'Please enter your height and weight.');
      return;
    }

    setLoading(true);
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          gender,
          primarySport,
          height: Number(height),
          weight: Number(weight),
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Failed to save basic details:', err);
    }
    setLoading(false);
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* App Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#111816" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>Sadhaka</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContent}>
          <Text style={styles.mainTitle}>Athlete Profile</Text>
          <Text style={styles.subtitle}>Enter your details to configure personalized SAI benchmarks</Text>

          {/* 1. GENDER SELECTION (Boy / Girl) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity 
                style={[styles.genderCard, gender === 'male' && styles.genderCardActive]}
                onPress={() => setGender('male')}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="male" 
                  size={28} 
                  color={gender === 'male' ? '#111816' : '#61897c'} 
                />
                <Text style={[styles.genderCardText, gender === 'male' && styles.genderCardTextActive]}>
                  Boy / Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.genderCard, gender === 'female' && styles.genderCardActive]}
                onPress={() => setGender('female')}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="female" 
                  size={28} 
                  color={gender === 'female' ? '#111816' : '#61897c'} 
                />
                <Text style={[styles.genderCardText, gender === 'female' && styles.genderCardTextActive]}>
                  Girl / Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. SPORT SELECTION */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Primary Sport</Text>
            <TouchableOpacity 
              style={styles.selectBox}
              onPress={() => setShowSportPicker(!showSportPicker)}
              activeOpacity={0.8}
            >
              <Text style={styles.selectBoxText}>{primarySport || 'Select a sport'}</Text>
              <MaterialIcons name={showSportPicker ? "arrow-drop-up" : "arrow-drop-down"} size={26} color="#61897c" />
            </TouchableOpacity>

            {showSportPicker && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                  {SPORTS_LIST.map((sport) => (
                    <TouchableOpacity
                      key={sport}
                      style={[styles.dropdownItem, primarySport === sport && styles.dropdownItemActive]}
                      onPress={() => {
                        setPrimarySport(sport);
                        setShowSportPicker(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, primarySport === sport && styles.dropdownItemTextActive]}>
                        {sport}
                      </Text>
                      {primarySport === sport && (
                        <MaterialIcons name="check" size={18} color="#111816" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* 3. HEIGHT (CM) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="height" size={22} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your height (e.g. 165)"
                placeholderTextColor="#61897c"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* 4. WEIGHT (KG) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="fitness-center" size={20} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your weight (e.g. 58)"
                placeholderTextColor="#61897c"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity 
            style={[styles.nextButton, loading && styles.disabledButton]} 
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#111816" />
            ) : (
              <Text style={styles.nextButtonText}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    color: '#111816',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 44,
  },
  innerContent: {
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111816',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#61897c',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111816',
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f4f3',
    borderRadius: 14,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderCardActive: {
    backgroundColor: '#d8f9ed',
    borderColor: '#13eca4',
  },
  genderCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#61897c',
  },
  genderCardTextActive: {
    color: '#111816',
    fontWeight: '700',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f4f3',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
  },
  selectBoxText: {
    fontSize: 15,
    color: '#111816',
    fontWeight: '500',
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemActive: {
    backgroundColor: '#f0fdf9',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#4b5563',
  },
  dropdownItemTextActive: {
    color: '#111816',
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f3',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#111816',
  },
  nextButton: {
    backgroundColor: '#13eca4',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111816',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
