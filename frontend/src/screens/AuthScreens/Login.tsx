import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  TouchableOpacity,
  Image 
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { color } from '../../utils/color/color';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const handleLogin = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(async () => {
        try {
          // Mock user data - replace with actual API response
          const userData = {
            token: 'mock-jwt-token',
            email: email,
            userId: '12345',
            name: 'John Doe'
          };
          
          // Save to AsyncStorage
          await AsyncStorage.setItem('userToken', userData.token);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          
          setIsLoading(false);
          
          // Navigate to BottomTabNavigation
          navigation.replace('BottomTab');
          
        } catch (error) {
          setIsLoading(false);
          Alert.alert('Error', 'Failed to login. Please try again.');
        }
      }, 1500);
    }
  };
  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'We will send a password reset link to your registered email.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Link', onPress: () => {
          Alert.alert('📧 Link Sent', 'Check your email for the reset link.');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Sign in to access your account</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Form */}
            <View style={styles.formContainer}>
              <InputField
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                iconName="mail-outline"
                error={errors.email}
                autoCapitalize="none"
              />

              <InputField
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                iconName="lock-closed-outline"
                error={errors.password}
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity>
                <CustomButton
                title={isLoading ? "Authenticating..." : "Sign In"}
                variant="primary"
                size="large"
                loading={isLoading}
                disabled={!email || !password || isLoading}
                onPress={handleLogin}
                fullWidth
                style={styles.loginButton}
              />
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <View style={styles.signUpLinkContainer}>
                    <Text style={styles.signUpLink}>Register Now</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

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
    justifyContent : 'center',
    alignItems : 'center'
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 8,
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
  },
  formContainer: {
    marginTop: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: color.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: color.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: color.textSecondary,
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: color.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: color.white,
    borderColor: '#e5e7eb',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  facebookButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: color.white,
    marginLeft: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
  },
  signUpText: {
    color: '#6b7280',
    fontSize: 15,
  },
  signUpLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpLink: {
    color: color.primary,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 4,
  },
  appInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },
  appInfoText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
});