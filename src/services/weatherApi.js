// services/weatherApi.js

export async function getNeemuchWeather(lat = 24.4722, lon = 74.8719) {
  return fetchWeather(lat, lon);
}

async function fetchWeather(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) {
    throw new Error(`Weather API request failed (${res.status})`);
  }

  const data = await res.json();
  if (!data.current || !data.daily) {
    throw new Error('Weather API response is missing forecast data.');
  }

  return {
    temperature: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    maxTemp: Math.round(data.daily.temperature_2m_max?.[0]),
    minTemp: Math.round(data.daily.temperature_2m_min?.[0]),
    rainProb: data.daily.precipitation_probability_max?.[0],
  };
}

function normalizePlaceName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-IN")
    .replace(/[^a-z0-9]/g, "");
}

export async function getLocationWeather(district, state) {
  if (!district?.trim()) {
    throw new Error("प्रोफाइल में पंजीकृत जिला दर्ज करें।");
  }

  const searchTerms = [
    [district, state, "India"].filter(Boolean).join(", "),
    [district, "India"].filter(Boolean).join(", "),
  ].filter(Boolean);
  let location = null;

  for (const searchTerm of searchTerms) {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=10&language=en&format=json`
    );
    if (!response.ok) continue;

    const result = await response.json();
    const matches = (result.results || []).filter(
      (item) => item.country_code === "IN"
    );
    const stateMatch = matches.find(
      (item) => normalizePlaceName(item.admin1) === normalizePlaceName(state)
    );
    const districtMatch = matches.find(
      (item) => normalizePlaceName(item.name) === normalizePlaceName(district)
    );
    location = stateMatch || districtMatch;

    if (location) break;
  }

  if (!location) {
    throw new Error("पंजीकृत जिले का मौसम स्थान नहीं मिला। प्रोफाइल में जिला जाँचें।");
  }

  return {
    ...(await fetchWeather(location.latitude, location.longitude)),
    locationName: [district, state].filter(Boolean).join(", "),
  };
}