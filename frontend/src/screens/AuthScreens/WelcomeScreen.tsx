import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { color } from '../../utils/color/color'
import { fonts } from '../../utils/fonts/fonts';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.patternCircle1} />
        <View style={styles.patternCircle2} />
        <View style={styles.patternCircle3} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>

        {/* Welcome Illustration/Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            {/* You can add an image or icon here */}
          </View>
        </View>

        <View>
          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>FIND EVENTS IN ONE PLACE.</Text>
            <Text style={styles.subtitleText}>
              Discover exciting events happening near you invite others to join.
            </Text>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={()=>navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Let's get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  patternCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFE8F0',
    top: -50,
    left: -50,
  },
  patternCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E8F4FF',
    top: '30%',
    right: -40,
  },
  patternCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF',
    bottom: '20%',
    left: '20%',
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: color.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontFamily: fonts.RobotoBold,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: fonts.RobotoBold,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    backgroundColor: color.secondary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: color.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: color.text,
    fontSize: 18,
    fontFamily: fonts.RobotoBold,
    textAlign: 'center',
  },
})