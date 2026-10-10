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
  const params = new URLSearchParams();
  if (state && state !== 'all') params.set('state', state);
  if (district && district !== 'all') params.set('district', district);
  if (mandi && mandi !== 'all') params.set('mandi', mandi);
  if (crop) params.set('crop', CROP_MAP[crop] || crop);

  const response = await fetch(`/api/mandi?${params.toString()}`, {
    cache: 'no-store',
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    throw new Error(json.message || `Mandi API request failed (${response.status})`);
  }

  const records = Array.isArray(json.data) ? json.data : [];
  return records.map((record, index) => {
    const rawCommodity = record.crop || record.commodity || '';
    const englishLower = rawCommodity.toLowerCase().trim();
    const hindiName = REVERSE_CROP_MAP[englishLower] || rawCommodity;
    return {
      id: record.id || record._id || `${rawCommodity}-${index}`,
      crop: hindiName,
      cropEnglish: rawCommodity,
      state: record.state || state || '',
      district: record.district || district || '',
      mandi: record.mandi || record.market || mandi || '',
      unit: record.unit || 'क्विंटल',
      minPrice: Number(record.minPrice ?? record.min_price) || 0,
      maxPrice: Number(record.maxPrice ?? record.max_price) || 0,
      modalPrice: Number(record.modalPrice ?? record.modal_price) || 0,
      arrivalDate: record.arrivalDate || record.arrival_date || null,
    };
  });
}

export async function getMandiPriceHistory({ state, district, mandi, crop }) {
  const records = await getDynamicMandiRates({ state, district, mandi, crop });
  return records
    .map((item) => ({
      date: item.arrivalDate || 'N/A',
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      modalPrice: item.modalPrice,
      crop: item.cropEnglish || item.crop,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}