import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { color } from '../../utils/color/color';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Register = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation (optional but must be valid if provided)
    if (formData.phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and numbers';
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms and Conditions
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the Terms & Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

   const handleRegister = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      setTimeout(async () => {
        try {
          // Mock registration data
          const userData = {
            token: 'mock-jwt-token',
            email: formData.email,
            fullName: formData.fullName,
            userId: '67890'
          };
          
          // Save to AsyncStorage
          await AsyncStorage.setItem('userToken', userData.token);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          
          setIsLoading(false);
          
          // Clear form
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          setAcceptTerms(false);
          
          // Navigate to BottomTabNavigation
          navigation.replace('BottomTab');
          
        } catch (error) {
          setIsLoading(false);
          Alert.alert('Error', 'Registration failed. Please try again.');
        }
      }, 1500);
    }
  };

  const handleTermsPress = () => {
    Alert.alert(
      'Terms & Conditions',
      'By creating an account, you agree to our Terms of Service and Privacy Policy.',
      [
        { text: 'Read Terms', onPress: () => navigation.navigate('Terms') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      acceptTerms &&
      !isLoading
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join our community today</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formContainer}>
              {/* Full Name */}
              <InputField
                label="Full Name"
                placeholder="John Doe"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                iconName="person-outline"
                error={errors.fullName}
                autoCapitalize="words"
                returnKeyType="next"
              />

              {/* Email */}
              <InputField
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                iconName="mail-outline"
                error={errors.email}
                autoCapitalize="none"
                returnKeyType="next"
              />

              {/* Phone Number */}
              <InputField
                label="Phone Number (Optional)"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                iconName="call-outline"
                error={errors.phone}
                returnKeyType="next"
              />

              {/* Password */}
              <InputField
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={true}
                iconName="lock-closed-outline"
                error={errors.password}
                returnKeyType="next"
              />

              {/* Confirm Password */}
              <InputField
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={true}
                iconName="lock-closed-outline"
                error={errors.confirmPassword}
                returnKeyType="done"
              />

              {/* Terms & Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity 
                  style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink} onPress={handleTermsPress}>
                    Terms & Conditions
                  </Text>
                </Text>
              </View>
              {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

              {/* Register Button */}
              <CustomButton
                title={isLoading ? "Creating Account..." : "Create Account"}
                variant="primary"
                size="large"
                loading={isLoading}
                disabled={!isFormValid()}
                onPress={handleRegister}
                fullWidth
                style={styles.registerButton}
              />

              {/* Already have an account */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: color.textDisabled,
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: color.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 3,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: color.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: color.primary,
  },
  checkmark: {
    color: color.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  termsText: {
    fontSize: 14,
    color: color.textSecondary,
    flex: 1,
    flexWrap: 'wrap',
  },
  termsLink: {
    color: color.primary,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 34,
  },
  registerButton: {
    marginVertical: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#6b7280',
    fontSize: 15,
  },
  loginLink: {
    color: color.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});