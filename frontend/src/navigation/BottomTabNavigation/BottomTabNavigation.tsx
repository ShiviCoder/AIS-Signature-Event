import { StyleSheet, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { color } from '../../utils/color/color';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon

// Import your screens
// import HomeScreen from '../screens/HomeScreen';
// import EventsScreen from '../screens/EventsScreen';
// import CreateScreen from '../screens/CreateScreen';
// import NotificationsScreen from '../screens/NotificationsScreen';
// import ProfileScreen from '../screens/ProfileScreen';
import LandingScreen from '../../screens/HomeScreens/LandingScreens/LandingScreen';
import Notification from '../../screens/HomeScreens/NotificationScreens/Notification';
import Profile from '../../screens/HomeScreens/ProfileScreens/Profile';
import SearchEvent from '../../screens/HomeScreens/EventScreens/SearchEvents/SearchEvent';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Landing" // Set Landing as initial screen
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Landing') {
            iconName = focused ? 'compass' : 'compass-outline';
          }
          
          // Return the Icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: color.primary, // Changed to primary for better visibility
        tabBarInactiveTintColor: color.textDisabled,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: color.white,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 3,
        },
      })}
    >
      {/* Landing Tab */}
      <Tab.Screen 
        name="Landing" 
        component={LandingScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? 'compass' : 'compass-outline'} size={size} color={color} />
          ),
        }}
      />
      
      {/* Home Tab */}
      <Tab.Screen 
        name="Search" 
        component={SearchEvent}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      
      {/* Events Tab */}
      {/* <Tab.Screen 
        name="Events" 
        component={EventsScreen}
        options={{
          tabBarLabel: 'Events',
        }}
      /> */}
      
      {/* Create Tab - Optional: You might want this centered or styled differently */}
      {/* <Tab.Screen 
        name="Create" 
        component={CreateScreen}
        options={{
          tabBarLabel: 'Create',
        }}
      /> */}
      
      {/* Notifications Tab */}
      <Tab.Screen 
        name="Notifications" 
        component={Notification}
        options={{
          tabBarLabel: 'Notifications',
        }}
      />
      
      {/* Profile Tab */}
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation;

const styles = StyleSheet.create({})