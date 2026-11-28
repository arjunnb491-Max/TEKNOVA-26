import { supabaseAdmin } from '@/lib/supabase';
import { OFFICIAL_EVENTS, OfficialEvent } from '@/data/events';
import type {
  RegistrationRecord,
  ConfirmedWinnerRecord,
  ComplaintRecord,
  AuditLogRecord,
  TeamMemberRecord,
} from '@/lib/store';

function positionToInt(pos: string): number {
  if (pos === '1st') return 1;
  if (pos === '2nd') return 2;
  if (pos === '3rd') return 3;
  const parsed = parseInt(pos, 10);
  return Number.isNaN(parsed) ? 1 : parsed;
}

function intToPosition(pos: number | string): '1st' | '2nd' | '3rd' {
  const n = typeof pos === 'string' ? parseInt(pos, 10) : pos;
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return '1st';
}

async function logAudit(params: {
  eventId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  newValues?: Record<string, any> | null;
  reason?: string | null;
}) {
  try {
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: null,
      event_id: params.eventId || null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      old_values: null,
      new_values: params.newValues || null,
      reason: params.reason || null,
    });
  } catch (err) {
    console.error('Supabase audit_logs insert error:', err);
  }
}

export async function getSupabaseEvents(): Promise<OfficialEvent[]> {
  const { data: dbEvents } = await supabaseAdmin.from('events').select('*');
  if (!dbEvents || dbEvents.length === 0) return OFFICIAL_EVENTS;

  const bySlug = new Map(dbEvents.map((e: any) => [e.slug, e]));
  return OFFICIAL_EVENTS.map((evt) => {
    const db = bySlug.get(evt.slug);
    if (!db) return evt;
    return {
      ...evt,
      name: db.name || evt.name,
      description: db.description ?? evt.description,
      venue: db.venue ?? evt.venue,
      registrationFee: db.registration_fee !== null && db.registration_fee !== undefined ? Number(db.registration_fee) : evt.registrationFee,
      registrationOpen: db.registration_open ?? evt.registrationOpen,
    };
  });
}

export async function updateSupabaseEvent(
  slug: string,
  updates: Partial<OfficialEvent>,
  performedBy: string
): Promise<OfficialEvent | null> {
  const { data: dbEvent } = await supabaseAdmin
    .from('events')
    .select('id, slug, name')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (!dbEvent) return null;

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.description !== undefined) patch.description = updates.description;
  if (updates.venue !== undefined) patch.venue = updates.venue;
  if (updates.registrationFee !== undefined) patch.registration_fee = updates.registrationFee;
  if (updates.registrationOpen !== undefined) patch.registration_open = updates.registrationOpen;
  if (updates.rules !== undefined) patch.rules = updates.rules.join('\n');

  const { error } = await supabaseAdmin.from('events').update(patch).eq('id', dbEvent.id);
  if (error) return null;

  await logAudit({
    eventId: dbEvent.id,
    action: 'EVENT_CONFIG_UPDATED',
    entityType: 'EVENT',
    entityId: slug,
    newValues: { performedBy, updates },
    reason: `Updated fields: ${Object.keys(updates).join(', ')}`,
  });

  const events = await getSupabaseEvents();
  return events.find((e) => e.slug === slug) || null;
}

export async function getSupabaseRegistrations(eventSlugOrId?: string): Promise<RegistrationRecord[]> {
  const { data: eventsData } = await supabaseAdmin.from('events').select('id, slug, name, event_type');
  const eventById = new Map((eventsData || []).map((e: any) => [e.id, e]));

  let targetEventDbId: string | null = null;
  if (eventSlugOrId && eventSlugOrId !== 'all') {
    const matched = (eventsData || []).find(
      (e: any) => e.slug === eventSlugOrId || e.id === eventSlugOrId
    );
    if (!matched) return [];
    targetEventDbId = matched.id;
  }

  let regQuery = supabaseAdmin
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (targetEventDbId) {
    regQuery = regQuery.eq('event_id', targetEventDbId);
  }

  const [
    { data: regs, error: regErr },
    { data: participants },
    { data: teams },
    { data: teamMembers },
    { data: attendanceRows },
    { data: workflowLogs },
  ] = await Promise.all([
    regQuery,
    supabaseAdmin.from('participants').select('*'),
    supabaseAdmin.from('teams').select('*'),
    supabaseAdmin.from('team_members').select('*'),
    supabaseAdmin.from('attendance').select('*'),
    supabaseAdmin
      .from('audit_logs')
      .select('entity_id, new_values, created_at')
      .eq('entity_type', 'SUBMISSION')
      .order('created_at', { ascending: false }),
  ]);

  if (regErr || !regs) return [];

  const partById = new Map((participants || []).map((p: any) => [p.id, p]));
  const teamById = new Map((teams || []).map((t: any) => [t.id, t]));

  const membersByTeam = new Map<string, any[]>();
  for (const tm of teamMembers || []) {
    const list = membersByTeam.get(tm.team_id) || [];
    list.push(tm);
    membersByTeam.set(tm.team_id, list);
  }

  const attByRegId = new Map<string, any>();
  for (const att of attendanceRows || []) {
    attByRegId.set(att.registration_id, att);
  }

  const workflowByRegNum = new Map<string, any>();
  for (const log of workflowLogs || []) {
    if (log.entity_id && !workflowByRegNum.has(log.entity_id)) {
      workflowByRegNum.set(log.entity_id, log.new_values);
    }
  }

  return regs.map((r: any) => {
    const evt = eventById.get(r.event_id);
    const officialEvt = OFFICIAL_EVENTS.find((e) => e.slug === evt?.slug);
    const team = r.team_id ? teamById.get(r.team_id) : null;
    const leaderPartId = r.participant_id || team?.team_leader_id;
    const leader = leaderPartId ? partById.get(leaderPartId) : null;

    const rawTeamMembers = team ? membersByTeam.get(team.id) || [] : [];
    const mappedMembers: TeamMemberRecord[] = rawTeamMembers
      .filter((tm: any) => tm.participant_id !== leaderPartId)
      .map((tm: any) => {
        const p = partById.get(tm.participant_id);
        return {
          name: p?.full_name || 'Member',
          email: p?.email || '',
          phone: p?.phone || '',
        };
      });

    const att = attByRegId.get(r.id);
    const wf = workflowByRegNum.get(r.registration_number) || {};
    const participationType: 'individual' | 'team' =
      r.team_id || officialEvt?.participationType === 'team' ? 'team' : 'individual';

    return {
      id: r.id,
      registrationNumber: r.registration_number,
      eventId: evt?.slug || r.event_id,
      eventName: evt?.name || officialEvt?.name || 'Event',
      eventSlug: evt?.slug || '',
      participationType,
      participant: {
        id: leader?.id || '',
        fullName: leader?.full_name || team?.team_name || 'Participant',
        email: leader?.email || '',
        phone: leader?.phone || '',
        college: leader?.college || '',
        course: leader?.course || undefined,
        year: leader?.academic_year || undefined,
      },
      teamName: team?.team_name || undefined,
      teamMembers: mappedMembers.length > 0 ? mappedMembers : undefined,
      paymentStatus: r.payment_status === 'paid' ? 'verified' : (r.payment_status || 'pending'),
      registrationDate: r.created_at || new Date().toISOString(),
      source: r.registration_source === 'walkin' ? 'receptionist_walkin' : 'public',
      registeredBy: r.registration_source === 'walkin' ? 'Reception Desk' : 'Online Registration',
      attendanceStatus: att?.status || 'not_marked',
      day1Attendance: att?.status || 'not_marked',
      day2Attendance: att?.status || 'not_marked',
      attendanceNotes: att?.notes || undefined,
      attendanceMarkedAt: att?.marked_at || att?.updated_at || undefined,
      submissionStatus: wf.submissionStatus || 'not_submitted',
      projectTitle: wf.projectTitle,
      projectSubmissionUrl: wf.projectSubmissionUrl,
      demoUrl: wf.demoUrl,
      scores: wf.scores,
      totalScore: wf.totalScore,
      evaluationNotes: wf.evaluationNotes,
    };
  });
}

export async function getSupabaseRegistrationByNumber(
  regNumber: string,
  verificationQuery?: string
): Promise<RegistrationRecord | null> {
  const cleanReg = regNumber.trim().toUpperCase();
  const all = await getSupabaseRegistrations();
  const reg = all.find((r) => r.registrationNumber.toUpperCase() === cleanReg);
  if (!reg) return null;

  if (verificationQuery) {
    const q = verificationQuery.trim().toLowerCase();
    const matchEmail = reg.participant.email.toLowerCase() === q;
    const digits = q.replace(/[^0-9]/g, '');
    const matchPhone =
      digits.length >= 6 &&
      reg.participant.phone.replace(/[^0-9]/g, '').endsWith(digits);
    if (!matchEmail && !matchPhone) return null;
  }

  return reg;
}

export async function createSupabaseRegistration(payload: {
  eventSlug: string;
  participant: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    course?: string;
    year?: string;
    studentId?: string;
  };
  participationType?: 'individual' | 'team';
  teamName?: string;
  teamMembers?: TeamMemberRecord[];
  source?: 'public' | 'receptionist_walkin';
  registeredBy?: string;
  paymentStatus?: string;
}): Promise<{ success: boolean; registration?: RegistrationRecord; error?: string }> {
  const officialEvent = OFFICIAL_EVENTS.find(
    (e) => e.slug === payload.eventSlug || e.id === payload.eventSlug
  );
  if (!officialEvent) {
    return { success: false, error: 'Event not found in official catalogue.' };
  }

  // Ensure event exists in Supabase
  let { data: dbEvent } = await supabaseAdmin
    .from('events')
    .select('id, slug, name')
    .eq('slug', officialEvent.slug)
    .limit(1)
    .maybeSingle();

  if (!dbEvent) {
    const { data: insertedEvt, error: evtErr } = await supabaseAdmin
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
        registration_open: true,
      })
      .select('id, slug, name')
      .single();

    if (evtErr || !insertedEvt) {
      return { success: false, error: evtErr?.message || 'Failed to resolve event in Supabase.' };
    }
    dbEvent = insertedEvt;
  }

  // Find or create primary participant
  let participantId: string | null = null;
  const { data: existingPart } = await supabaseAdmin
    .from('participants')
    .select('id')
    .eq('email', payload.participant.email.trim())
    .limit(1)
    .maybeSingle();

  if (existingPart) {
    participantId = existingPart.id;
  } else {
    const { data: insPart, error: partErr } = await supabaseAdmin
      .from('participants')
      .insert({
        full_name: payload.participant.fullName.trim(),
        email: payload.participant.email.trim(),
        phone: payload.participant.phone.trim(),
        college: payload.participant.college.trim(),
        course: payload.participant.course?.trim() || 'MCA',
        academic_year: payload.participant.year?.trim() || '1st Year',
      })
      .select('id')
      .single();

    if (partErr || !insPart) {
      return { success: false, error: partErr?.message || 'Failed to create participant.' };
    }
    participantId = insPart.id;
  }

  const isTeam =
    payload.participationType === 'team' ||
    officialEvent.participationType === 'team' ||
    (payload.teamMembers && payload.teamMembers.length > 0);

  let teamId: string | null = null;
  if (isTeam && participantId) {
    const finalTeamName = payload.teamName?.trim() || `${payload.participant.fullName.trim()}'s Team`;
    const { data: insTeam, error: teamErr } = await supabaseAdmin
      .from('teams')
      .insert({
        event_id: dbEvent.id,
        team_name: finalTeamName,
        team_leader_id: participantId,
        team_size_limit: officialEvent.teamSize?.max || 4,
        status: 'registered',
      })
      .select('id')
      .single();

    if (teamErr || !insTeam) {
      return { success: false, error: teamErr?.message || 'Failed to create team.' };
    }
    teamId = insTeam.id;

    await supabaseAdmin.from('team_members').insert({
      team_id: teamId,
      participant_id: participantId,
      member_role: 'leader',
      joined_at: new Date().toISOString(),
    });

    for (const mem of payload.teamMembers || []) {
      if (!mem.name?.trim()) continue;
      const memEmail =
        mem.email?.trim() ||
        `${mem.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${Date.now().toString().slice(-4)}@team.${officialEvent.slug}.fest`;

      let memPartId: string | null = null;
      const { data: existingMem } = await supabaseAdmin
        .from('participants')
        .select('id')
        .eq('email', memEmail)
        .limit(1)
        .maybeSingle();

      if (existingMem) {
        memPartId = existingMem.id;
      } else {
        const { data: insMem } = await supabaseAdmin
          .from('participants')
          .insert({
            full_name: mem.name.trim(),
            email: memEmail,
            phone: mem.phone?.trim() || null,
            college: payload.participant.college.trim(),
            course: payload.participant.course?.trim() || 'MCA',
            academic_year: payload.participant.year?.trim() || '1st Year',
          })
          .select('id')
          .single();
        memPartId = insMem?.id || null;
      }

      if (memPartId) {
        await supabaseAdmin.from('team_members').insert({
          team_id: teamId,
          participant_id: memPartId,
          member_role: 'member',
          joined_at: new Date().toISOString(),
        });
      }
    }
  }

  // Generate unique sequential registration number
  const { count } = await supabaseAdmin
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', dbEvent.id);

  const prefix = officialEvent.slug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const seq = ((count || 0) + 1).toString().padStart(4, '0');
  const regNumber = `TK26-${prefix}-${seq}`;

  const mappedPayment =
    payload.paymentStatus === 'verified' || payload.paymentStatus === 'paid' || payload.paymentStatus === 'exempt' || payload.paymentStatus === 'waived'
      ? 'paid'
      : 'pending';

  const { error: regErr } = await supabaseAdmin.from('registrations').insert({
    event_id: dbEvent.id,
    participant_id: isTeam ? null : participantId,
    team_id: isTeam ? teamId : null,
    registration_number: regNumber,
    registration_source: payload.source === 'receptionist_walkin' ? 'walkin' : 'online',
    registration_status: 'registered',
    payment_status: mappedPayment,
    registered_by: null,
  });

  if (regErr) {
    return { success: false, error: regErr.message };
  }

  await logAudit({
    eventId: dbEvent.id,
    action: 'REGISTRATION_CREATED',
    entityType: 'REGISTRATION',
    entityId: regNumber,
    newValues: { performedBy: payload.registeredBy || payload.participant.fullName },
    reason: `${payload.source === 'receptionist_walkin' ? 'On-the-spot walk-in' : 'Online'} registration for ${officialEvent.name}`,
  });

  const created = await getSupabaseRegistrationByNumber(regNumber);
  return { success: true, registration: created || undefined };
}

export async function updateSupabaseAttendance(
  registrationNumber: string,
  attendance: {
    status: 'present' | 'absent' | 'not_marked';
    notes?: string;
    markedBy: string;
  }
): Promise<boolean> {
  const { data: reg } = await supabaseAdmin
    .from('registrations')
    .select('id, event_id, registration_number')
    .eq('registration_number', registrationNumber)
    .limit(1)
    .maybeSingle();

  if (!reg) return false;

  const { data: existing } = await supabaseAdmin
    .from('attendance')
    .select('id')
    .eq('registration_id', reg.id)
    .limit(1)
    .maybeSingle();

  const now = new Date().toISOString();
  if (existing) {
    const { error } = await supabaseAdmin
      .from('attendance')
      .update({
        status: attendance.status,
        notes: attendance.notes ?? null,
        marked_at: now,
        updated_at: now,
      })
      .eq('id', existing.id);
    if (error) return false;
  } else {
    const { error } = await supabaseAdmin.from('attendance').insert({
      registration_id: reg.id,
      status: attendance.status,
      notes: attendance.notes ?? null,
      marked_by: null,
      marked_at: now,
      updated_at: now,
    });
    if (error) return false;
  }

  await logAudit({
    eventId: reg.event_id,
    action: 'ATTENDANCE_UPDATED',
    entityType: 'ATTENDANCE',
    entityId: registrationNumber,
    newValues: { status: attendance.status, markedBy: attendance.markedBy },
    reason: `Marked ${attendance.status.toUpperCase()} for ${registrationNumber}`,
  });

  return true;
}

export async function updateSupabaseWorkflowSubmission(
  registrationNumber: string,
  submission: Record<string, any>
): Promise<boolean> {
  const { data: reg } = await supabaseAdmin
    .from('registrations')
    .select('id, event_id, registration_number')
    .eq('registration_number', registrationNumber)
    .limit(1)
    .maybeSingle();

  if (!reg) return false;

  await logAudit({
    eventId: reg.event_id,
    action: 'WORKFLOW_SUBMISSION_UPDATED',
    entityType: 'SUBMISSION',
    entityId: registrationNumber,
    newValues: submission,
    reason: `Updated submission & evaluation for ${registrationNumber} (Score: ${submission.totalScore ?? 'N/A'})`,
  });

  return true;
}

export async function getSupabaseWinners(eventSlugOrId?: string): Promise<ConfirmedWinnerRecord[]> {
  const { data: eventsData } = await supabaseAdmin.from('events').select('id, slug, name');
  const eventById = new Map((eventsData || []).map((e: any) => [e.id, e]));

  let query = supabaseAdmin.from('event_results').select('*').order('position', { ascending: true });
  if (eventSlugOrId && eventSlugOrId !== 'all') {
    const evt = (eventsData || []).find((e: any) => e.slug === eventSlugOrId || e.id === eventSlugOrId);
    if (!evt) return [];
    query = query.eq('event_id', evt.id);
  }

  const [{ data: results }, { data: regs }, { data: participants }, { data: teams }] = await Promise.all([
    query,
    supabaseAdmin.from('registrations').select('id, event_id, participant_id, team_id, registration_number'),
    supabaseAdmin.from('participants').select('id, full_name, college'),
    supabaseAdmin.from('teams').select('id, team_name, team_leader_id'),
  ]);

  if (!results) return [];

  const partById = new Map((participants || []).map((p: any) => [p.id, p]));
  const teamById = new Map((teams || []).map((t: any) => [t.id, t]));

  return results.map((res: any) => {
    const evt = eventById.get(res.event_id);
    const officialEvt = OFFICIAL_EVENTS.find((e) => e.slug === evt?.slug);
    const posStr = intToPosition(res.position);
    const prizeAmount = officialEvt?.prizes.find((p) => p.position === posStr)?.amount || 0;

    const team = res.team_id ? teamById.get(res.team_id) : null;
    const partId = res.participant_id || team?.team_leader_id;
    const part = partId ? partById.get(partId) : null;

    const matchingReg = (regs || []).find(
      (r: any) =>
        r.event_id === res.event_id &&
        ((res.team_id && r.team_id === res.team_id) ||
          (res.participant_id && r.participant_id === res.participant_id))
    );

    return {
      id: res.id,
      eventId: evt?.slug || res.event_id,
      eventName: evt?.name || officialEvt?.name || 'Event',
      position: posStr,
      registrationNumber: matchingReg?.registration_number || 'N/A',
      winnerName: part?.full_name || team?.team_name || 'Winner',
      teamName: team?.team_name || undefined,
      college: part?.college || '',
      prizeAmount,
      confirmedAt: res.confirmed_at || res.selected_at || new Date().toISOString(),
      confirmedBy: 'Authorized Official',
    };
  });
}

export async function confirmSupabaseWinner(payload: {
  eventId: string;
  position: '1st' | '2nd' | '3rd';
  registrationNumber: string;
  confirmedBy: string;
}): Promise<{ success: boolean; winner?: ConfirmedWinnerRecord; error?: string }> {
  const { data: dbEvent } = await supabaseAdmin
    .from('events')
    .select('id, slug, name')
    .eq('slug', payload.eventId)
    .limit(1)
    .maybeSingle();

  if (!dbEvent) return { success: false, error: 'Event not found.' };

  const { data: reg } = await supabaseAdmin
    .from('registrations')
    .select('id, event_id, participant_id, team_id, registration_number')
    .eq('registration_number', payload.registrationNumber)
    .limit(1)
    .maybeSingle();

  if (!reg) return { success: false, error: 'Valid registration not found.' };

  const posInt = positionToInt(payload.position);
  const now = new Date().toISOString();

  // Remove any existing winner for this event + position
  await supabaseAdmin
    .from('event_results')
    .delete()
    .eq('event_id', dbEvent.id)
    .eq('position', posInt);

  const { data: inserted, error } = await supabaseAdmin
    .from('event_results')
    .insert({
      event_id: dbEvent.id,
      participant_id: reg.participant_id,
      team_id: reg.team_id,
      position: posInt,
      status: 'confirmed',
      selected_by: null,
      confirmed_by: null,
      selected_at: now,
      confirmed_at: now,
    })
    .select('*')
    .single();

  if (error || !inserted) {
    return { success: false, error: error?.message || 'Failed to confirm winner.' };
  }

  await logAudit({
    eventId: dbEvent.id,
    action: 'WINNER_CONFIRMED',
    entityType: 'RESULTS',
    entityId: reg.registration_number,
    newValues: { position: payload.position, confirmedBy: payload.confirmedBy },
    reason: `Awarded ${payload.position} prize to ${reg.registration_number}`,
  });

  const winners = await getSupabaseWinners(dbEvent.slug);
  const winner = winners.find((w) => w.position === payload.position);
  return { success: true, winner };
}

export async function getSupabaseComplaints(eventSlugOrId?: string): Promise<ComplaintRecord[]> {
  const { data: eventsData } = await supabaseAdmin.from('events').select('id, slug, name');
  const eventById = new Map((eventsData || []).map((e: any) => [e.id, e]));

  let query = supabaseAdmin.from('complaints').select('*').order('created_at', { ascending: false });
  if (eventSlugOrId && eventSlugOrId !== 'all') {
    const evt = (eventsData || []).find((e: any) => e.slug === eventSlugOrId || e.id === eventSlugOrId);
    if (evt) query = query.eq('event_id', evt.id);
  }

  const { data: rows } = await query;
  if (!rows) return [];

  return rows.map((c: any) => {
    const evt = c.event_id ? eventById.get(c.event_id) : null;
    return {
      id: c.complaint_number || c.id,
      eventId: evt?.slug || undefined,
      eventName: evt?.name || undefined,
      category: c.category || 'other',
      priority: c.priority || 'medium',
      status: c.status || 'open',
      description: c.description || '',
      submittedBy: 'Staff / Coordinator',
      submitterRole: 'coordinator',
      createdAt: c.created_at || new Date().toISOString(),
      resolvedAt: c.resolved_at || undefined,
      resolutionNotes: c.resolution_notes || undefined,
    };
  });
}

export async function createSupabaseComplaint(payload: {
  eventId?: string;
  category: ComplaintRecord['category'];
  priority: ComplaintRecord['priority'];
  description: string;
  submittedBy: string;
  submitterEmail?: string;
  submitterRole: ComplaintRecord['submitterRole'];
}): Promise<ComplaintRecord> {
  let dbEventId: string | null = null;
  let eventName: string | undefined;

  if (payload.eventId) {
    const { data: evt } = await supabaseAdmin
      .from('events')
      .select('id, name')
      .eq('slug', payload.eventId)
      .limit(1)
      .maybeSingle();
    if (evt) {
      dbEventId = evt.id;
      eventName = evt.name;
    }
  }

  const ticketNum = `TKT-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  await supabaseAdmin.from('complaints').insert({
    complaint_number: ticketNum,
    event_id: dbEventId,
    category: payload.category,
    priority: payload.priority,
    status: 'open',
    description: `${payload.description} (Submitted by: ${payload.submittedBy})`,
    created_by: null,
    assigned_to: null,
    created_at: now,
    updated_at: now,
  });

  await logAudit({
    eventId: dbEventId,
    action: 'COMPLAINT_SUBMITTED',
    entityType: 'SUPPORT',
    entityId: ticketNum,
    newValues: { submittedBy: payload.submittedBy, category: payload.category },
    reason: `[${payload.priority.toUpperCase()}] ${payload.category}: ${payload.description.slice(0, 50)}`,
  });

  return {
    id: ticketNum,
    eventId: payload.eventId,
    eventName,
    category: payload.category,
    priority: payload.priority,
    status: 'open',
    description: payload.description,
    submittedBy: payload.submittedBy,
    submitterEmail: payload.submitterEmail,
    submitterRole: payload.submitterRole,
    createdAt: now,
  };
}

export async function resolveSupabaseComplaint(
  complaintId: string,
  resolutionNotes: string,
  resolvedBy: string
): Promise<boolean> {
  const now = new Date().toISOString();
  const { data: existing } = await supabaseAdmin
    .from('complaints')
    .select('id, event_id')
    .or(`complaint_number.eq.${complaintId},id.eq.${complaintId}`)
    .limit(1)
    .maybeSingle();

  if (!existing) return false;

  const { error } = await supabaseAdmin
    .from('complaints')
    .update({
      status: 'resolved',
      resolution_notes: resolutionNotes,
      resolved_at: now,
      updated_at: now,
    })
    .eq('id', existing.id);

  if (error) return false;

  await logAudit({
    eventId: existing.event_id,
    action: 'COMPLAINT_RESOLVED',
    entityType: 'SUPPORT',
    entityId: complaintId,
    newValues: { resolvedBy, resolutionNotes },
    reason: `Resolved complaint ${complaintId}: ${resolutionNotes}`,
  });

  return true;
}

export async function getSupabaseAuditLogs(limit = 50): Promise<AuditLogRecord[]> {
  const [{ data: logs }, { data: eventsData }] = await Promise.all([
    supabaseAdmin.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit),
    supabaseAdmin.from('events').select('id, slug, name'),
  ]);

  if (!logs) return [];
  const eventById = new Map((eventsData || []).map((e: any) => [e.id, e]));

  return logs.map((l: any) => {
    const evt = l.event_id ? eventById.get(l.event_id) : null;
    const performedBy =
      l.new_values?.performedBy ||
      l.new_values?.confirmedBy ||
      l.new_values?.markedBy ||
      l.new_values?.resolvedBy ||
      l.new_values?.submittedBy ||
      'System';

    return {
      id: l.id,
      timestamp: l.created_at,
      eventId: evt?.slug || undefined,
      eventName: evt?.name || undefined,
      action: l.action,
      entityType: l.entity_type,
      entityId: l.entity_id || undefined,
      performedBy,
      details: l.reason || l.action,
    };
  });
}

export async function getSupabaseStats() {
  const [regs, winners, complaints, events] = await Promise.all([
    getSupabaseRegistrations(),
    getSupabaseWinners(),
    getSupabaseComplaints(),
    getSupabaseEvents(),
  ]);

  const totalRegs = regs.length;
  const individualRegs = regs.filter((r) => r.participationType === 'individual').length;
  const teamRegs = regs.filter((r) => r.participationType === 'team').length;
  const presentCount = regs.filter(
    (r) => r.attendanceStatus === 'present' || r.day1Attendance === 'present' || r.day2Attendance === 'present'
  ).length;
  const absentCount = regs.filter((r) => r.attendanceStatus === 'absent').length;
  const openComplaints = complaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length;

  const eventWise: Record<string, { count: number; present: number; name: string }> = {};
  for (const evt of events) {
    const evtRegs = regs.filter((r) => r.eventSlug === evt.slug || r.eventId === evt.id);
    eventWise[evt.slug] = {
      name: evt.name,
      count: evtRegs.length,
      present: evtRegs.filter((r) => r.attendanceStatus === 'present' || r.day1Attendance === 'present').length,
    };
  }

  return {
    totalRegistrations: totalRegs,
    individualRegistrations: individualRegs,
    teamRegistrations: teamRegs,
    presentCount,
    absentCount,
    confirmedWinners: winners.length,
    openComplaints,
    totalEvents: events.length,
    eventWise,
  };
}

