import { NextResponse } from 'next/server';

const RESOURCE_ID =
  process.env.DATA_GOV_MANDI_RESOURCE_ID ||
  '9ef0be32-0771-470a-81cd-77b53a9efd6b';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const state = searchParams.get('state') || '';
    const district = searchParams.get('district') || '';
    const mandi = searchParams.get('mandi') || '';

    const apiUrl = new URL(
      `https://api.data.gov.in/resource/${RESOURCE_ID}`
    );

    apiUrl.searchParams.set(
      'api-key',
      process.env.DATA_GOV_API_KEY
    );

    apiUrl.searchParams.set('format', 'json');
    apiUrl.searchParams.set('limit', '100');

    if (state) apiUrl.searchParams.set('filters[state]', state);
    if (district) apiUrl.searchParams.set('filters[district]', district);

    if (mandi) {
      apiUrl.searchParams.set(
        'filters[market]',
        mandi
      );
    }

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error('Data.gov API error:', errorText);

      return NextResponse.json(
        {
          success: false,
          message: 'Mandi API request failed',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const records = data?.records || [];

    const rates = records.map((item, index) => ({
      id:
        item.id ||
        `${item.market}-${item.commodity}-${index}`,

      crop:
        item.commodity ||
        item.Commodity ||
        item.crop ||
        '',

      minPrice: Number(
        item.min_price ||
        item.Min_Price ||
        0
      ),

      maxPrice: Number(
        item.max_price ||
        item.Max_Price ||
        0
      ),

      modalPrice: Number(
        item.modal_price ||
        item.Modal_Price ||
        0
      ),

      unit: 'क्विंटल',

      state: item.state || state,

      district: item.district || district,

      mandi:
        item.market ||
        item.Market ||
        mandi,

      arrivalDate:
        item.arrival_date ||
        item.Arrival_Date ||
        null,
    }));

    return NextResponse.json({
      success: true,
      count: rates.length,
      data: rates,
      source: 'data.gov.in',
    });
  } catch (error) {
    console.error('Mandi API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to fetch mandi rates',
        data: [],
      },
      { status: 500 }
    );
  }
}