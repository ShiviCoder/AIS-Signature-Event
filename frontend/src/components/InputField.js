import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {color} from '../utils/color/color';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  iconName,
  error = '',
  editable = true,
  onIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(!secureTextEntry);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [color.gray, color.primary]
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2]
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[
          styles.label,
          error && styles.labelError,
          isFocused && styles.labelFocused
        ]}>
          {label}
        </Text>
      )}
      
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            borderColor: borderColor,
            shadowOpacity: shadowOpacity,
          },
          error ? styles.inputContainerError : null,
          !editable && styles.inputContainerDisabled
        ]}
      >
        {iconName && (
          <Icon 
            name={iconName} 
            size={17} 
            color={isFocused ? color.primary : error ? color.error : color.gray} 
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            !iconName && { paddingLeft: 15 }, // Add padding if no icon
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.gray}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={color.primary}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={handleShowPassword}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <Icon 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={isFocused ? color.primary : color.gray} 
            />
          </TouchableOpacity>
        )}
        
        {onIconPress && iconName && !secureTextEntry && (
          <TouchableOpacity 
            onPress={onIconPress} 
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <Icon 
              name={iconName} 
              size={20} 
              color={isFocused ? color.primary : color.gray} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={14} color={color.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textSecondary,
    marginBottom: 8,
    fontFamily: 'System',
  },
  labelFocused: {
    color: color.primary,
  },
  labelError: {
    color: color.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: color.white,
    paddingHorizontal: 16,
    height: 40,
    shadowColor: color.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  inputContainerError: {
    borderColor: color.error,
    shadowColor: color.error,
  },
  inputContainerDisabled: {
    backgroundColor: `${color.gray}20`,
    borderColor: `${color.gray}40`,
    opacity: 0.7,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: color.textSecondary,
    height: '100%',
    fontFamily: 'System',
    fontWeight: '500',
    alignItems: 'center',
    justifyContent : 'center'
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: color.error,
    marginLeft: 6,
    fontFamily: 'System',
    fontWeight: '500',
  },
});

export default InputField;