import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationNumber, submission, performedBy } = body;

    if (!registrationNumber || !submission) {
      return NextResponse.json({ error: 'Registration number and submission data are required.' }, { status: 400 });
    }

    const success = Store.updateWorkflowSubmission(registrationNumber, {
      ...submission,
      performedBy: performedBy || 'Event Coordinator'
    });

    if (!success) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
