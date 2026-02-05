import { BASE_URL } from './baseUrl';
const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Main API client
const apiClient = {
  // GET request
  get: async (endpoint, params = {}) => {
    try {
      // Build URL with params
      let url = `${BASE_URL}${endpoint}`;
      
      // Add query params if any
      if (Object.keys(params).length > 0) {
        const queryString = Object.keys(params)
          .map(key => {
            if (params[key] !== undefined && params[key] !== null) {
              return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            }
            return null;
          })
          .filter(Boolean)
          .join('&');
        
        if (queryString) {
          url += `?${queryString}`;
        }
      }
      
      console.log('🌐 GET Request:', url);
      
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ GET Response:', { endpoint, data: data?.length || 'Object' });
      return data;
      
    } catch (error) {
      console.error('❌ GET Error:', error.message);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data = {}) => {
    try {
      const url = `${BASE_URL}${endpoint}`;
      console.log('🌐 POST Request:', url, data);
      
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ POST Response:', { endpoint, data: responseData });
      return responseData;
      
    } catch (error) {
      console.error('❌ POST Error:', error.message);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      const url = `${BASE_URL}${endpoint}`;
      console.log('🌐 PUT Request:', url, data);
      
      const response = await fetchWithTimeout(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      return responseData;
      
    } catch (error) {
      console.error('❌ PUT Error:', error.message);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const url = `${BASE_URL}${endpoint}`;
      console.log('🌐 DELETE Request:', url);
      
      const response = await fetchWithTimeout(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      return responseData;
      
    } catch (error) {
      console.error('❌ DELETE Error:', error.message);
      throw error;
    }
  },
};

export default apiClient;