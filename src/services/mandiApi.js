import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || 'Madhya Pradesh';
  const district = searchParams.get('district') || 'Neemuch';
  const mandi = searchParams.get('mandi') || 'Neemuch';

  const API_KEY = process.env.DATA_GOV_IN_API_KEY;
  const RESOURCE_ID = '9ef74138-d401-4350-9842-88f57f4955b2'; // Agmarknet dataset resource ID

  if (!API_KEY) {
    return NextResponse.json(
      { success: false, message: 'API key is missing in environment variables.' },
      { status: 500 }
    );
  }

  try {
    const endpoint = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=100&filters[state]=${encodeURIComponent(
      state
    )}&filters[district]=${encodeURIComponent(district)}&filters[market]=${encodeURIComponent(mandi)}`;

    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Government API response error: ${response.status}`);
    }

    const json = await response.json();
    const records = json.records || [];

    // Map government API keys to match your React UI model
    const formattedRates = records.map((record, index) => ({
      id: record.id || `${record.commodity}-${index}`,
      crop: record.commodity || record.commodity_name || 'अनजान',
      unit: 'क्विंटल', // Agmarknet prices are in ₹ per Quintal
      minPrice: Number(record.min_price) || 0,
      maxPrice: Number(record.max_price) || 0,
      modalPrice: Number(record.modal_price) || 0,
      arrivalDate: record.arrival_date || '',
    }));

    return NextResponse.json({
      success: true,
      data: formattedRates,
    });
  } catch (error) {
    console.error('Mandi API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch live mandi rates.' },
      { status: 500 }
    );
  }
}