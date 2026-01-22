import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

// Note: Replace 'demo' with your actual OpenWeatherMap API key
// Get a free API key at: https://openweathermap.org/api

const createClient = () => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  })
}

// Geolocation - Get coordinates from user's browser
export const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => reject(error)
    )
  })
}

// Get city name from coordinates
export const getCityFromCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    })
    return response.data[0]?.name || 'Unknown'
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return 'Unknown'
  }
}

export const fetchWeatherData = async (city, units = 'metric') => {
  try {
    const client = createClient()
    const response = await client.get('/weather', {
      params: {
        q: city,
        units: units,
        appid: API_KEY,
      },
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`City "${city}" not found`)
    } else if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please set VITE_WEATHER_API_KEY')
    }
    throw new Error(error.message || 'Failed to fetch weather data')
  }
}

export const fetchForecastData = async (city, units = 'metric') => {
  try {
    const client = createClient()
    const response = await client.get('/forecast', {
      params: {
        q: city,
        units: units,
        appid: API_KEY,
      },
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`City "${city}" not found`)
    }
    throw new Error(error.message || 'Failed to fetch forecast data')
  }
}

// Air Quality Index
export const fetchAirQuality = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/air_quality`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    })
    return response.data
  } catch (error) {
    console.error('Air quality fetch error:', error)
    return null
  }
}

export const searchCities = async (query) => {
  if (!query || query.trim().length === 0) {
    return []
  }

  try {
    const client = createClient()
    const response = await client.get('/find', {
      params: {
        q: query,
        type: 'like',
        sort: 'population',
        cnt: 10,
        appid: API_KEY,
      },
    })
    
    // Return formatted city suggestions with country info
    return response.data.list
      .map(item => ({
        name: item.name,
        country: item.sys?.country,
        fullName: item.sys?.country ? `${item.name}, ${item.sys.country}` : item.name,
        lat: item.coord.lat,
        lon: item.coord.lon,
      }))
      .filter((city, index, self) =>
        index === self.findIndex(c => c.name === city.name && c.country === city.country)
      ) // Remove duplicates
      .slice(0, 10) // Limit to 10 results
  } catch (error) {
    console.error('City search error:', error)
    return []
  }
}

export const getWeatherIcon = (code) => {
  const iconMap = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '🌥️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌧️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️',
  }
  return iconMap[code] || '🌡️'
}
