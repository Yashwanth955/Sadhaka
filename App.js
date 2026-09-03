import React, { useEffect } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { 
  Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold 
} from '@expo-google-fonts/montserrat';
import { 
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold 
} from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';

import { initDb } from './src/services/localDb';
import { syncReferenceData } from './src/services/referenceDataSync';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import AthleteHomeDashboardScreen from './src/screens/AthleteHomeDashboardScreen';
import AthleteProfileScreen from './src/screens/AthleteProfileScreen';
import ChooseYourSportScreen from './src/screens/ChooseYourSportScreen';
import ChooseEventScreen from './src/screens/ChooseEventScreen';
import SportAssessmentsScreen from './src/screens/SportAssessmentsScreen';
import TestInstructionsScreen from './src/screens/TestInstructionsScreen';
import AILiveAssessmentScreen from './src/screens/AILiveAssessmentScreen';
import AssessmentResultsScreen from './src/screens/AssessmentResultsScreen';

import OnboardingCarouselScreen from './src/screens/OnboardingCarouselScreen';
import BasicDetailsScreen from './src/screens/BasicDetailsScreen';
import SportsRecommendationScreen from './src/screens/SportsRecommendationScreen';
import OverallProgressDashboardScreen from './src/screens/OverallProgressDashboardScreen';
import AssessmentHistoryScreen from './src/screens/AssessmentHistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // App Startup Wiring: Initialize SQLite & Refresh Reference Data from Firestore
  useEffect(() => {
    async function bootstrapDatabase() {
      try {
        await initDb();
        console.log('[App] SQLite database initialized successfully.');
        await syncReferenceData();
      } catch (err) {
        console.warn('[App] Startup database initialization warning:', err);
      }
    }

    bootstrapDatabase();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0041c8" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Main" component={AthleteHomeDashboardScreen} />
          <Stack.Screen name="Profile" component={AthleteProfileScreen} />
          <Stack.Screen name="ChooseSport" component={ChooseYourSportScreen} />
          <Stack.Screen name="ChooseEvent" component={ChooseEventScreen} />
          <Stack.Screen name="SportAssessments" component={SportAssessmentsScreen} />
          <Stack.Screen name="TestInstructions" component={TestInstructionsScreen} />
          <Stack.Screen name="AILiveAssessment" component={AILiveAssessmentScreen} />
          <Stack.Screen name="AssessmentResults" component={AssessmentResultsScreen} />
          <Stack.Screen name="OnboardingCarousel" component={OnboardingCarouselScreen} />
          <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} />
          <Stack.Screen name="SportsRecommendation" component={SportsRecommendationScreen} />
          <Stack.Screen name="OverallProgress" component={OverallProgressDashboardScreen} />
          <Stack.Screen name="OverallProgressDashboard" component={OverallProgressDashboardScreen} />
          <Stack.Screen name="AssessmentHistory" component={AssessmentHistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
