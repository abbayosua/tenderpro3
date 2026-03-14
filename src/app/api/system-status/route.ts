import { NextResponse } from 'next/server';
import { getDatabaseStatus } from '@/lib/db-status';

export async function GET() {
  try {
    const isDatabaseAvailable = await getDatabaseStatus();
    
    return NextResponse.json({
      mode: isDatabaseAvailable ? 'database' : 'mock',
      isDatabaseAvailable,
      message: isDatabaseAvailable 
        ? 'Connected to database' 
        : 'Running in demo mode with mock data. Data is stored in memory.',
    });
  } catch (error) {
    console.error('Error checking system status:', error);
    return NextResponse.json({
      mode: 'mock',
      isDatabaseAvailable: false,
      message: 'Running in demo mode',
    });
  }
}
