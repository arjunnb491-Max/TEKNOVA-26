import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const complaints = Store.getComplaints(eventId || undefined);
    return NextResponse.json({ complaints });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, complaintId, resolutionNotes, resolvedBy, eventId, category, priority, description, submittedBy, submitterEmail, submitterRole } = body;

    if (action === 'resolve') {
      if (!complaintId || !resolutionNotes) {
        return NextResponse.json({ error: 'Complaint ID and resolution notes are required.' }, { status: 400 });
      }
      const success = Store.resolveComplaint(complaintId, resolutionNotes, resolvedBy || 'Admin');
      return NextResponse.json({ success });
    }

    if (!category || !description?.trim() || !submittedBy?.trim()) {
      return NextResponse.json({ error: 'Category, Description, and Submitter Name are required.' }, { status: 400 });
    }

    const complaint = Store.createComplaint({
      eventId,
      category,
      priority: priority || 'medium',
      description: description.trim(),
      submittedBy: submittedBy.trim(),
      submitterEmail: submitterEmail?.trim(),
      submitterRole: submitterRole || 'coordinator'
    });

    return NextResponse.json({ success: true, complaint }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
