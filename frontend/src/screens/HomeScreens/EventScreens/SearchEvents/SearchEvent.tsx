import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Switch,
  ActivityIndicator,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchEvents, fetchCategories } from '../../../../config';
import SearchBar from '../../../../components/SearchBar'
import { color } from '../../../../utils/color/color';

const { width, height } = Dimensions.get('window');

const SearchEventsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [filters, setFilters] = useState({
    eventName: '',
    location: '',
    budget: { min: 0, max: 100000 },
    dateRange: {
      startDate: '',
      endDate: ''
    },
    minRating: 0,
    verifiedOnly: false,
    category: '',
    sortBy: 'relevance',
  });

  const [activeFilters, setActiveFilters] = useState([]);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load events
  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const result = await fetchEvents(filters);

      if (result.success) {
        const apiEvents = result.data;

        // Transform API data
        const transformedEvents = apiEvents.map(event => ({
          id: event._id || event.id,
          title: event.name || event.title,
          serviceType: event.serviceType || 'General',
          date: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Coming Soon',
          location: event.city || event.location?.city || 'Location not set',
          area: event.area || '',
          address: event.address || '',
          budget: event.pricing?.average || event.pricing?.min || 0,
          minPrice: event.pricing?.min || 0,
          maxPrice: event.pricing?.max || 0,
          image: event.featuredImage || event.image || 'https://via.placeholder.com/300x200',
          rating: event.rating || 0,
          reviewCount: event.reviewCount || 0,
          isSaved: false,
          isVerified: event.verified || false,
          distance: 'Nearby',
          description: event.description || '',
          vendorName: event.businessName || event.name || '',
          contact: event.contact || {},
          yearsInBusiness: event.yearsInBusiness || 0,
          totalBookings: event.totalBookings || 0,
          completedBookings: event.completedBookings || 0,
          responseTime: event.responseTime || '',
          responseRate: event.responseRate || 0,
          availability: event.availability || {},
          searchKeywords: event.searchKeywords || [],
          serviceAreas: event.serviceAreas || []
        }));

        setEvents(transformedEvents);
        setFilteredEvents(transformedEvents);
        setTotalEvents(result.total || transformedEvents.length);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents().then(() => setRefreshing(false));
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.serviceType.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase()) ||
        event.vendorName?.toLowerCase().includes(query.toLowerCase()) ||
        event.searchKeywords?.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredEvents(filtered);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));

    // Update active filters
    if (value && value !== '' && value !== 0 && value !== false) {
      if (!activeFilters.includes(key)) {
        setActiveFilters(prev => [...prev, key]);
      }
    } else {
      setActiveFilters(prev => prev.filter(item => item !== key));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      eventName: '',
      location: '',
      budget: { min: 0, max: 100000 },
      dateRange: { startDate: '', endDate: '' },
      minRating: 0,
      verifiedOnly: false,
      category: '',
      sortBy: 'relevance',
    });
    setActiveFilters([]);
    setSearchQuery('');
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setShowEventDetailModal(true);
  };

  const toggleSaveEvent = (eventId) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, isSaved: !event.isSaved } : event
      )
    );
    setFilteredEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, isSaved: !event.isSaved } : event
      )
    );
    
    // If this is the selected event, update it too
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => ({ ...prev, isSaved: !prev.isSaved }));
    }
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleEventPress(item)}
    >
      {/* Event Image */}
      <View style={styles.eventImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => toggleSaveEvent(item.id)}
        >
          <Icon
            name={item.isSaved ? "heart" : "heart-outline"}
            size={22}
            color={item.isSaved ? "#FF6B6B" : color.white}
          />
        </TouchableOpacity>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {item.serviceType.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

    

        {/* Price Tag */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>
            {item.minPrice === 0 ? 'FREE' : `₹${item.minPrice.toLocaleString()}`}
          </Text>
        </View>
      </View>

      {/* Event Info */}
      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviewCount})</Text>
          </View>
        </View>

        {/* Vendor Info */}
        {item.vendorName && (
          <View style={styles.vendorContainer}>
            <Icon name="business-outline" size={14} color={color.textDisabled} />
            <Text style={styles.vendorText} numberOfLines={1}>{item.vendorName}</Text>
          </View>
        )}

        {/* Location & Experience */}
        <View style={styles.eventMeta}>
          <View style={styles.metaItem}>
            <Icon name="location-outline" size={14} color={color.textDisabled} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.area ? `${item.area}, ${item.location}` : item.location}
            </Text>
          </View>
          {item.yearsInBusiness > 0 && (
            <View style={styles.metaItem}>
              <Icon name="briefcase-outline" size={14} color={color.textDisabled} />
              <Text style={styles.metaText}>{item.yearsInBusiness} yrs exp</Text>
            </View>
          )}
        </View>

        {/* Bookings & Response Rate */}
        <View style={styles.eventFooter}>
          {item.totalBookings > 0 && (
            <View style={styles.footerItem}>
              <Icon name="checkmark-done-outline" size={14} color={color.textDisabled} />
              <Text style={styles.footerText}>{item.totalBookings} bookings</Text>
            </View>
          )}
          {item.responseRate > 0 && (
            <View style={styles.footerItem}>
              <Icon name="time-outline" size={14} color={color.textDisabled} />
              <Text style={styles.footerText}>{item.responseRate}% response</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEventDetailModal}
      onRequestClose={() => setShowEventDetailModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.eventDetailModalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEventDetailModal(false)}>
              <Icon name="close" size={28} color={color.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={() => selectedEvent && toggleSaveEvent(selectedEvent.id)}
            >
              <Icon
                name={selectedEvent?.isSaved ? "heart" : "heart-outline"}
                size={26}
                color={selectedEvent?.isSaved ? "#FF6B6B" : color.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedEvent && (
              <>
                {/* Event Image */}
                <View style={styles.detailImageContainer}>
                  <Image
                    source={{ uri: selectedEvent.image }}
                    style={styles.detailImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <View style={styles.imageBadges}>
                      <View style={styles.detailCategoryBadge}>
                        <Text style={styles.detailCategoryBadgeText}>
                          {selectedEvent.serviceType.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                      {selectedEvent.isVerified && (
                        <View style={styles.detailVerifiedBadge}>
                          <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                          <Text style={styles.detailVerifiedBadgeText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.detailPriceTag}>
                      <Text style={styles.detailPriceText}>
                        ₹{selectedEvent.minPrice.toLocaleString()} - ₹{selectedEvent.maxPrice.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Event Info */}
                <View style={styles.detailInfoContainer}>
                  <Text style={styles.detailTitle}>{selectedEvent.title}</Text>
                  
                  {/* Rating & Reviews */}
                  <View style={styles.detailRatingContainer}>
                    <View style={styles.detailRating}>
                      <Icon name="star" size={18} color="#FFD700" />
                      <Text style={styles.detailRatingText}>{selectedEvent.rating}</Text>
                      <Text style={styles.detailReviewsText}>({selectedEvent.reviewCount} reviews)</Text>
                    </View>
                    <View style={styles.detailBookings}>
                      <Icon name="checkmark-done-outline" size={18} color={color.primary} />
                      <Text style={styles.detailBookingsText}>{selectedEvent.totalBookings} bookings</Text>
                    </View>
                  </View>

                  {/* Vendor Info */}
                  <View style={styles.detailVendorSection}>
                    <Icon name="business-outline" size={20} color={color.primary} />
                    <View style={styles.detailVendorInfo}>
                      <Text style={styles.detailVendorName}>{selectedEvent.vendorName}</Text>
                      <Text style={styles.detailExperience}>
                        <Icon name="briefcase-outline" size={14} color={color.textDisabled} />
                        {' '}{selectedEvent.yearsInBusiness} years experience
                      </Text>
                    </View>
                  </View>

                  {/* Location */}
                  <View style={styles.detailSection}>
                    <Icon name="location-outline" size={20} color={color.primary} />
                    <View style={styles.detailSectionContent}>
                      <Text style={styles.detailSectionTitle}>Location</Text>
                      <Text style={styles.detailSectionText}>
                        {selectedEvent.address || `${selectedEvent.area}, ${selectedEvent.location}`}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  {selectedEvent.description && (
                    <View style={styles.detailSection}>
                      <Icon name="document-text-outline" size={20} color={color.primary} />
                      <View style={styles.detailSectionContent}>
                        <Text style={styles.detailSectionTitle}>Description</Text>
                        <Text style={styles.detailSectionText}>{selectedEvent.description}</Text>
                      </View>
                    </View>
                  )}

                  {/* Contact Info */}
                  {selectedEvent.contact && (
                    <View style={styles.detailSection}>
                      <Icon name="call-outline" size={20} color={color.primary} />
                      <View style={styles.detailSectionContent}>
                        <Text style={styles.detailSectionTitle}>Contact Information</Text>
                        {selectedEvent.contact.phone && (
                          <Text style={styles.detailSectionText}>
                            📞 {selectedEvent.contact.phone}
                          </Text>
                        )}
                        {selectedEvent.contact.email && (
                          <Text style={styles.detailSectionText}>
                            ✉️ {selectedEvent.contact.email}
                          </Text>
                        )}
                        {selectedEvent.responseTime && (
                          <Text style={styles.detailResponseTime}>
                            <Icon name="time-outline" size={14} color={color.textDisabled} />
                            {' '}Response time: {selectedEvent.responseTime}
                          </Text>
                        )}
                        {selectedEvent.responseRate > 0 && (
                          <Text style={styles.detailResponseRate}>
                            <Icon name="stats-chart-outline" size={14} color={color.textDisabled} />
                            {' '}Response rate: {selectedEvent.responseRate}%
                          </Text>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Service Areas */}
                  {selectedEvent.serviceAreas && selectedEvent.serviceAreas.length > 0 && (
                    <View style={styles.detailSection}>
                      <Icon name="navigate-outline" size={20} color={color.primary} />
                      <View style={styles.detailSectionContent}>
                        <Text style={styles.detailSectionTitle}>Service Areas</Text>
                        <View style={styles.serviceAreasContainer}>
                          {selectedEvent.serviceAreas.map((area, index) => (
                            <View key={index} style={styles.serviceAreaTag}>
                              <Text style={styles.serviceAreaText}>{area}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Keywords */}
                  {selectedEvent.searchKeywords && selectedEvent.searchKeywords.length > 0 && (
                    <View style={styles.detailSection}>
                      <Icon name="pricetags-outline" size={20} color={color.primary} />
                      <View style={styles.detailSectionContent}>
                        <Text style={styles.detailSectionTitle}>Tags</Text>
                        <View style={styles.keywordsContainer}>
                          {selectedEvent.searchKeywords.map((keyword, index) => (
                            <View key={index} style={styles.keywordTag}>
                              <Text style={styles.keywordText}>{keyword}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.messageButton}>
              <Icon name="chatbubble-outline" size={20} color={color.white} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookButton}>
              <Icon name="calendar-outline" size={20} color={color.white} />
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={color.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Events</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search events, venues, categories..."
          value={searchQuery}
          onChangeText={handleSearch}
          showFilterButton={false}
          autoFocus
        />
      </View>

      {/* Filter Bar (Moved below search) */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter" size={20} color={color.primary} />
          <Text style={styles.filterButtonText}>Filters</Text>
          {activeFilters.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilters.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Icon name="swap-vertical" size={20} color={color.textPrimary} />
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllFilters}
          disabled={activeFilters.length === 0}
        >
          <Icon 
            name="close-circle-outline" 
            size={20} 
            color={activeFilters.length > 0 ? color.secondary : color.textDisabled} 
          />
          <Text style={[
            styles.clearButtonText,
            activeFilters.length === 0 && styles.clearButtonTextDisabled
          ]}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeFiltersContainer}
          contentContainerStyle={styles.activeFiltersContent}
        >
          {filters.category && (
            <View style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>{filters.category}</Text>
              <TouchableOpacity onPress={() => updateFilter('category', '')}>
                <Icon name="close" size={14} color={color.white} />
              </TouchableOpacity>
            </View>
          )}

          {filters.location && (
            <View style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>{filters.location}</Text>
              <TouchableOpacity onPress={() => updateFilter('location', '')}>
                <Icon name="close" size={14} color={color.white} />
              </TouchableOpacity>
            </View>
          )}

          {filters.budget.min > 0 || filters.budget.max < 100000 ? (
            <View style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>
                ₹{filters.budget.min.toLocaleString()} - ₹{filters.budget.max.toLocaleString()}
              </Text>
              <TouchableOpacity onPress={() => updateFilter('budget', { min: 0, max: 100000 })}>
                <Icon name="close" size={14} color={color.white} />
              </TouchableOpacity>
            </View>
          ) : null}

          {filters.minRating > 0 && (
            <View style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>{filters.minRating}+ Rating</Text>
              <TouchableOpacity onPress={() => updateFilter('minRating', 0)}>
                <Icon name="close" size={14} color={color.white} />
              </TouchableOpacity>
            </View>
          )}

          {filters.verifiedOnly && (
            <View style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>Verified</Text>
              <TouchableOpacity onPress={() => updateFilter('verifiedOnly', false)}>
                <Icon name="close" size={14} color={color.white} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'result' : 'results'}
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </Text>
      </View>

      {/* Events List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[color.primary]}
              tintColor={color.primary}
            />
          }
          ListFooterComponent={
            <View style={styles.listFooter}>
              <Text style={styles.totalResults}>
                Showing {filteredEvents.length} of {totalEvents} events
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={64} color={color.textDisabled} />
          <Text style={styles.emptyStateTitle}>No events found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your filters or search keywords
          </Text>
          <TouchableOpacity
            style={styles.resetFiltersButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.resetFiltersButtonText}>Reset All Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Event Detail Modal */}
      {renderEventDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.textSecondary,
  },
  headerPlaceholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: color.white,
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: color.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.primary,
    marginLeft: 6,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: color.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.white,
  },
  filterBadgeText: {
    color: color.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flex: 1,
    justifyContent: 'center',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textSecondary,
    marginLeft: 6,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flex: 1,
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.secondary,
    marginLeft: 6,
  },
  clearButtonTextDisabled: {
    color: color.textDisabled,
  },
  activeFiltersContainer: {
    backgroundColor: color.white,
    paddingVertical: 10,
  },
  activeFiltersContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterText: {
    color: color.white,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 6,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: color.white,
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  resultsCount: {
    fontSize: 14,
    color: color.textSecondary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: color.textDisabled,
    fontSize: 14,
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
  eventCard: {
    backgroundColor: color.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventImageContainer: {
    height: 180,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: color.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection : 'row'
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: color.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: color.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.white,
  },
  eventInfo: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFB800',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: color.textDisabled,
    marginLeft: 4,
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorText: {
    fontSize: 14,
    color: color.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  metaText: {
    fontSize: 13,
    color: color.textDisabled,
    marginLeft: 6,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: color.textDisabled,
    marginLeft: 6,
  },
  listFooter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  totalResults: {
    fontSize: 14,
    color: color.textDisabled,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: color.textDisabled,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  resetFiltersButton: {
    backgroundColor: color.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetFiltersButtonText: {
    color: color.white,
    fontSize: 14,
    fontWeight: '600',
  },
  // Event Detail Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  eventDetailModalContainer: {
    backgroundColor: color.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalSaveButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  detailImageContainer: {
    height: 250,
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
    padding: 16,
  },
  imageBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailCategoryBadge: {
    backgroundColor: color.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  detailCategoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: color.primary,
  },
  detailVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  detailVerifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 4,
  },
  detailPriceTag: {
    backgroundColor: color.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  detailPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.white,
  },
  detailInfoContainer: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.textSecondary,
    marginBottom: 12,
  },
  detailRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB800',
    marginLeft: 6,
  },
  detailReviewsText: {
    fontSize: 14,
    color: color.textDisabled,
    marginLeft: 6,
  },
  detailBookings: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailBookingsText: {
    fontSize: 14,
    color: color.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  detailVendorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailVendorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  detailVendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.textSecondary,
    marginBottom: 4,
  },
  detailExperience: {
    fontSize: 14,
    color: color.textDisabled,
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  detailSectionContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.textSecondary,
    marginBottom: 8,
  },
  detailSectionText: {
    fontSize: 14,
    color: color.textSecondary,
    lineHeight: 20,
  },
  detailResponseTime: {
    fontSize: 13,
    color: color.textDisabled,
    marginTop: 8,
  },
  detailResponseRate: {
    fontSize: 13,
    color: color.textDisabled,
    marginTop: 4,
  },
  serviceAreasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  serviceAreaTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceAreaText: {
    fontSize: 12,
    color: color.textSecondary,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  keywordTag: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 12,
    color: color.primary,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonText: {
    color: color.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    color: color.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchEventsScreen;