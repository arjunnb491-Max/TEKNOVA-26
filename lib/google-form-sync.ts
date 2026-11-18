import { supabaseAdmin } from '@/lib/supabase';
import { Store, TeamMemberRecord } from '@/lib/store';
import { OFFICIAL_EVENTS, resolveEventByIdOrSlug } from '@/data/events';

export interface GoogleFormRawPayload {
  // Can be key-value pairs of Question -> Answer
  [key: string]: any;
}

/**
 * Normalizes event name string from Google Form into official event slug.
 */
export function resolveGoogleFormEvent(input: string): string | null {
  if (!input) return null;
  const str = input.toLowerCase().trim();

  if (str.includes('bug slayer') || str.includes('debugging')) return 'bug-slayer';
  if (str.includes('mirror master') || str.includes('replica')) return 'mirror-master';
  if (str.includes('e-clash') || str.includes('e clash') || str.includes('gaming')) return 'teknova-e-clash';
  if (str.includes('tek royal') || str.includes('tek-royal') || str.includes('bgmi') || str.includes('royal')) return 'tek-royal';
  if (str.includes('tektoniq') || str.includes('quiz')) return 'tektoniq';
  if (str.includes('find-x') || str.includes('find x') || str.includes('treasure')) return 'find-x';
  if (str.includes('ideatek') || str.includes('ideathon') || str.includes('flagship')) return 'ideatek';

  const resolved = resolveEventByIdOrSlug(input);
  return resolved ? resolved.slug : null;
}

/**
 * Filter out screenshot and payment upload files/urls.
 */
export function isPaymentProofField(key: string, value: any): boolean {
  const lowerKey = key.toLowerCase();
  const lowerVal = typeof value === 'string' ? value.toLowerCase() : '';

  const proofKeywords = [
    'screenshot',
    'screenshort',
    'payment proof',
    'receipt',
    'upload payment',
    'transaction proof',
    'upload',
    'file',
    'drive.google.com'
  ];

  return (
    proofKeywords.some(kw => lowerKey.includes(kw)) ||
    lowerVal.includes('drive.google.com') ||
    lowerVal.includes('/file/d/') ||
    lowerVal.includes('/open?id=')
  );
}

/**
 * Intelligently extract participant details from arbitrary Google Form questions.
 */
export function parseGoogleFormData(raw: GoogleFormRawPayload) {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(raw)) {
    // Skip payment proof / screenshot fields
    if (isPaymentProofField(key, value)) {
      continue;
    }
    if (value !== undefined && value !== null) {
      sanitized[key.trim()] = String(value).trim();
    }
  }

  // Helper to find answer by matching question keywords
  const findValue = (keywords: string[]): string => {
    for (const [key, val] of Object.entries(sanitized)) {
      const lower = key.toLowerCase();
      if (keywords.some(kw => lower.includes(kw))) {
        return val;
      }
    }
    return '';
  };

  // Determine event
  let eventSlug = raw.eventSlug || raw.eventId || '';
  if (!eventSlug) {
    const eventField = findValue(['event', 'competition', 'entry.1596960882', 'choose event']);
    eventSlug = resolveGoogleFormEvent(eventField) || '';
  }
  // Default to ideatek if team fields are found or specified
  const isIdeatekExplicit = raw.isIdeatek === true || Object.keys(sanitized).some(k => k.toLowerCase().includes('ideatek'));
  if (!eventSlug && isIdeatekExplicit) {
    eventSlug = 'ideatek';
  }

  // Extract core participant fields
  const fullName = raw.fullName || raw.name || findValue(['full name', 'participant name', 'team leader name', 'leader name', 'name of the participant', 'name']);
  const email = raw.email || raw.emailAddress || findValue(['email', 'email address', 'mail id']);
  const phone = raw.phone || raw.phoneNumber || raw.mobile || findValue(['phone', 'mobile', 'whatsapp', 'contact number']);
  const college = raw.college || raw.institution || findValue(['college', 'institution', 'university', 'college name']);
  const course = raw.course || raw.department || findValue(['course', 'department', 'branch', 'degree']) || 'MCA';
  const year = raw.year || raw.semester || findValue(['year', 'semester']) || '1st Year';
  const studentId = raw.studentId || findValue(['student id', 'roll number', 'reg no', 'register number']);
  const teamName = raw.teamName || findValue(['team name', 'name of the team']);
  const transactionId = raw.transactionId || findValue(['transaction id', 'utr', 'ref no', 'reference number', 'payment id']);

  // Extract team members (for IDEATEK or team events)
  const teamMembers: TeamMemberRecord[] = [];
  
  // Look for Member 2, 3, 4
  for (let i = 2; i <= 4; i++) {
    const memName = findValue([`member ${i} name`, `member ${i}`, `participant ${i} name`, `member${i} name`]);
    const memEmail = findValue([`member ${i} email`, `member${i} email`]);
    const memPhone = findValue([`member ${i} phone`, `member ${i} mobile`, `member${i} phone`]);
    const memCollege = findValue([`member ${i} college`, `member${i} college`]) || college;

    if (memName) {
      teamMembers.push({
        name: memName,
        email: memEmail || '',
        phone: memPhone || ''
      });
    }
  }

  return {
    eventSlug,
    fullName,
    email,
    phone,
    college,
    course,
    year,
    studentId,
    teamName,
    teamMembers,
    transactionId,
    sanitizedAttributes: sanitized
  };
}

/**
 * Core sync function: stores participant & registration into Supabase and local store.
 */
export async function syncGoogleFormRegistration(rawPayload: GoogleFormRawPayload) {
  const parsed = parseGoogleFormData(rawPayload);

  if (!parsed.eventSlug) {
    return { success: false, error: 'Could not identify event from Google Form response.' };
  }

  if (!parsed.fullName || !parsed.email || !parsed.phone || !parsed.college) {
    return {
      success: false,
      error: 'Missing required participant details (Full Name, Email, Phone, College).',
      parsed
    };
  }

  const officialEvent = OFFICIAL_EVENTS.find(e => e.slug === parsed.eventSlug);
  if (!officialEvent) {
    return { success: false, error: `Invalid event slug: ${parsed.eventSlug}` };
  }

  const isTeam = officialEvent.participationType === 'team' || parsed.teamMembers.length > 0;

  // 1. Save into local persistent store (instant availability for Dashboards & Lookup)
  const localResult = Store.createRegistration({
    eventSlug: officialEvent.slug,
    participant: {
      fullName: parsed.fullName,
      email: parsed.email,
      phone: parsed.phone,
      college: parsed.college,
      course: parsed.course,
      year: parsed.year,
      studentId: parsed.studentId
    },
    participationType: isTeam ? 'team' : 'individual',
    teamName: parsed.teamName || (isTeam ? `${parsed.fullName}'s Team` : undefined),
    teamMembers: parsed.teamMembers,
    source: 'public',
    registeredBy: 'Google Forms Sync',
    paymentStatus: parsed.transactionId ? 'verified' : 'pending'
  });

  const registrationNumber = localResult.registration?.registrationNumber || `TEK26-${officialEvent.slug.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;

  // 2. Sync to Supabase PostgreSQL Database
  const supabaseLogs: { step: string; status: 'ok' | 'error'; error?: string }[] = [];

  try {
    // 2a. Ensure Event exists in Supabase
    let eventDbId: string | null = null;
    const { data: existingEvents, error: eventErr } = await supabaseAdmin
      .from('events')
      .select('id, slug')
      .eq('slug', officialEvent.slug)
      .limit(1);

    if (!eventErr && existingEvents && existingEvents.length > 0) {
      eventDbId = existingEvents[0].id;
      supabaseLogs.push({ step: 'find_event', status: 'ok' });
    } else {
      // Insert event into Supabase events table
      const { data: insertedEvent, error: insEventErr } = await supabaseAdmin
        .from('events')
        .insert({
          name: officialEvent.name,
          slug: officialEvent.slug,
          description: officialEvent.description,
          event_type: officialEvent.participationType,
          rules: officialEvent.rules?.join('\n') || '',
          venue: officialEvent.venue,
          registration_fee: officialEvent.registrationFee || 0,
          prize_pool: officialEvent.prizePoolSubtotal || 0,
          is_published: true
        })
        .select('id')
        .single();

      if (!insEventErr && insertedEvent) {
        eventDbId = insertedEvent.id;
        supabaseLogs.push({ step: 'create_event', status: 'ok' });
      } else {
        supabaseLogs.push({ step: 'create_event', status: 'error', error: insEventErr?.message });
      }
    }

    // 2b. Insert / Update Participant in Supabase
    let participantDbId: string | null = null;
    const { data: existingParticipant } = await supabaseAdmin
      .from('participants')
      .select('id')
      .eq('email', parsed.email)
      .limit(1);

    if (existingParticipant && existingParticipant.length > 0) {
      participantDbId = existingParticipant[0].id;
      // Update phone/college if needed
      await supabaseAdmin
        .from('participants')
        .update({
          full_name: parsed.fullName,
          phone: parsed.phone,
          college: parsed.college,
          updated_at: new Date().toISOString()
        })
        .eq('id', participantDbId);
      supabaseLogs.push({ step: 'update_participant', status: 'ok' });
    } else {
      const { data: insertedParticipant, error: insPartErr } = await supabaseAdmin
        .from('participants')
        .insert({
          full_name: parsed.fullName,
          email: parsed.email,
          phone: parsed.phone,
          college: parsed.college
        })
        .select('id')
        .single();

      if (!insPartErr && insertedParticipant) {
        participantDbId = insertedParticipant.id;
        supabaseLogs.push({ step: 'create_participant', status: 'ok' });
      } else {
        supabaseLogs.push({ step: 'create_participant', status: 'error', error: insPartErr?.message });
      }
    }

    // 2c. If team event, Insert / Update Team in Supabase
    let teamDbId: string | null = null;
    if (isTeam && eventDbId) {
      const teamNameToUse = parsed.teamName || `${parsed.fullName}'s Team`;
      const { data: existingTeam } = await supabaseAdmin
        .from('teams')
        .select('id')
        .eq('event_id', eventDbId)
        .eq('team_name', teamNameToUse)
        .limit(1);

      if (existingTeam && existingTeam.length > 0) {
        teamDbId = existingTeam[0].id;
        supabaseLogs.push({ step: 'find_team', status: 'ok' });
      } else {
        const { data: insertedTeam, error: teamErr } = await supabaseAdmin
          .from('teams')
          .insert({
            event_id: eventDbId,
            team_name: teamNameToUse,
            status: 'registered'
          })
          .select('id')
          .single();

        if (!teamErr && insertedTeam) {
          teamDbId = insertedTeam.id;
          supabaseLogs.push({ step: 'create_team', status: 'ok' });
        } else {
          supabaseLogs.push({ step: 'create_team', status: 'error', error: teamErr?.message });
        }
      }
    }

    // 2d. Insert Registration in Supabase
    if (eventDbId && (participantDbId || teamDbId)) {
      const { data: existingReg } = await supabaseAdmin
        .from('registrations')
        .select('id, registration_number')
        .eq('event_id', eventDbId)
        .eq('participant_id', participantDbId)
        .limit(1);

      if (existingReg && existingReg.length > 0) {
        supabaseLogs.push({ step: 'registration_exists', status: 'ok' });
      } else {
        const { error: insRegErr } = await supabaseAdmin
          .from('registrations')
          .insert({
            event_id: eventDbId,
            participant_id: participantDbId,
            team_id: teamDbId,
            registration_number: registrationNumber,
            payment_status: parsed.transactionId ? 'paid' : 'pending'
          });

        if (!insRegErr) {
          supabaseLogs.push({ step: 'create_registration', status: 'ok' });
        } else {
          supabaseLogs.push({ step: 'create_registration', status: 'error', error: insRegErr.message });
        }
      }
    }
  } catch (dbErr: any) {
    supabaseLogs.push({ step: 'supabase_exception', status: 'error', error: dbErr.message });
  }

  return {
    success: true,
    registrationNumber,
    event: officialEvent.name,
    participant: parsed.fullName,
    supabaseLogs,
    localSaved: localResult.success
  };
}

