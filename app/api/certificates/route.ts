import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const certificates = Store.getCertificates(eventId || undefined);
    return NextResponse.json({ certificates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, eventId, certificateId, performedBy } = body;

    if (action === 'issue_participation') {
      if (!eventId) {
        return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
      }
      const res = Store.issueParticipationCertificates(eventId, performedBy || 'Coordinator');
      return NextResponse.json({ success: true, ...res });
    }

    if (action === 'retry_email') {
      if (!certificateId) {
        return NextResponse.json({ error: 'Certificate ID is required.' }, { status: 400 });
      }
      const success = Store.retryCertificateEmail(certificateId, performedBy || 'System');
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
