import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const winners = Store.getWinners(eventId || undefined);
    return NextResponse.json({ winners });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, position, registrationNumber, confirmedBy } = body;

    if (!eventId || !position || !registrationNumber) {
      return NextResponse.json({ error: 'Event, Position, and Registration Number are required.' }, { status: 400 });
    }

    const result = Store.confirmWinner({
      eventId,
      position,
      registrationNumber,
      confirmedBy: confirmedBy || 'Authorized Official'
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, winner: result.winner });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
