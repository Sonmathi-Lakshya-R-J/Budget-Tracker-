// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set auth token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove auth token
const removeToken = () => {
  localStorage.removeItem('token');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Unauthorized - redirect to login
      removeToken();
      window.location.reload();
      return null;
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // If not JSON, read as text to see what we got
      const text = await response.text();
      
      // Try to extract error message from HTML if possible
      let errorMessage = `Server returned ${contentType || 'non-JSON'} response`;
      if (response.status === 404) {
        errorMessage = `API endpoint not found: ${endpoint}`;
      } else if (response.status === 400) {
        errorMessage = 'Bad request. Please check your input data.';
      } else if (text.includes('error') || text.includes('Error')) {
        // Try to extract error from HTML
        const match = text.match(/<[^>]*>([^<]*error[^<]*)<\/[^>]*>/i);
        if (match) {
          errorMessage = match[1].trim();
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  signup: async (username, password, email) => {
    return await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, email })
    });
  },
  
  login: async (username, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  }
};

// Transactions API
export const transactionsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString();
    return await apiRequest(`/transactions${query ? `?${query}` : ''}`);
  },
  
  getById: async (id) => {
    return await apiRequest(`/transactions/${id}`);
  },
  
  create: async (transaction) => {
    return await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });
  },
  
  update: async (id, transaction) => {
    return await apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction)
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/transactions/${id}`, {
      method: 'DELETE'
    });
  },
  
  getSummary: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString();
    return await apiRequest(`/transactions/stats/summary${query ? `?${query}` : ''}`);
  },
  
  getCategories: async () => {
    return await apiRequest('/transactions/categories/list');
  }
};

// Budgets API
export const budgetsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
    
    const query = params.toString();
    return await apiRequest(`/budgets${query ? `?${query}` : ''}`);
  },
  
  getById: async (id) => {
    return await apiRequest(`/budgets/${id}`);
  },
  
  create: async (budget) => {
    return await apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget)
    });
  },
  
  update: async (id, budget) => {
    return await apiRequest(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget)
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/budgets/${id}`, {
      method: 'DELETE'
    });
  },
  
  getProgress: async (year, month) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    
    return await apiRequest(`/budgets/progress/current?${params.toString()}`);
  }
};

// Analytics API
export const analyticsAPI = {
  getMonthlyComparison: async (year) => {
    const params = year ? `?year=${year}` : '';
    return await apiRequest(`/analytics/monthly-comparison${params}`);
  },
  
  getCategoryExpenses: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString();
    return await apiRequest(`/analytics/category-expenses${query ? `?${query}` : ''}`);
  },
  
  getSpendingTrends: async (months = 6) => {
    return await apiRequest(`/analytics/spending-trends?months=${months}`);
  },
  
  getTopCategories: async (limit = 5, filters = {}) => {
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    return await apiRequest(`/analytics/top-categories?${params.toString()}`);
  }
};

// Reports API
export const reportsAPI = {
  exportCSV: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/reports/export/csv?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  },
  
  getMonthlyReport: async (year, month) => {
    return await apiRequest(`/reports/monthly?year=${year}&month=${month}`);
  },
  
  getYearlyReport: async (year) => {
    return await apiRequest(`/reports/yearly?year=${year}`);
  }
};

// Export token management functions
export { getToken, setToken, removeToken };

