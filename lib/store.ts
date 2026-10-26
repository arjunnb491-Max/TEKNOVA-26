import fs from 'fs';
import path from 'path';
import { OFFICIAL_EVENTS, OfficialEvent } from '@/data/events';

export interface ParticipantRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course?: string;
  year?: string;
  studentId?: string;
}

export interface TeamMemberRecord {
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
}

export interface RegistrationRecord {
  id: string;
  registrationNumber: string;
  eventId: string;
  eventName: string;
  eventSlug: string;
  participationType: 'individual' | 'team';
  participant: ParticipantRecord;
  teamName?: string;
  teamMembers?: TeamMemberRecord[];
  paymentStatus: 'pending' | 'verified' | 'exempt' | 'waived';
  registrationDate: string;
  source: 'public' | 'receptionist_walkin';
  registeredBy?: string;
  day1Attendance?: 'present' | 'absent' | 'not_marked';
  day2Attendance?: 'present' | 'absent' | 'not_marked';
  attendanceStatus: 'present' | 'absent' | 'not_marked';
  attendanceNotes?: string;
  attendanceMarkedBy?: string;
  attendanceMarkedAt?: string;
  projectTitle?: string;
  projectSubmissionUrl?: string;
  demoUrl?: string;
  submissionStatus?: 'not_submitted' | 'submitted' | 'under_review' | 'evaluated';
  scores?: Record<string, number>;
  totalScore?: number;
  evaluationNotes?: string;
}

export interface ConfirmedWinnerRecord {
  id: string;
  eventId: string;
  eventName: string;
  position: '1st' | '2nd' | '3rd';
  registrationNumber: string;
  winnerName: string;
  teamName?: string;
  college: string;
  prizeAmount: number;
  confirmedAt: string;
  confirmedBy: string;
}

export interface ComplaintRecord {
  id: string;
  eventId?: string;
  eventName?: string;
  category: 'registration' | 'attendance' | 'results' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
  description: string;
  submittedBy: string;
  submitterEmail?: string;
  submitterRole: 'participant' | 'coordinator' | 'receptionist' | 'admin';
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  eventId?: string;
  eventName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  performedBy: string;
  details?: string;
}

export interface FestDatabase {
  events: OfficialEvent[];
  registrations: RegistrationRecord[];
  winners: ConfirmedWinnerRecord[];
  complaints: ComplaintRecord[];
  auditLogs: AuditLogRecord[];
  coordinatorAssignments: Record<string, string[]>; // eventSlug -> coordinatorEmails[]
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure database file exists with initial baseline data
function readDb(): FestDatabase {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialDb: FestDatabase = {
        events: OFFICIAL_EVENTS,
        registrations: [],
        winners: [],
        complaints: [],
        auditLogs: [
          {
            id: 'AUD-001',
            timestamp: new Date().toISOString(),
            action: 'SYSTEM_INITIALIZED',
            entityType: 'SYSTEM',
            performedBy: 'System Administrator',
            details: `TEKNOVA ’26 Unified Event Management System initialized with ${OFFICIAL_EVENTS.length} official events.`
          }
        ],
        coordinatorAssignments: {
          'bug-slayer': ['coordinator.bugslayer@teknova.fest'],
          'mirror-masters': ['coordinator.mirrormasters@teknova.fest'],
          'teknova-e-clash': ['coordinator.eclash@teknova.fest'],
          'tek-royale': ['coordinator.tekroyale@teknova.fest'],
          'ideatek': ['coordinator.ideatek@teknova.fest'],
          'teksphere': ['coordinator.teksphere@teknova.fest'],
          'tektoniq': ['coordinator.tektoniq@teknova.fest'],
          'beat-blitz': ['coordinator.beatblitz@teknova.fest'],
        }
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }

    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data/db.json:', err);
    return {
      events: OFFICIAL_EVENTS,
      registrations: [],
      winners: [],
      complaints: [],
      auditLogs: [],
      coordinatorAssignments: {}
    };
  }
}

function writeDb(data: FestDatabase) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data/db.json:', err);
  }
}

// Generate unique sequential registration numbers: TK26-<SLUG>-XXXX
export function generateRegistrationNumber(eventSlug: string): string {
  const db = readDb();
  const eventPrefix = eventSlug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const count = db.registrations.filter(r => r.eventSlug === eventSlug).length + 1;
  return `TK26-${eventPrefix}-${count.toString().padStart(4, '0')}`;
}


export const Store = {
  // Events
  getEvents: (): OfficialEvent[] => {
    const db = readDb();
    return db.events || OFFICIAL_EVENTS;
  },

  getEventBySlug: (slug: string): OfficialEvent | undefined => {
    const db = readDb();
    return db.events.find(e => e.slug === slug || e.id === slug);
  },

  updateEvent: (slug: string, updates: Partial<OfficialEvent>, performedBy: string): OfficialEvent | null => {
    const db = readDb();
    const idx = db.events.findIndex(e => e.slug === slug || e.id === slug);
    if (idx === -1) return null;

    db.events[idx] = { ...db.events[idx], ...updates };
    
    // Log audit
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: slug,
      eventName: db.events[idx].name,
      action: 'EVENT_CONFIG_UPDATED',
      entityType: 'EVENT',
      entityId: slug,
      performedBy,
      details: `Updated fields: ${Object.keys(updates).join(', ')}`
    });

    writeDb(db);
    return db.events[idx];
  },

  // Coordinator Management
  getCoordinators: (): Record<string, string[]> => {
    const db = readDb();
    return db.coordinatorAssignments || {
      'ideatek': ['ideatek.lead@teknova.in', 'faculty.mca@kmmcollege.edu.in'],
      'tek-royale': ['esports@teknova.in'],
      'mirror-masters': ['web.coord@teknova.in'],
      'tektoniq': ['quiz.master@teknova.in'],
      'beat-blitz': ['cultural.lead@teknova.in'],
      'bug-slayer': ['debugging.lead@teknova.in'],
      'teknova-e-clash': ['eclash.pes@teknova.in'],
      'teksphere': ['expo.lead@teknova.in']
    };
  },

  assignCoordinator: (eventSlug: string, email: string, performedBy: string): boolean => {
    const db = readDb();
    if (!db.coordinatorAssignments) db.coordinatorAssignments = {};
    if (!db.coordinatorAssignments[eventSlug]) db.coordinatorAssignments[eventSlug] = [];
    const cleanEmail = email.trim().toLowerCase();
    if (!db.coordinatorAssignments[eventSlug].includes(cleanEmail)) {
      db.coordinatorAssignments[eventSlug].push(cleanEmail);
    }
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: eventSlug,
      action: 'COORDINATOR_ASSIGNED',
      entityType: 'COORDINATOR',
      performedBy,
      details: `Assigned coordinator ${cleanEmail} to event ${eventSlug}`
    });
    writeDb(db);
    return true;
  },

  removeCoordinator: (eventSlug: string, email: string, performedBy: string): boolean => {
    const db = readDb();
    if (!db.coordinatorAssignments || !db.coordinatorAssignments[eventSlug]) return false;
    const cleanEmail = email.trim().toLowerCase();
    db.coordinatorAssignments[eventSlug] = db.coordinatorAssignments[eventSlug].filter(e => e.toLowerCase() !== cleanEmail);
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: eventSlug,
      action: 'COORDINATOR_REMOVED',
      entityType: 'COORDINATOR',
      performedBy,
      details: `Removed coordinator ${cleanEmail} from event ${eventSlug}`
    });
    writeDb(db);
    return true;
  },

  // Registrations
  getRegistrations: (eventId?: string): RegistrationRecord[] => {
    const db = readDb();
    if (!eventId || eventId === 'all') return db.registrations;
    return db.registrations.filter(r => r.eventSlug === eventId || r.eventId === eventId);
  },

  getRegistrationByNumber: (regNumber: string, verificationQuery?: string): RegistrationRecord | null => {
    const db = readDb();
    const cleanReg = regNumber.trim().toUpperCase();
    const reg = db.registrations.find(r => r.registrationNumber.toUpperCase() === cleanReg);
    if (!reg) return null;

    // Secure verification: if verificationQuery provided, check email or phone
    if (verificationQuery) {
      const q = verificationQuery.trim().toLowerCase();
      const matchEmail = reg.participant.email.toLowerCase() === q;
      const matchPhone = reg.participant.phone.replace(/[^0-9]/g, '').endsWith(q.replace(/[^0-9]/g, ''));
      if (!matchEmail && !matchPhone) {
        return null; // Privacy protected: requires matching email or phone
      }
    }

    return reg;
  },

  createRegistration: (payload: {
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
    paymentStatus?: 'pending' | 'verified' | 'exempt' | 'waived';
  }): { success: boolean; registration?: RegistrationRecord; error?: string } => {
    const db = readDb();
    const event = db.events.find(e => e.slug === payload.eventSlug || e.id === payload.eventSlug);
    if (!event) {
      return { success: false, error: 'Event not found in official catalogue.' };
    }

    // Duplicate check for same event & email/phone
    const existing = db.registrations.find(r => 
      (r.eventSlug === event.slug || r.eventId === event.id) &&
      (r.participant.email.toLowerCase() === payload.participant.email.toLowerCase() ||
       r.participant.phone === payload.participant.phone)
    );

    if (existing) {
      return {
        success: false,
        error: `A registration for ${event.name} already exists with this email or phone number (${existing.registrationNumber}).`
      };
    }

    const regNumber = generateRegistrationNumber(event.slug);
    const newReg: RegistrationRecord = {
      id: `REG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      registrationNumber: regNumber,
      eventId: event.id,
      eventName: event.name,
      eventSlug: event.slug,
      participationType: payload.participationType || event.participationType,
      participant: {
        id: `PART-${Date.now()}`,
        fullName: payload.participant.fullName.trim(),
        email: payload.participant.email.trim(),
        phone: payload.participant.phone.trim(),
        college: payload.participant.college.trim(),
        course: payload.participant.course,
        year: payload.participant.year,
        studentId: payload.participant.studentId,
      },
      teamName: payload.teamName?.trim(),
      teamMembers: payload.teamMembers,
      paymentStatus: payload.paymentStatus || (event.registrationFee ? 'pending' : 'verified'),
      registrationDate: new Date().toISOString(),
      source: payload.source || 'public',
      registeredBy: payload.registeredBy || 'Self-Registered',
      attendanceStatus: 'not_marked',
      day1Attendance: 'not_marked',
      day2Attendance: 'not_marked',
      submissionStatus: 'not_submitted'
    };

    db.registrations.unshift(newReg);

    // Audit log
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: event.slug,
      eventName: event.name,
      action: 'REGISTRATION_CREATED',
      entityType: 'REGISTRATION',
      entityId: regNumber,
      performedBy: payload.registeredBy || payload.participant.fullName,
      details: `${payload.source === 'receptionist_walkin' ? 'On-the-spot walk-in' : 'Online'} registration for ${event.name}`
    });

    writeDb(db);
    return { success: true, registration: newReg };
  },

  // Attendance Management
  updateAttendance: (
    registrationNumber: string,
    attendance: {
      status: 'present' | 'absent' | 'not_marked';
      day1?: 'present' | 'absent' | 'not_marked';
      day2?: 'present' | 'absent' | 'not_marked';
      notes?: string;
      markedBy: string;
    }
  ): boolean => {
    const db = readDb();
    const reg = db.registrations.find(r => r.registrationNumber === registrationNumber);
    if (!reg) return false;

    reg.attendanceStatus = attendance.status;
    if (attendance.day1) reg.day1Attendance = attendance.day1;
    if (attendance.day2) reg.day2Attendance = attendance.day2;
    if (attendance.notes !== undefined) reg.attendanceNotes = attendance.notes;
    reg.attendanceMarkedBy = attendance.markedBy;
    reg.attendanceMarkedAt = new Date().toISOString();

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: reg.eventSlug,
      eventName: reg.eventName,
      action: 'ATTENDANCE_UPDATED',
      entityType: 'ATTENDANCE',
      entityId: registrationNumber,
      performedBy: attendance.markedBy,
      details: `Marked ${attendance.status.toUpperCase()} for ${reg.participant.fullName}`
    });

    writeDb(db);
    return true;
  },

  // Workflow / Evaluation Management
  updateWorkflowSubmission: (
    registrationNumber: string,
    submission: {
      projectTitle?: string;
      projectSubmissionUrl?: string;
      demoUrl?: string;
      submissionStatus?: 'not_submitted' | 'submitted' | 'under_review' | 'evaluated';
      scores?: Record<string, number>;
      totalScore?: number;
      evaluationNotes?: string;
      performedBy: string;
    }
  ): boolean => {
    const db = readDb();
    const reg = db.registrations.find(r => r.registrationNumber === registrationNumber);
    if (!reg) return false;

    if (submission.projectTitle !== undefined) reg.projectTitle = submission.projectTitle;
    if (submission.projectSubmissionUrl !== undefined) reg.projectSubmissionUrl = submission.projectSubmissionUrl;
    if (submission.demoUrl !== undefined) reg.demoUrl = submission.demoUrl;
    if (submission.submissionStatus !== undefined) reg.submissionStatus = submission.submissionStatus;
    if (submission.scores !== undefined) reg.scores = { ...(reg.scores || {}), ...submission.scores };
    if (submission.totalScore !== undefined) reg.totalScore = submission.totalScore;
    if (submission.evaluationNotes !== undefined) reg.evaluationNotes = submission.evaluationNotes;

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: reg.eventSlug,
      eventName: reg.eventName,
      action: 'WORKFLOW_SUBMISSION_UPDATED',
      entityType: 'SUBMISSION',
      entityId: registrationNumber,
      performedBy: submission.performedBy,
      details: `Updated submission & evaluation for ${reg.teamName || reg.participant.fullName} (Score: ${reg.totalScore || 'N/A'})`
    });

    writeDb(db);
    return true;
  },

  // Winner Management
  getWinners: (eventId?: string): ConfirmedWinnerRecord[] => {
    const db = readDb();
    if (!eventId || eventId === 'all') return db.winners;
    return db.winners.filter(w => w.eventId === eventId);
  },

  confirmWinner: (payload: {
    eventId: string;
    position: '1st' | '2nd' | '3rd';
    registrationNumber: string;
    confirmedBy: string;
  }): { success: boolean; winner?: ConfirmedWinnerRecord; error?: string } => {
    const db = readDb();
    const event = db.events.find(e => e.slug === payload.eventId || e.id === payload.eventId);
    if (!event) return { success: false, error: 'Event not found.' };

    const reg = db.registrations.find(r => r.registrationNumber === payload.registrationNumber);
    if (!reg) return { success: false, error: 'Valid registration not found.' };

    // Find configured prize amount
    const prizeConfig = event.prizes.find(p => p.position === payload.position);
    const prizeAmount = prizeConfig ? prizeConfig.amount : 0;

    // Prevent same registration occupying multiple positions
    const duplicate = db.winners.find(w => w.eventId === event.slug && w.registrationNumber === payload.registrationNumber);
    if (duplicate && duplicate.position !== payload.position) {
      return { success: false, error: `This participant is already confirmed for ${duplicate.position} prize.` };
    }

    // Remove existing winner for this position if re-assigning
    db.winners = db.winners.filter(w => !(w.eventId === event.slug && w.position === payload.position));

    const newWinner: ConfirmedWinnerRecord = {
      id: `WIN-${Date.now()}`,
      eventId: event.slug,
      eventName: event.name,
      position: payload.position,
      registrationNumber: reg.registrationNumber,
      winnerName: reg.participant.fullName,
      teamName: reg.teamName,
      college: reg.participant.college,
      prizeAmount,
      confirmedAt: new Date().toISOString(),
      confirmedBy: payload.confirmedBy
    };

    db.winners.push(newWinner);


    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: event.slug,
      eventName: event.name,
      action: 'WINNER_CONFIRMED',
      entityType: 'RESULTS',
      entityId: reg.registrationNumber,
      performedBy: payload.confirmedBy,
      details: `Awarded ${payload.position} prize (${prizeAmount > 0 ? `₹${prizeAmount}` : 'TBA'}) to ${reg.participant.fullName} (${reg.registrationNumber})`
    });

    writeDb(db);
    return { success: true, winner: newWinner };
  },


  // Complaints
  getComplaints: (eventId?: string): ComplaintRecord[] => {
    const db = readDb();
    if (!eventId || eventId === 'all') return db.complaints;
    return db.complaints.filter(c => c.eventId === eventId);
  },

  createComplaint: (payload: {
    eventId?: string;
    category: ComplaintRecord['category'];
    priority: ComplaintRecord['priority'];
    description: string;
    submittedBy: string;
    submitterEmail?: string;
    submitterRole: ComplaintRecord['submitterRole'];
  }): ComplaintRecord => {
    const db = readDb();
    const event = payload.eventId ? db.events.find(e => e.slug === payload.eventId) : undefined;
    const newComplaint: ComplaintRecord = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      eventId: payload.eventId,
      eventName: event?.name,
      category: payload.category,
      priority: payload.priority,
      status: 'open',
      description: payload.description,
      submittedBy: payload.submittedBy,
      submitterEmail: payload.submitterEmail,
      submitterRole: payload.submitterRole,
      createdAt: new Date().toISOString()
    };

    db.complaints.unshift(newComplaint);
    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: payload.eventId,
      action: 'COMPLAINT_SUBMITTED',
      entityType: 'SUPPORT',
      entityId: newComplaint.id,
      performedBy: payload.submittedBy,
      details: `[${payload.priority.toUpperCase()}] ${payload.category}: ${payload.description.slice(0, 50)}...`
    });

    writeDb(db);
    return newComplaint;
  },

  resolveComplaint: (complaintId: string, resolutionNotes: string, resolvedBy: string): boolean => {
    const db = readDb();
    const c = db.complaints.find(item => item.id === complaintId);
    if (!c) return false;

    c.status = 'resolved';
    c.resolutionNotes = resolutionNotes;
    c.resolvedAt = new Date().toISOString();
    c.assignedTo = resolvedBy;

    db.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'COMPLAINT_RESOLVED',
      entityType: 'SUPPORT',
      entityId: complaintId,
      performedBy: resolvedBy,
      details: `Resolved complaint ${complaintId}: ${resolutionNotes}`
    });

    writeDb(db);
    return true;
  },

  // Audit Logs
  getAuditLogs: (limit = 50): AuditLogRecord[] => {
    const db = readDb();
    return db.auditLogs.slice(0, limit);
  },

  // Analytics & Statistics
  getStats: () => {
    const db = readDb();
    const totalRegs = db.registrations.length;
    const individualRegs = db.registrations.filter(r => r.participationType === 'individual').length;
    const teamRegs = db.registrations.filter(r => r.participationType === 'team').length;
    const presentCount = db.registrations.filter(r => r.attendanceStatus === 'present' || r.day1Attendance === 'present' || r.day2Attendance === 'present').length;
    const absentCount = db.registrations.filter(r => r.attendanceStatus === 'absent').length;
    const winnersCount = db.winners.length;
    const openComplaints = db.complaints.filter(c => c.status === 'open' || c.status === 'in_progress').length;

    // Event-wise counts
    const eventWise: Record<string, { count: number; present: number; name: string }> = {};
    for (const evt of db.events) {
      const regs = db.registrations.filter(r => r.eventSlug === evt.slug || r.eventId === evt.id);
      eventWise[evt.slug] = {
        name: evt.name,
        count: regs.length,
        present: regs.filter(r => r.attendanceStatus === 'present' || r.day1Attendance === 'present').length
      };
    }

    return {
      totalRegistrations: totalRegs,
      individualRegistrations: individualRegs,
      teamRegistrations: teamRegs,
      presentCount,
      absentCount,
      confirmedWinners: winnersCount,
      openComplaints,
      totalEvents: db.events.length,
      eventWise
    };
  },

  // Reset all operational dummy data while retaining official events and configurations
  resetOperationalData: (performedBy = 'System Administrator'): boolean => {
    const db = readDb();
    db.registrations = [];
    db.winners = [];
    db.complaints = [];
    db.auditLogs = [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'DATABASE_PURGED',
        entityType: 'SYSTEM',
        performedBy,
        details: 'All operational records (registrations, winners, complaints) cleared.'
      }
    ];
    writeDb(db);
    return true;
  }
};

