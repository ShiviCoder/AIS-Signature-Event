import { StyleSheet, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { color } from '../../utils/color/color';


const Tab = createBottomTabNavigator()
const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline'
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline'
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

        },
        tabBarActiveTintColor: color.secondary, // Your app's primary color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
    </Tab.Navigator>
  )
}

export default BottomTabNavigation

const styles = StyleSheet.create({})