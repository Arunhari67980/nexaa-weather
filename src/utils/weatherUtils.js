// Activity suggestions based on weather conditions
export const getActivitySuggestions = (weather, temp) => {
  const mainCondition = weather[0].main.toLowerCase()

  const activities = {
    sunny: ['🏃 Go for a run', '🚴 Ride your bike', '🏖️ Go to the beach', '⛳ Play golf', '🧗 Hiking', '🏀 Play sports'],
    cloudy: ['📚 Read a book', '🎬 Watch a movie', '🖼️ Visit a museum', '🎮 Gaming session', '🛍️ Shopping', '☕ Café time'],
    rainy: ['📖 Indoor reading', '🎮 Video games', '📺 Movie marathon', '🍳 Cook something', '🎨 Arts & crafts', '🧘 Meditation'],
    snow: ['⛷️ Skiing', '⛸️ Ice skating', '⛄ Build snowman', '🏂 Snowboarding', '🎿 Winter sports'],
    windy: ['🪁 Fly a kite', '🏄 Windsurfing', '🎣 Fishing', '🛶 Kayaking'],
    cold: ['☕ Hot chocolate', '🏋️ Gym', '🧖 Spa day', '🎭 Theater'],
    hot: ['🏊 Swimming', '🍦 Ice cream', '💨 Air-conditioned spots', '⛱️ Water parks'],
  }

  let suggestions = []

  if (mainCondition.includes('clear') || mainCondition.includes('sunny')) {
    suggestions = activities.sunny
  } else if (mainCondition.includes('cloud')) {
    suggestions = activities.cloudy
  } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
    suggestions = activities.rainy
  } else if (mainCondition.includes('snow')) {
    suggestions = activities.snow
  } else if (mainCondition.includes('wind')) {
    suggestions = activities.windy
  }

  if (temp < 0) {
    suggestions = [...suggestions, ...activities.cold]
  }
  if (temp > 30) {
    suggestions = [...suggestions, ...activities.hot]
  }

  return [...new Set(suggestions)].slice(0, 5)
}

// Outfit recommendations
export const getOutfitRecommendation = (temp, weather, humidity) => {
  const mainCondition = weather[0].main.toLowerCase()

  let outfit = {
    top: '',
    bottom: '',
    accessories: [],
    advice: '',
  }

  // Temperature-based recommendations
  if (temp < 0) {
    outfit.top = '🧥 Heavy winter coat'
    outfit.bottom = '🧤 Thermal pants + long underwear'
    outfit.accessories = ['🧣 Thick scarf', '🎩 Winter hat', '🧤 Gloves', '🥾 Insulated boots']
    outfit.advice = 'Bundle up! It\'s freezing outside.'
  } else if (temp < 10) {
    outfit.top = '🧥 Warm jacket'
    outfit.bottom = '👖 Jeans or thick pants'
    outfit.accessories = ['🧣 Light scarf', '🎩 Hat', '🧤 Gloves']
    outfit.advice = 'Wear layers, it\'s chilly!'
  } else if (temp < 15) {
    outfit.top = '🧥 Light jacket or sweater'
    outfit.bottom = '👖 Jeans or casual pants'
    outfit.accessories = ['🎩 Light hat (optional)']
    outfit.advice = 'A light jacket should do the trick.'
  } else if (temp < 20) {
    outfit.top = '👕 Long sleeve shirt'
    outfit.bottom = '👖 Jeans or pants'
    outfit.accessories = []
    outfit.advice = 'Perfect weather for a casual outfit.'
  } else if (temp < 25) {
    outfit.top = '👕 T-shirt'
    outfit.bottom = '👖 Shorts or light pants'
    outfit.accessories = ['🕶️ Sunglasses']
    outfit.advice = 'Nice and comfortable weather!'
  } else {
    outfit.top = '👕 Light t-shirt or tank'
    outfit.bottom = '🩱 Shorts or light dress'
    outfit.accessories = ['🕶️ Sunglasses', '🧢 Cap', '☂️ Umbrella (if rainy)']
    outfit.advice = 'It\'s hot! Wear light and breathable clothing.'
  }

  // Weather condition adjustments
  if (mainCondition.includes('rain')) {
    outfit.accessories.push('🌧️ Raincoat/Umbrella')
    outfit.advice += ' Don\'t forget your umbrella!'
  } else if (mainCondition.includes('snow')) {
    outfit.accessories = ['❄️ Snow boots', '🧤 Heavy gloves', '🧣 Thick scarf']
    outfit.advice = 'Prepare for snow!'
  }

  if (humidity > 80) {
    outfit.advice += ' It\'s humid, choose breathable fabrics!'
  }

  return outfit
}

// Air Quality Index interpretation
export const getAQILevel = (aqi) => {
  const levels = {
    1: { label: 'Good', color: 'green', icon: '✅' },
    2: { label: 'Fair', color: 'yellow', icon: '⚠️' },
    3: { label: 'Moderate', color: 'orange', icon: '⚠️' },
    4: { label: 'Poor', color: 'red', icon: '❌' },
    5: { label: 'Very Poor', color: 'purple', icon: '🚫' },
  }
  return levels[aqi] || levels[1]
}

// Wind direction from degrees
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Get wind direction emoji
export const getWindDirectionEmoji = (degrees) => {
  if (degrees >= 337.5 || degrees < 22.5) return '↓'  // N
  if (degrees >= 22.5 && degrees < 67.5) return '↙️'   // NE
  if (degrees >= 67.5 && degrees < 112.5) return '←'   // E
  if (degrees >= 112.5 && degrees < 157.5) return '↖️'  // SE
  if (degrees >= 157.5 && degrees < 202.5) return '↑'  // S
  if (degrees >= 202.5 && degrees < 247.5) return '↗️'  // SW
  if (degrees >= 247.5 && degrees < 292.5) return '→'  // W
  return '↘️'  // NW
}

// Export weather data as CSV
export const exportWeatherAsCSV = (data, city) => {
  const row = [
    city,
    new Date().toLocaleString(),
    Math.round(data.main.temp),
    data.main.feels_like,
    data.main.humidity,
    data.wind.speed,
    data.main.pressure,
    data.weather[0].description,
  ]
  
  const csv = 'City,Date/Time,Temperature,Feels Like,Humidity,Wind Speed,Pressure,Condition\n' +
    row.join(',')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `weather-${city}-${Date.now()}.csv`
  a.click()
}

// Share weather data
export const shareWeather = (city, temp, condition) => {
  const text = `Check out the weather in ${city}! It's ${temp}°C and ${condition}. #WeatherApp`
  
  if (navigator.share) {
    navigator.share({
      title: `Weather in ${city}`,
      text: text,
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(text)
    alert('Weather info copied to clipboard!')
  }
}

// Temperature trend analysis
export const analyzeTrend = (forecastList) => {
  if (forecastList.length < 2) return 'stable'
  
  const temps = forecastList.map(item => item.main.temp)
  const firstTemp = temps[0]
  const lastTemp = temps[temps.length - 1]
  const diff = lastTemp - firstTemp

  if (Math.abs(diff) < 1) return 'stable'
  return diff > 0 ? 'rising' : 'falling'
}

// Calculate feels like interpretation
export const getFeelsLikeDescription = (feelsLike, actual) => {
  const diff = feelsLike - actual
  if (Math.abs(diff) < 2) return 'feels about right'
  if (diff > 0) return `feels ${Math.round(diff)}° warmer`
  return `feels ${Math.round(Math.abs(diff))}° colder`
}
