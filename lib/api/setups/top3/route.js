import { NextResponse } from 'next/server';
import { getTopSetups } from '@/lib/setupService';

export async function GET() {
  try {
    const topSetups = await getTopSetups(3); // Haal 3 beste setups
    return NextResponse.json(topSetups);
  } catch (error) {
    console.error('❌ Fout bij ophalen top setups:', error);
    return NextResponse.json({ error: 'Top setups ophalen mislukt' }, { status: 500 });
  }
}
