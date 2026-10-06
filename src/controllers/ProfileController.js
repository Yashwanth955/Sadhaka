/**
 * MVC Controller: ProfileController
 * Manages athlete profile data, validation, BMI computations, and tier status.
 */

import { 
  getUserProfileFromDb, 
  upsertUserProfile, 
  MOCK_USER_ID, 
  MOCK_USER_PROFILE,
  DEFAULT_ATHLETE_AVATAR
} from '../models/UserModel';

export const ProfileController = {
  /**
   * Retrieves profile for given user ID.
   */
  async getProfile(userId) {
    if (!userId) return null;
    const profile = await getUserProfileFromDb(userId);
    if (!profile && userId === MOCK_USER_ID) {
      return MOCK_USER_PROFILE;
    }
    return profile;
  },

  /**
   * Updates user profile with validation and sanitization.
   */
  async updateProfile(userId, data) {
    if (!userId) throw new Error('User ID is required to update profile.');
    
    const errors = this.validateProfile(data);
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    const sanitized = {
      fullName: data.fullName?.trim() || data.name?.trim() || 'Athlete',
      name: data.fullName?.trim() || data.name?.trim() || 'Athlete',
      age: data.age !== undefined && data.age !== '' ? Number(data.age) : null,
      gender: data.gender || 'male',
      primarySport: data.primarySport || 'Cricket',
      height: data.height !== undefined && data.height !== '' ? Number(data.height) : null,
      weight: data.weight !== undefined && data.weight !== '' ? Number(data.weight) : null,
      photoURL: data.photoURL || null
    };

    await upsertUserProfile(userId, sanitized);
    return await this.getProfile(userId);
  },

  /**
   * Validates profile input fields.
   */
  validateProfile(data) {
    const errors = [];
    if (data.fullName !== undefined && (!data.fullName || data.fullName.trim().length < 2)) {
      errors.push('Full name must be at least 2 characters long.');
    }
    if (data.age !== undefined && data.age !== '' && data.age !== null) {
      const ageNum = Number(data.age);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
        errors.push('Age must be a valid number between 5 and 100.');
      }
    }
    if (data.height !== undefined && data.height !== '' && data.height !== null) {
      const heightNum = Number(data.height);
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 260) {
        errors.push('Height must be between 50 cm and 260 cm.');
      }
    }
    if (data.weight !== undefined && data.weight !== '' && data.weight !== null) {
      const weightNum = Number(data.weight);
      if (isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
        errors.push('Weight must be between 20 kg and 300 kg.');
      }
    }
    return errors;
  },

  /**
   * Calculates Body Mass Index (BMI).
   * Formula: weight (kg) / [height (m)]^2
   */
  calculateBmi(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 10) / 10;
  },

  /**
   * Determines BMI category label based on WHO / Indian health standards.
   */
  getBmiCategory(bmi, gender = 'male') {
    if (!bmi) return 'N/A';
    const isFemale = String(gender).toLowerCase() === 'female';
    if (isFemale) {
      if (bmi < 19) return 'Underweight';
      if (bmi <= 24) return 'Healthy';
      if (bmi <= 30) return 'Overweight';
      return 'Obese';
    } else {
      if (bmi < 20) return 'Underweight';
      if (bmi <= 25) return 'Healthy';
      if (bmi <= 30) return 'Overweight';
      return 'Obese';
    }
  },

  /**
   * Default avatar URL.
   */
  getDefaultAvatar() {
    return DEFAULT_ATHLETE_AVATAR;
  }
};
