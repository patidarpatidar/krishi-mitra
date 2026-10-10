// services/weatherApi.js

export async function getNeemuchWeather(lat = 24.4722, lon = 74.8719) {
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