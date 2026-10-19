import { NextRequest, NextResponse } from 'next/server';
import { Store } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const eventSlug = body.eventSlug;
    const fullName = body.fullName || body.participant?.fullName;
    const email = body.email || body.participant?.email;
    const phone = body.phone || body.participant?.phone;
    const college = body.college || body.participant?.college;
    const course = body.course || body.participant?.course;
    const year = body.year || body.participant?.year;
    const studentId = body.studentId || body.participant?.studentId;
    const participationType = body.participationType;
    const teamName = body.teamName;
    const teamMembers = body.teamMembers;
    const source = body.source;
    const registeredBy = body.registeredBy;
    const paymentStatus = body.paymentStatus;

    // Server-side validation
    if (!eventSlug || !fullName?.trim() || !email?.trim() || !phone?.trim() || !college?.trim()) {
      return NextResponse.json(
        { error: 'Event, Full Name, Email, Phone number, and College name are required fields.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Phone validation
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    // Team validation if team participation
    if (participationType === 'team' && !teamName?.trim()) {
      return NextResponse.json({ error: 'Team name is mandatory for team events.' }, { status: 400 });
    }

    const result = Store.createRegistration({
      eventSlug,
      participant: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: college.trim(),
        course: course?.trim(),
        year: year?.trim(),
        studentId: studentId?.trim(),
      },
      participationType: participationType || 'individual',
      teamName: teamName?.trim(),
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      source: source || 'public',
      registeredBy: registeredBy || 'Self-Registered',
      paymentStatus
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      registration: result.registration
    }, { status: 201 });
  } catch (err: any) {
    console.error('Registration API Error:', err);
    return NextResponse.json({ error: 'Internal server error processing registration.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const regNumber = searchParams.get('regNumber') || searchParams.get('regNo');
    const verify = searchParams.get('verify') || searchParams.get('query');
    const eventId = searchParams.get('eventId');

    if (regNumber) {
      // Secure lookup: requires verify (email or phone) to prevent guessing personal data
      const record = Store.getRegistrationByNumber(regNumber, verify || undefined);
      if (!record) {
        return NextResponse.json(
          { error: 'Registration not found or verification credentials did not match.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ registration: record });
    }

    // Event filtered query
    const list = Store.getRegistrations(eventId || undefined);
    return NextResponse.json({ registrations: list });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error fetching registration data.' }, { status: 500 });
  }
}
