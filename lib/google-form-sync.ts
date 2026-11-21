import { supabaseAdmin } from '@/lib/supabase';
import { Store, TeamMemberRecord } from '@/lib/store';
import { OFFICIAL_EVENTS, resolveEventByIdOrSlug } from '@/data/events';

export interface GoogleFormRawPayload {
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
  if (str.includes('e-clash') || str.includes('e clash') || str.includes('gaming') || str.includes('football')) return 'teknova-e-clash';
  if (str.includes('tek royal') || str.includes('tek-royal') || str.includes('bgmi') || str.includes('pubg') || str.includes('royal')) return 'tek-royal';
  if (str.includes('tektoniq') || str.includes('quiz')) return 'tektoniq';
  if (str.includes('find-x') || str.includes('find x') || str.includes('treasure')) return 'find-x';
  if (str.includes('ideatek') || str.includes('ideathon') || str.includes('flagship')) return 'ideatek';

  const resolved = resolveEventByIdOrSlug(input);
  return resolved ? resolved.slug : null;
}

/**
 * Filter out screenshot, image files, binary image content, and file upload URLs.
 * Strictly excludes image uploads while preserving all text/dropdown/checkbox data.
 */
export function isPaymentProofField(key: string, value: any): boolean {
  const lowerKey = key.toLowerCase();
  const strVal = typeof value === 'string' ? value.trim() : '';
  const lowerVal = strVal.toLowerCase();

  // Keyword check on question label
  const proofKeyKeywords = [
    'screenshot',
    'screenshort',
    'payment proof',
    'receipt',
    'upload payment',
    'transaction proof',
    'upload screenshot',
    'photo',
    'image',
    'upload file',
    'id card'
  ];

  if (proofKeyKeywords.some(kw => lowerKey.includes(kw))) {
    return true;
  }

  // Value checks: Base64 data URLs, Drive file URLs, image file extensions
  if (lowerVal.startsWith('data:image/') || lowerVal.startsWith('data:application/octet-stream')) {
    return true;
  }

  if (
    lowerVal.includes('drive.google.com') ||
    lowerVal.includes('docs.google.com/uc') ||
    lowerVal.includes('/file/d/') ||
    lowerVal.includes('/open?id=')
  ) {
    return true;
  }

  // Image file extensions
  if (/\.(jpg|jpeg|png|webp|gif|bmp|svg|heic)$/i.test(lowerVal)) {
    return true;
  }

  return false;
}

/**
 * Intelligently extract participant details from arbitrary Google Form questions.
 * Preserves the full question-to-answer map while stripping image binaries and file URLs.
 */
export function parseGoogleFormData(raw: GoogleFormRawPayload) {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(raw)) {
    // Skip empty keys or internal metadata
    if (!key || key.startsWith('__')) continue;

    // Exclude image upload and payment proof files
    if (isPaymentProofField(key, value)) {
      continue;
    }

    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        sanitized[key.trim()] = value.join(', ').trim();
      } else {
        sanitized[key.trim()] = String(value).trim();
      }
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
 * Core sync function: stores participant, team, team members, registration, and full response map into Supabase.
 */
export async function syncGoogleFormRegistration(rawPayload: GoogleFormRawPayload) {
  const parsed = parseGoogleFormData(rawPayload);

  if (!parsed.eventSlug) {
    return { 
      success: false, 
      error: 'Could not identify event from Google Form response.',
      supabaseLogs: [{ step: 'parse_event', status: 'error', error: 'Unknown event name' }]
    };
  }

  if (!parsed.fullName || !parsed.email || !parsed.phone || !parsed.college) {
    return {
      success: false,
      error: 'Missing required participant details (Full Name, Email, Phone, College).',
      parsed,
      supabaseLogs: [{ step: 'validate_fields', status: 'error', error: 'Missing required fields' }]
    };
  }

  const officialEvent = OFFICIAL_EVENTS.find(e => e.slug === parsed.eventSlug);
  if (!officialEvent) {
    return { 
      success: false, 
      error: `Invalid event slug: ${parsed.eventSlug}`,
      supabaseLogs: [{ step: 'match_event', status: 'error', error: `Unknown slug: ${parsed.eventSlug}` }]
    };
  }

  const isTeam = officialEvent.participationType === 'team' || parsed.teamMembers.length > 0;
  const teamNameToUse = parsed.teamName || (isTeam ? `${parsed.fullName}'s Team` : undefined);

  // 1. Save into local persistent store for instant receptionist / lookup availability
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
    teamName: teamNameToUse,
    teamMembers: parsed.teamMembers,
    source: 'public',
    registeredBy: 'Google Forms Sync',
    paymentStatus: parsed.transactionId ? 'verified' : 'pending'
  });

  const registrationNumber = 
    localResult.registration?.registrationNumber || 
    `TK26-${officialEvent.slug.toUpperCase().slice(0, 4).replace(/[^A-Z]/g, '')}-${Date.now().toString().slice(-4)}`;

  // 2. Sync to Supabase PostgreSQL Database
  const supabaseLogs: { step: string; status: 'ok' | 'error'; error?: string }[] = [];
  let syncSuccess = true;

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
          is_published: true,
          registration_open: true
        })
        .select('id')
        .single();

      if (!insEventErr && insertedEvent) {
        eventDbId = insertedEvent.id;
        supabaseLogs.push({ step: 'create_event', status: 'ok' });
      } else {
        syncSuccess = false;
        supabaseLogs.push({ step: 'create_event', status: 'error', error: insEventErr?.message });
      }
    }

    if (!eventDbId) {
      throw new Error('Event ID could not be resolved in Supabase.');
    }

    // 2b. Insert / Update Primary Participant (Leader) in Supabase
    let participantDbId: string | null = null;
    const { data: existingParticipant } = await supabaseAdmin
      .from('participants')
      .select('id')
      .eq('email', parsed.email)
      .limit(1);

    if (existingParticipant && existingParticipant.length > 0) {
      participantDbId = existingParticipant[0].id;
      await supabaseAdmin
        .from('participants')
        .update({
          full_name: parsed.fullName,
          phone: parsed.phone,
          college: parsed.college,
          course: parsed.course,
          academic_year: parsed.year,
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
          college: parsed.college,
          course: parsed.course,
          academic_year: parsed.year
        })
        .select('id')
        .single();

      if (!insPartErr && insertedParticipant) {
        participantDbId = insertedParticipant.id;
        supabaseLogs.push({ step: 'create_participant', status: 'ok' });
      } else {
        syncSuccess = false;
        supabaseLogs.push({ step: 'create_participant', status: 'error', error: insPartErr?.message });
      }
    }

    // 2c. Handle Team & Team Members (for team registrations)
    let teamDbId: string | null = null;
    if (isTeam && participantDbId) {
      const finalTeamName = teamNameToUse || `${parsed.fullName}'s Team`;

      const { data: existingTeam } = await supabaseAdmin
        .from('teams')
        .select('id')
        .eq('event_id', eventDbId)
        .eq('team_name', finalTeamName)
        .limit(1);

      if (existingTeam && existingTeam.length > 0) {
        teamDbId = existingTeam[0].id;
        supabaseLogs.push({ step: 'find_team', status: 'ok' });
      } else {
        const { data: insertedTeam, error: teamErr } = await supabaseAdmin
          .from('teams')
          .insert({
            event_id: eventDbId,
            team_name: finalTeamName,
            team_leader_id: participantDbId,
            team_size_limit: officialEvent.teamSize?.max || 4,
            status: 'registered'
          })
          .select('id')
          .single();

        if (!teamErr && insertedTeam) {
          teamDbId = insertedTeam.id;
          supabaseLogs.push({ step: 'create_team', status: 'ok' });
        } else {
          syncSuccess = false;
          supabaseLogs.push({ step: 'create_team', status: 'error', error: teamErr?.message });
        }
      }

      // Link leader in team_members
      if (teamDbId) {
        const { data: existingLeaderMember } = await supabaseAdmin
          .from('team_members')
          .select('id')
          .eq('team_id', teamDbId)
          .eq('participant_id', participantDbId)
          .limit(1);

        if (!existingLeaderMember || existingLeaderMember.length === 0) {
          await supabaseAdmin.from('team_members').insert({
            team_id: teamDbId,
            participant_id: participantDbId,
            member_role: 'leader',
            joined_at: new Date().toISOString()
          });
        }

        // Insert and link secondary team members (Member 2, 3, 4)
        for (let idx = 0; idx < parsed.teamMembers.length; idx++) {
          const mem = parsed.teamMembers[idx];
          if (!mem.name.trim()) continue;

          // Resolve or create participant record for team member
          const memberEmail = mem.email?.trim() || `${mem.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${Date.now().toString().slice(-4)}@team.${officialEvent.slug}.fest`;
          let memberPartId: string | null = null;

          const { data: existingMemberPart } = await supabaseAdmin
            .from('participants')
            .select('id')
            .eq('email', memberEmail)
            .limit(1);

          if (existingMemberPart && existingMemberPart.length > 0) {
            memberPartId = existingMemberPart[0].id;
          } else {
            const { data: insMemPart, error: insMemErr } = await supabaseAdmin
              .from('participants')
              .insert({
                full_name: mem.name.trim(),
                email: memberEmail,
                phone: mem.phone?.trim() || null,
                college: parsed.college,
                course: parsed.course,
                academic_year: parsed.year
              })
              .select('id')
              .single();

            if (!insMemErr && insMemPart) {
              memberPartId = insMemPart.id;
            }
          }

          if (memberPartId) {
            const { data: existingTm } = await supabaseAdmin
              .from('team_members')
              .select('id')
              .eq('team_id', teamDbId)
              .eq('participant_id', memberPartId)
              .limit(1);

            if (!existingTm || existingTm.length === 0) {
              await supabaseAdmin.from('team_members').insert({
                team_id: teamDbId,
                participant_id: memberPartId,
                member_role: 'member',
                joined_at: new Date().toISOString()
              });
            }
          }
        }
        supabaseLogs.push({ step: 'sync_team_members', status: 'ok' });
      }
    }

    // 2d. Insert Registration in Supabase (Adheres to registrations_check constraint)
    // NOTE: PostgreSQL constraint requires EITHER participant_id OR team_id (mutually exclusive)
    let registrationDbId: string | null = null;

    if (isTeam && teamDbId) {
      // Check duplicate registration for this team
      const { data: existingTeamReg } = await supabaseAdmin
        .from('registrations')
        .select('id, registration_number')
        .eq('event_id', eventDbId)
        .eq('team_id', teamDbId)
        .limit(1);

      if (existingTeamReg && existingTeamReg.length > 0) {
        registrationDbId = existingTeamReg[0].id;
        supabaseLogs.push({ step: 'registration_exists', status: 'ok' });
      } else {
        const { data: insTeamReg, error: insTeamRegErr } = await supabaseAdmin
          .from('registrations')
          .insert({
            event_id: eventDbId,
            participant_id: null, // Must be null for team to satisfy constraint
            team_id: teamDbId,
            registration_number: registrationNumber,
            registration_source: 'online',
            registration_status: 'registered',
            payment_status: parsed.transactionId ? 'paid' : 'pending',
            payment_reference: parsed.transactionId || null
          })
          .select('id')
          .single();

        if (!insTeamRegErr && insTeamReg) {
          registrationDbId = insTeamReg.id;
          supabaseLogs.push({ step: 'create_registration', status: 'ok' });
        } else {
          syncSuccess = false;
          supabaseLogs.push({ step: 'create_registration', status: 'error', error: insTeamRegErr?.message });
        }
      }
    } else if (!isTeam && participantDbId) {
      // Check duplicate registration for individual
      const { data: existingIndReg } = await supabaseAdmin
        .from('registrations')
        .select('id, registration_number')
        .eq('event_id', eventDbId)
        .eq('participant_id', participantDbId)
        .limit(1);

      if (existingIndReg && existingIndReg.length > 0) {
        registrationDbId = existingIndReg[0].id;
        supabaseLogs.push({ step: 'registration_exists', status: 'ok' });
      } else {
        const { data: insIndReg, error: insIndRegErr } = await supabaseAdmin
          .from('registrations')
          .insert({
            event_id: eventDbId,
            participant_id: participantDbId,
            team_id: null, // Must be null for individual
            registration_number: registrationNumber,
            registration_source: 'online',
            registration_status: 'registered',
            payment_status: parsed.transactionId ? 'paid' : 'pending',
            payment_reference: parsed.transactionId || null
          })
          .select('id')
          .single();

        if (!insIndRegErr && insIndReg) {
          registrationDbId = insIndReg.id;
          supabaseLogs.push({ step: 'create_registration', status: 'ok' });
        } else {
          syncSuccess = false;
          supabaseLogs.push({ step: 'create_registration', status: 'error', error: insIndRegErr?.message });
        }
      }
    }

    // 2e. Store Full Question-to-Answer Map in Supabase audit_logs
    // Guarantees all arbitrary text, dropdown, and checkbox questions are preserved verbatim without images
    if (registrationDbId && eventDbId) {
      await supabaseAdmin.from('audit_logs').insert({
        event_id: eventDbId,
        action: 'GOOGLE_FORM_REGISTRATION',
        entity_type: 'registrations',
        entity_id: registrationDbId,
        new_values: {
          registrationNumber,
          eventSlug: officialEvent.slug,
          eventName: officialEvent.name,
          formResponses: parsed.sanitizedAttributes,
          syncedAt: new Date().toISOString()
        },
        reason: 'Google Forms Webhook Sync'
      });
      supabaseLogs.push({ step: 'audit_log_saved', status: 'ok' });
    }

  } catch (dbErr: any) {
    syncSuccess = false;
    supabaseLogs.push({ step: 'supabase_exception', status: 'error', error: dbErr.message });
  }

  return {
    success: syncSuccess,
    registrationNumber,
    event: officialEvent.name,
    participant: isTeam ? (parsed.teamName || parsed.fullName) : parsed.fullName,
    supabaseLogs,
    localSaved: localResult.success
  };
}
