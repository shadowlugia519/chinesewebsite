const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const highlightCurrentNav = () => {
  if (!menu) return;
  const current = window.location.pathname.split('/').pop() || 'index.html';
  menu.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('is-active', href === current);
  });
};

highlightCurrentNav();

const initPhillyMap = () => {
  const mapElement = document.getElementById('philly-map');
  if (!mapElement || typeof window.L === 'undefined') return;

  const map = L.map(mapElement);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const locations = [
    { name: 'UPenn Williams Hall', lat: 39.9523, lng: -75.1933 },
    { name: 'Philadelphia International Airport (PHL)', lat: 39.8744, lng: -75.2424 },
    { name: 'Reading Terminal Market', lat: 39.9534, lng: -75.1599 }
  ];

  const bounds = L.latLngBounds([]);
  locations.forEach((location) => {
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(location.name);
    bounds.extend([location.lat, location.lng]);
  });

  map.fitBounds(bounds, { padding: [28, 28] });
};

initPhillyMap();

const initTransportMailMap = () => {
  const mapElement = document.getElementById('transport-mail-map');
  if (!mapElement || typeof window.L === 'undefined') return;

  const map = L.map(mapElement);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const locations = [
    { name: 'UPenn Williams Hall', lat: 39.9523, lng: -75.1933 },
    { name: '30th Street Station', lat: 39.9556, lng: -75.181 },
    { name: 'Philadelphia International Airport (PHL)', lat: 39.8744, lng: -75.2424 },
    { name: 'Reading Terminal Market', lat: 39.9534, lng: -75.1599 },
    { name: 'SEPTA University City Station', lat: 39.9487, lng: -75.1906 },
    { name: 'SEPTA 30th Street Station (MFL/Trolley)', lat: 39.9551, lng: -75.1833 },
    { name: 'SEPTA 40th Street Station', lat: 39.9617, lng: -75.2018 },
    { name: 'UPS Store (University City)', lat: 39.9536, lng: -75.1972 }
  ];

  const bounds = L.latLngBounds([]);
  locations.forEach((location) => {
    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup(location.name);
    bounds.extend([location.lat, location.lng]);
  });

  map.fitBounds(bounds, { padding: [28, 28] });
};

initTransportMailMap();

const initLivingFoodMap = async () => {
  const mapElement = document.getElementById('living-food-map');
  if (!mapElement || typeof window.L === 'undefined') return;

  const map = L.map(mapElement).setView([39.9522, -75.1932], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const restaurants = [
    {
      name: 'Mali 奶茶（茉莉奶白）',
      query: 'Mali Tea University City Philadelphia',
      fallback: [39.9554, -75.1974]
    },
    {
      name: '南翔小笼包',
      query: 'Nan Xiang Xiao Long Bao University City Philadelphia',
      fallback: [39.9548, -75.1948]
    },
    {
      name: 'Han Dynasty',
      query: 'Han Dynasty University City Philadelphia',
      fallback: [39.9572, -75.1994]
    },
    {
      name: 'Sang Kee Noodle House',
      query: 'Sang Kee Noodle House University City Philadelphia',
      fallback: [39.9543, -75.1941]
    },
    {
      name: 'Louie Louie',
      query: 'Louie Louie Philadelphia University City',
      fallback: [39.9527, -75.1951]
    },
    {
      name: 'Distrito',
      query: 'Distrito Philadelphia University City',
      fallback: [39.9549, -75.2025]
    },
    {
      name: 'White Dog Cafe',
      query: 'White Dog Cafe University City Philadelphia',
      fallback: [39.9529, -75.1928]
    },
    {
      name: 'Manakeesh Cafe Bakery',
      query: 'Manakeesh Cafe Bakery Philadelphia',
      fallback: [39.954, -75.2051]
    }
  ];

  const getCoords = async (item) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(item.query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('geocode failed');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return [Number(data[0].lat), Number(data[0].lon)];
      }
    } catch (error) {
      return item.fallback;
    }
    return item.fallback;
  };

  const bounds = L.latLngBounds([]);
  for (const item of restaurants) {
    const coords = await getCoords(item);
    L.marker(coords).addTo(map).bindPopup(item.name);
    bounds.extend(coords);
  }

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [28, 28] });
  }
};

initLivingFoodMap();

const initLivingMarketMap = async () => {
  const mapElement = document.getElementById('living-market-map');
  if (!mapElement || typeof window.L === 'undefined') return;

  const map = L.map(mapElement).setView([39.953, -75.193], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markets = [
    {
      name: 'Heirloom Market',
      query: 'Heirloom Market Philadelphia University City',
      fallback: [39.9538, -75.1919]
    },
    {
      name: 'ACME Markets',
      query: 'ACME Markets University City Philadelphia',
      fallback: [39.9507, -75.2001]
    }
  ];

  const getCoords = async (item) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(item.query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('geocode failed');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return [Number(data[0].lat), Number(data[0].lon)];
      }
    } catch (error) {
      return item.fallback;
    }
    return item.fallback;
  };

  const bounds = L.latLngBounds([]);
  for (const item of markets) {
    const coords = await getCoords(item);
    L.marker(coords).addTo(map).bindPopup(item.name);
    bounds.extend(coords);
  }

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [28, 28] });
  }
};

initLivingMarketMap();

const weatherCodeToLabel = (code) => {
  const map = {
    0: { text: '晴', icon: '☀️' },
    1: { text: '大部晴朗', icon: '🌤️' },
    2: { text: '部分多云', icon: '⛅' },
    3: { text: '多云', icon: '☁️' },
    45: { text: '有雾', icon: '🌫️' },
    48: { text: '雾凇', icon: '🌫️' },
    51: { text: '小毛毛雨', icon: '🌦️' },
    53: { text: '毛毛雨', icon: '🌦️' },
    55: { text: '强毛毛雨', icon: '🌧️' },
    61: { text: '小雨', icon: '🌧️' },
    63: { text: '中雨', icon: '🌧️' },
    65: { text: '大雨', icon: '🌧️' },
    71: { text: '小雪', icon: '🌨️' },
    73: { text: '中雪', icon: '🌨️' },
    75: { text: '大雪', icon: '❄️' },
    80: { text: '阵雨', icon: '🌦️' },
    81: { text: '阵雨偏强', icon: '🌧️' },
    82: { text: '强阵雨', icon: '⛈️' },
    95: { text: '雷暴', icon: '⛈️' }
  };
  return map[code] || { text: '天气变化', icon: '🌡️' };
};

const initWeatherWidget = async () => {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=39.9526&longitude=-75.1652&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=7';

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('weather fetch failed');
    const data = await response.json();
    const daily = data.daily;
    if (!daily || !daily.time) throw new Error('weather format invalid');

    const dayFormatter = new Intl.DateTimeFormat('zh-CN', { weekday: 'short' });
    const html = daily.time.map((day, idx) => {
      const dayName = dayFormatter.format(new Date(`${day}T12:00:00`));
      const code = daily.weather_code[idx];
      const label = weatherCodeToLabel(code);
      const high = Math.round(daily.temperature_2m_max[idx]);
      const low = Math.round(daily.temperature_2m_min[idx]);
      return `
        <div class="weather-day">
          <div class="weather-day-name">${dayName}</div>
          <div class="weather-icon" aria-hidden="true">${label.icon}</div>
          <div class="weather-temps">${high}° / ${low}°F</div>
          <div class="weather-desc">${label.text}</div>
        </div>
      `;
    }).join('');

    widget.innerHTML = `<div class="weather-grid">${html}</div>`;
  } catch (error) {
    widget.innerHTML = '<div class="weather-error">天气加载失败，请稍后刷新页面重试。</div>';
  }
};

initWeatherWidget();
