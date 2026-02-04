import { StyleSheet, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import LoginScreen from './screens/AuthScreens/LoginScreen'
// import RegisterScreen from './screens/AuthScreens/RegisterScreen'
// import ForgotPasswordScreen from './screens/AuthScreens/ForgotPasswordScreen'
import WelcomeScreen from '../../screens/AuthScreens/WelcomeScreen'
import BottomTabNavigation from '../BottomTabNavigation/BottomTabNavigation'

const Stack = createNativeStackNavigator()
const MainNavigation = () => {
  const isLoggedIn = false 

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen 
            name="BottomTab" 
            component={BottomTabNavigation} 
          />
        ) : (
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
            />
            {/* <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ 
                headerShown: true, 
                title: 'Login',
                headerBackTitle: 'Back' 
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ 
                headerShown: true, 
                title: 'Create Account',
                headerBackTitle: 'Back' 
              }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen} 
              options={{ 
                headerShown: true, 
                title: 'Reset Password',
                headerBackTitle: 'Back' 
              }}
            /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation

const styles = StyleSheet.create({})