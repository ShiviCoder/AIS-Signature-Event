// utils/fonts/fonts.js
import { Platform } from 'react-native';

export const fonts = {
  RobotoBold: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'Roboto-Bold',
  RobotoRegular: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto-Regular',
  RobotoMedium: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'Roboto-Medium',
};