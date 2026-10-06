import React, { useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
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
import { View, Text, ActivityIndicator } from 'react-native';

import { initDb, inspectLocalDb } from './src/models';
import { syncReferenceData } from './src/services/referenceDataSync';

// MVC Views - Screens
import {
  LoginScreen,
  SignUpScreen,
  AthleteHomeDashboardScreen,
  AthleteProfileScreen,
  ChooseYourSportScreen,
  ChooseEventScreen,
  SportAssessmentsScreen,
  TestInstructionsScreen,
  AssessmentResultsScreen,
  OnboardingCarouselScreen,
  BasicDetailsScreen,
  SportsRecommendationScreen,
  OverallProgressDashboardScreen,
  AssessmentHistoryScreen,
  EditProfileScreen
} from './src/views/screens';

// Import Platform for web detection
import { Platform } from 'react-native';

// Lazy: MediaPipe/VisionCamera native modules only exist in an EAS/dev-client build
const CameraScreen = lazy(() => import('./src/screens/CameraScreen').catch(() => null));

const Stack = createNativeStackNavigator();

function CameraScreenRoute(props) {
  // Show web-incompatible message when running on web
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F19' }}>
        <Text style={{ color: '#FFFFFF', textAlign: 'center', padding: 20 }}>
          Camera functionality is not available on web browsers.\n\n
          Please use the mobile app for pose detection features.
        </Text>
      </View>
    );
  }

  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F19' }}>
          <ActivityIndicator size="large" color="#06B6D4" />
        </View>
      }
    >
      <CameraScreen {...props} />
    </Suspense>
  );
}

function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#0041c8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={currentUser ? "Main" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={AthleteHomeDashboardScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="Profile" component={AthleteProfileScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="ChooseSport" component={ChooseYourSportScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="ChooseEvent" component={ChooseEventScreen} />
        <Stack.Screen name="SportAssessments" component={SportAssessmentsScreen} />
        <Stack.Screen name="TestInstructions" component={TestInstructionsScreen} />
        <Stack.Screen
          name="Camera"
          component={CameraScreenRoute}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="AssessmentResults" component={AssessmentResultsScreen} />
        <Stack.Screen name="OnboardingCarousel" component={OnboardingCarouselScreen} />
        <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} />
        <Stack.Screen name="SportsRecommendation" component={SportsRecommendationScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="OverallProgress" component={OverallProgressDashboardScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="OverallProgressDashboard" component={OverallProgressDashboardScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="AssessmentHistory" component={AssessmentHistoryScreen} options={{ animation: 'none' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
        await inspectLocalDb();
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
      <AppNavigator />
    </AuthProvider>
  );
}
