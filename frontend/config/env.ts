// Configuration management for different environments

interface Environment {
  API_BASE_URL: string;
  API_PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
}

// Default development configuration
const developmentConfig: Environment = {
  API_BASE_URL: 'http://localhost',
  API_PORT: 8000,
  NODE_ENV: 'development'
};

// Production configuration (can be overridden by environment variables)
const productionConfig: Environment = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost',
  API_PORT: Number(process.env.API_PORT) || 8000,
  NODE_ENV: 'production'
};

// Test configuration
const testConfig: Environment = {
  API_BASE_URL: 'http://localhost',
  API_PORT: 3001,
  NODE_ENV: 'test'
};

// Determine which config to use
const getConfig = (): Environment => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    default:
      return developmentConfig;
  }
};

// Export the configuration
export const ENV = getConfig();

// Utility to generate full API URL
export const getApiUrl = (path: string) => {
  const { API_BASE_URL, API_PORT } = ENV;
  return `${API_BASE_URL}:${API_PORT}${path}`;
}
