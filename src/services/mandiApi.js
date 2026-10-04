export const CROP_MAP = {
  'लहसुन': 'Garlic',
  'गेहूं': 'Wheat',
  'सोयाबीन': 'Soyabean',
  'प्याज': 'Onion',
  'सरसों': 'Mustard',
  'धनिया': 'Coriander',
};

const REVERSE_CROP_MAP = {
  'garlic': 'लहसुन',
  'wheat': 'गेहूं',
  'soyabean': 'सोयाबीन',
  'onion': 'प्याज',
  'mustard': 'सरसों',
  'coriander': 'धनिया',
};

export async function getDynamicMandiRates({ state, district, mandi, crop }) {
  try {
    const params = new URLSearchParams();
    if (state && state !== 'all') params.append('state', state);
    if (district && district !== 'all') params.append('district', district);
    if (mandi && mandi !== 'all') params.append('market', mandi);
    
    if (crop) {
      const englishCrop = CROP_MAP[crop] || crop;
      params.append('commodity', englishCrop);
    }

    const response = await fetch(`https://mandi-api.onrender.com/v1/prices?${params.toString()}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const json = await response.json();
    const rawData = Array.isArray(json) ? json : json.data || json.records || [];

    return rawData.map((record, index) => {
      const rawCommodity = record.commodity || record.crop || record.commodity_name || 'अनजान';
      const englishLower = rawCommodity.toLowerCase().trim();
      const hindiName = REVERSE_CROP_MAP[englishLower] || rawCommodity;

      return {
        id: record.id || record._id || `${rawCommodity}-${index}`,
        crop: hindiName,
        cropEnglish: rawCommodity,
        state: record.state || state || '',
        district: record.district || district || '',
        mandi: record.market || record.mandi || mandi || '',
        unit: record.unit || 'क्विंटल',
        minPrice: Number(record.min_price || record.minPrice) || 0,
        maxPrice: Number(record.max_price || record.maxPrice) || 0,
        modalPrice: Number(record.modal_price || record.modalPrice) || 0,
        arrivalDate: record.arrival_date || record.date || new Date().toISOString().split('T')[0],
      };
    });
  } catch (error) {
    console.error('Failed to fetch mandi rates:', error);
    return [];
  }
}

export async function getMandiPriceHistory({ state, district, mandi, crop }) {
  try {
    const params = new URLSearchParams();
    if (state && state !== 'all') params.append('state', state);
    if (district && district !== 'all') params.append('district', district);
    if (mandi && mandi !== 'all') params.append('market', mandi);
    
    if (crop) {
      const englishCrop = CROP_MAP[crop] || crop;
      params.append('commodity', englishCrop);
    }

    const response = await fetch(`https://mandi-api.onrender.com/v1/prices?${params.toString()}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const json = await response.json();
    const rawData = Array.isArray(json) ? json : json.data || json.records || [];

    return rawData
      .map((item) => ({
        date: item.arrival_date || item.date || 'N/A',
        minPrice: Number(item.min_price || item.minPrice) || 0,
        maxPrice: Number(item.max_price || item.maxPrice) || 0,
        modalPrice: Number(item.modal_price || item.modalPrice) || 0,
        crop: item.commodity || item.crop || 'फसल',
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Failed to fetch price history:', error);
    return [];
  }
}