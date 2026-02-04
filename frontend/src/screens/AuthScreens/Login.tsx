import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { color } from '../../utils/color/color'

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.loginContainer}>
      
     </View>
    </SafeAreaView>
  )
}

export default Login
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
      },
})