import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { color } from '../utils/color/color';

const SearchBar = ({
  placeholder = 'Search events, categories...',
  value = '',
  onChangeText,
  onSearch,
  onFocus,
  onBlur,
  onClear,
  style,
  inputStyle,
  showCancelButton = false,
  autoFocus = false,
  debounceTime = 300,
  rounded = true,
  shadow = true,
  leftIcon = 'search-outline',
  rightIcon,
  showResults = false,
  recentSearches = [],
  onRecentSearchPress,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const debounceTimer = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onChangeText && inputValue !== value) {
        onChangeText(inputValue);
      }
    }, debounceTime);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, debounceTime]);

  // Sync with external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    if (showCancelButton) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 20,
      }).start();
    }
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (showCancelButton && !inputValue) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 150,
        friction: 20,
      }).start();
    }
    if (onBlur) onBlur();
  };

  const handleClear = () => {
    setInputValue('');
    if (onClear) onClear();
    if (onChangeText) onChangeText('');
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (onSearch) onSearch(inputValue);
  };

  const handleRecentSearchPress = (searchTerm) => {
    setInputValue(searchTerm);
    if (onRecentSearchPress) onRecentSearchPress(searchTerm);
    if (onChangeText) onChangeText(searchTerm);
  };

  const cancelButtonTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const cancelButtonOpacity = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.searchContainer,
        rounded && styles.rounded,
        shadow && styles.shadow,
        isFocused && styles.focused,
      ]}>
        {/* Left Icon */}
        <Icon
          name={leftIcon}
          size={20}
          color={isFocused ? color.primary : color.textDisabled}
          style={styles.searchIcon}
        />

        {/* Text Input */}
        <TextInput
          style={[styles.input, inputStyle]}
          value={inputValue}
          onChangeText={setInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={color.textDisabled}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          {...props}
        />

        {/* Right Icon (Clear or Custom) */}
        {inputValue ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close-circle" size={18} color={color.textDisabled} />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={handleSubmit} style={styles.rightButton}>
            <Icon name={rightIcon} size={20} color={color.textDisabled} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Cancel Button (Animated) */}
      {showCancelButton && (
        <Animated.View
          style={[
            styles.cancelButtonContainer,
            {
              transform: [{ translateX: cancelButtonTranslateX }],
              opacity: cancelButtonOpacity,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              handleClear();
              Keyboard.dismiss();
            }}
            style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Recent Searches Dropdown */}
      {showResults && isFocused && recentSearches.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Recent Searches</Text>
            <TouchableOpacity>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resultItem}
              onPress={() => handleRecentSearchPress(search)}
            >
              <Icon
                name="time-outline"
                size={18}
                color={color.textDisabled}
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>{search}</Text>
              <TouchableOpacity style={styles.removeButton}>
                <Icon name="close" size={16} color={color.textDisabled} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
  },
  rounded: {
    borderRadius: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  focused: {
    borderColor: color.primary,
    shadowColor: color.primary,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: color.textPrimary,
    padding: 0,
    margin: 0,
    height: Platform.OS === 'ios' ? 24 : 40,
    includeFontPadding: false,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  rightButton: {
    padding: 4,
    marginLeft: 8,
  },
  cancelButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: color.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: color.white,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 300,
    zIndex: 1000,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textPrimary,
  },
  clearAllText: {
    fontSize: 14,
    color: color.primary,
    fontWeight: '500',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  resultIcon: {
    marginRight: 12,
  },
  resultText: {
    flex: 1,
    fontSize: 15,
    color: color.textPrimary,
  },
  removeButton: {
    padding: 4,
  },
});