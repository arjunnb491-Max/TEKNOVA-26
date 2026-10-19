import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'audit') {
      const logs = Store.getAuditLogs();
      return NextResponse.json({ logs });
    }

    if (type === 'stats') {
      const stats = Store.getStats();
      return NextResponse.json({ stats });
    }

    if (type === 'coordinators') {
      const coordinators = Store.getCoordinators();
      return NextResponse.json({ coordinators });
    }

    const stats = Store.getStats();
    const logs = Store.getAuditLogs(20);
    return NextResponse.json({ stats, logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, eventSlug, email, updates, performedBy } = body;

    if (action === 'update_event') {
      if (!eventSlug || !updates) {
        return NextResponse.json({ error: 'eventSlug and updates object required.' }, { status: 400 });
      }
      const updated = Store.updateEvent(eventSlug, updates, performedBy || 'Admin');
      if (!updated) {
        return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, event: updated });
    }

    if (action === 'assign_coordinator') {
      if (!eventSlug || !email) {
        return NextResponse.json({ error: 'eventSlug and coordinator email required.' }, { status: 400 });
      }
      const success = Store.assignCoordinator(eventSlug, email, performedBy || 'Admin');
      return NextResponse.json({ success });
    }

    if (action === 'remove_coordinator') {
      if (!eventSlug || !email) {
        return NextResponse.json({ error: 'eventSlug and coordinator email required.' }, { status: 400 });
      }
      const success = Store.removeCoordinator(eventSlug, email, performedBy || 'Admin');
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
