import { StyleSheet, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../../screens/AuthScreens/WelcomeScreen'
import BottomTabNavigation from '../BottomTabNavigation/BottomTabNavigation'
import Login from '../../screens/AuthScreens/Login'
import Register from '../../screens/AuthScreens/Register'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from '../../utils/color/color'

const Stack = createNativeStackNavigator()

const MainNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
        {isLoggedIn ? (
          <Stack.Screen name="BottomTab" component={BottomTabNavigation}/>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name='Register' component={Register}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
  }
})