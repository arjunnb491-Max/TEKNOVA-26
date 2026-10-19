import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const registrations = Store.getRegistrations(eventId || undefined);
    return NextResponse.json({ registrations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationNumber, status, day1, day2, notes, markedBy } = body;

    if (!registrationNumber || !status) {
      return NextResponse.json({ error: 'Registration number and status are required.' }, { status: 400 });
    }

    const success = Store.updateAttendance(registrationNumber, {
      status,
      day1,
      day2,
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
