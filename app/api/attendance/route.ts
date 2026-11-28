import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseRegistrations,
  updateSupabaseAttendance,
} from '@/lib/supabase-portal';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const registrations = await getSupabaseRegistrations(eventId || undefined);
    return NextResponse.json({ registrations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationNumber, status, notes, markedBy } = body;

    if (!registrationNumber || !status) {
      return NextResponse.json({ error: 'Registration number and status are required.' }, { status: 400 });
    }

    const success = await updateSupabaseAttendance(registrationNumber, {
      status,
      notes,
      markedBy: markedBy || 'Event Coordinator'
    });

    if (!success) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
