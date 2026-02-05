// src/api/eventsApi.js
import apiClient from './apiClient';

/**
 * FETCH EVENTS WITH FILTERS
 * SearchEvents screen ke liye main function
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Events ka data
 */
// src/api/eventsApi.js
export const fetchEvents = async (filters = {}) => {
  try {
    console.log('🔍 Fetching events with filters:', filters);
    
    // Prepare search parameters for YOUR backend
    const searchParams = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      sort: filters.sortBy || 'relevance',
    };

    // Add filters according to YOUR backend structure
    if (filters.query) searchParams.query = filters.query;
    if (filters.serviceType) searchParams.serviceId = filters.serviceType;
    if (filters.location) searchParams.city = filters.location;
    if (filters.budgetMin) searchParams.minBudget = filters.budgetMin;
    if (filters.budgetMax) searchParams.maxBudget = filters.budgetMax;
    if (filters.minRating) searchParams.rating = filters.minRating;
    if (filters.verifiedOnly) searchParams.verified = true;

    // ✅ CHANGE: Use POST /api/search instead of GET /api/events/search
    const response = await apiClient.post('/search', searchParams);
    
    console.log('✅ Search Response:', response);
    
    // Transform YOUR backend response to frontend format
    return {
      success: response.success || true,
      data: response.data?.results || response.results || [],
      total: response.data?.total || response.total || 0,
      message: response.message || 'Events fetched successfully'
    };
    
  } catch (error) {
    console.error('❌ Error fetching events:', error.message);
    return {
      success: false,
      data: getMockEvents(filters),
      total: 8,
      message: 'Using demo data'
    };
  }
};

/**
 * FETCH EVENT CATEGORIES
 * Categories dropdown ke liye
 * @returns {Promise} Categories ka array
 */
export const fetchCategories = async () => {
  try {
    console.log('📋 Fetching categories...');
    
    // Since your backend doesn't have /categories endpoint
    // Use mock data or create the endpoint in backend
    console.log('📱 Using default categories (backend endpoint not available)');
    return getDefaultCategories();
    
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    return getDefaultCategories();
  }
};

/**
 * FETCH SINGLE EVENT BY ID
 * Event detail screen ke liye
 * @param {string} eventId - Event ID
 * @returns {Promise} Single event ka data
 */
export const fetchEventById = async (eventId) => {
  try {
    console.log('🔍 Fetching event:', eventId);
    
    const response = await apiClient.get(`/events/${eventId}`);
    
    return {
      success: true,
      data: response.data || response,
      message: 'Event fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return {
      success: false,
      error: error.message,
      data: null,
      message: 'Failed to fetch event'
    };
  }
};

/**
 * SAVE EVENT TO FAVORITES
 * @param {string} eventId - Event ID
 * @returns {Promise} Response
 */
export const saveEvent = async (eventId) => {
  try {
    const response = await apiClient.post(`/events/${eventId}/save`);
    return {
      success: true,
      data: response.data || response,
      message: 'Event saved successfully'
    };
  } catch (error) {
    console.error('Error saving event:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to save event'
    };
  }
};

/**
 * REMOVE EVENT FROM FAVORITES
 * @param {string} eventId - Event ID
 * @returns {Promise} Response
 */
export const unsaveEvent = async (eventId) => {
  try {
    const response = await apiClient.delete(`/events/${eventId}/save`);
    return {
      success: true,
      data: response.data || response,
      message: 'Event removed from saved'
    };
  } catch (error) {
    console.error('Error unsaving event:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to remove event'
    };
  }
};

// ================== HELPER FUNCTIONS ==================

/**
 * MOCK EVENTS DATA (API unavailable hone par)
 */
const getMockEvents = (filters = {}) => {
  const mockEvents = [
    {
      _id: '1',
      name: 'Summer Music Festival 2024',
      category: 'Music',
      date: '2024-06-15',
      location: { city: 'Mumbai' },
      price: 1500,
      images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'],
      rating: 4.8,
      reviews: 120,
      attendees: 1200,
      isSaved: false,
      verified: true,
      distance: '2.5 km',
      description: 'Annual summer music festival featuring top artists',
      vendorName: 'Music Events Co.',
    },
    {
      _id: '2',
      name: 'Tech Innovation Summit',
      category: 'Tech',
      date: '2024-07-22',
      location: { city: 'Bangalore' },
      price: 3000,
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
      rating: 4.9,
      reviews: 85,
      attendees: 500,
      isSaved: true,
      verified: true,
      distance: '5.1 km',
      description: 'Technology and innovation conference',
      vendorName: 'Tech Hub India',
    },
    {
      _id: '3',
      name: 'Sarah & John Wedding',
      category: 'Wedding',
      date: '2024-08-05',
      location: { city: 'Delhi' },
      price: 500000,
      images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'],
      rating: 4.7,
      reviews: 45,
      attendees: 300,
      isSaved: false,
      verified: false,
      distance: '1.2 km',
      description: 'Beautiful wedding ceremony',
      vendorName: 'Perfect Weddings',
    },
    {
      _id: '4',
      name: 'Food & Wine Expo',
      category: 'Food',
      date: '2024-09-12',
      location: { city: 'Mumbai' },
      price: 800,
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
      rating: 4.6,
      reviews: 210,
      attendees: 800,
      isSaved: false,
      verified: true,
      distance: '3.7 km',
      description: 'Food and wine tasting event',
      vendorName: 'Foodie Events',
    },
    {
      _id: '5',
      name: 'Yoga Retreat Weekend',
      category: 'Wellness',
      date: '2024-10-18',
      location: { city: 'Goa' },
      price: 5000,
      images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'],
      rating: 4.9,
      reviews: 89,
      attendees: 100,
      isSaved: true,
      verified: true,
      distance: '8.5 km',
      description: 'Weekend yoga and meditation retreat',
      vendorName: 'Wellness Center',
    },
    {
      _id: '6',
      name: 'Startup Pitch Night',
      category: 'Business',
      date: '2024-11-25',
      location: { city: 'Bangalore' },
      price: 0,
      images: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800'],
      rating: 4.5,
      reviews: 56,
      attendees: 200,
      isSaved: false,
      verified: false,
      distance: '2.3 km',
      description: 'Startup pitching competition',
      vendorName: 'Startup India',
    },
    {
      _id: '7',
      name: 'Wedding Planner Conference',
      category: 'Wedding',
      date: '2024-12-10',
      location: { city: 'Delhi' },
      price: 2500,
      images: ['https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800'],
      rating: 4.8,
      reviews: 78,
      attendees: 150,
      isSaved: false,
      verified: true,
      distance: '4.2 km',
      description: 'Conference for wedding planners',
      vendorName: 'Wedding Professionals',
    },
    {
      _id: '8',
      name: 'Free Community Music Jam',
      category: 'Music',
      date: '2024-06-20',
      location: { city: 'Mumbai' },
      price: 0,
      images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'],
      rating: 4.3,
      reviews: 34,
      attendees: 80,
      isSaved: false,
      verified: false,
      distance: '1.8 km',
      description: 'Free community music event',
      vendorName: 'Local Artists Group',
    },
  ];

  // Apply filters to mock data
  let filtered = [...mockEvents];
  
  if (filters.category) {
    filtered = filtered.filter(event => 
      event.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  }
  
  if (filters.location) {
    filtered = filtered.filter(event => 
      event.location.city.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.budget && filters.budget.min >= 0) {
    filtered = filtered.filter(event => event.price >= filters.budget.min);
  }
  
  if (filters.budget && filters.budget.max > 0) {
    filtered = filtered.filter(event => event.price <= filters.budget.max);
  }
  
  if (filters.minRating && filters.minRating > 0) {
    filtered = filtered.filter(event => event.rating >= filters.minRating);
  }
  
  if (filters.verifiedOnly) {
    filtered = filtered.filter(event => event.verified);
  }
  
  return filtered;
};

/**
 * DEFAULT CATEGORIES (API unavailable hone par)
 */
const getDefaultCategories = () => {
  return [
    { id: '1', name: 'Wedding', icon: 'heart', color: '#FF69B4', count: 24 },
    { id: '2', name: 'Music', icon: 'musical-notes', color: '#FF6B6B', count: 18 },
    { id: '3', name: 'Business', icon: 'business', color: '#4ECDC4', count: 15 },
    { id: '4', name: 'Food', icon: 'restaurant', color: '#118AB2', count: 22 },
    { id: '5', name: 'Sports', icon: 'basketball', color: '#FF8C00', count: 12 },
    { id: '6', name: 'Education', icon: 'school', color: '#2E8B57', count: 8 },
    { id: '7', name: 'Wellness', icon: 'fitness', color: '#9370DB', count: 14 },
    { id: '8', name: 'Religious', icon: 'star', color: '#06D6A0', count: 9 },
  ];
};

/**
 * GET CATEGORY ICON BY NAME
 */
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'wedding': 'heart',
    'music': 'musical-notes',
    'business': 'business',
    'corporate': 'briefcase',
    'food': 'restaurant',
    'sports': 'basketball',
    'education': 'school',
    'wellness': 'fitness',
    'health': 'medkit',
    'religious': 'star',
    'cultural': 'flower',
    'entertainment': 'film',
    'technology': 'laptop',
    'art': 'palette',
    'fashion': 'shirt',
    'charity': 'hand-left',
    'conference': 'mic',
    'party': 'wine',
    'birthday': 'gift',
  };
  
  const lowerName = categoryName.toLowerCase();
  return iconMap[lowerName] || 'grid';
};

/**
 * GET CATEGORY COLOR BY NAME
 */
const getCategoryColor = (categoryName) => {
  const colorMap = {
    'wedding': '#FF69B4',
    'music': '#FF6B6B',
    'business': '#4ECDC4',
    'corporate': '#4ECDC4',
    'food': '#118AB2',
    'sports': '#FF8C00',
    'education': '#2E8B57',
    'wellness': '#9370DB',
    'health': '#9370DB',
    'religious': '#06D6A0',
    'cultural': '#06D6A0',
    'entertainment': '#FFD166',
    'technology': '#073B4C',
    'art': '#EF476F',
    'fashion': '#FF9A8B',
    'charity': '#7209B7',
    'conference': '#3A86FF',
    'party': '#FF006E',
    'birthday': '#FB5607',
  };
  
  const lowerName = categoryName.toLowerCase();
  return colorMap[lowerName] || '#6C757D';
};