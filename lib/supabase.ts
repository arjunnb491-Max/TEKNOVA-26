import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Publishable Key missing from environment configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Schema types matching the live Supabase tables
export interface DbEvent {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  event_type: 'individual' | 'team' | string;
  rules: string | null;
  venue: string | null;
  registration_fee: number | null;
  prize_pool: number | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbEventPrize {
  id: string;
  event_id: string;
  position: string;
  prize_amount: number;
  created_at?: string;
}

export interface DbParticipant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbTeam {
  id: string;
  event_id: string;
  team_name: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbTeamMember {
  id: string;
  team_id: string;
  participant_id: string;
}

export interface DbRegistration {
  id: string;
  event_id: string;
  participant_id: string | null;
  team_id: string | null;
  registration_number: string;
  payment_status: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbAttendance {
  id: string;
  registration_id: string;
  status: 'present' | 'absent' | 'not_marked' | string;
  marked_by: string | null;
  notes: string | null;
  updated_at?: string;
}

export interface DbCertificate {
  id: string;
  event_id: string;
  participant_id: string;
  certificate_type: 'participation' | 'winner' | 'runner_up' | string;
  certificate_number: string;
  file_path: string | null;
  status: string;
  created_at?: string;
}

export interface DbEventResult {
  id: string;
  event_id: string;
  participant_id: string | null;
  team_id: string | null;
  position: string;
  status: string;
  confirmed_at: string | null;
  confirmed_by: string | null;
}

export interface DbComplaint {
  id: string;
  event_id: string | null;
  participant_id: string | null;
  category: string;
  priority: string;
  status: string;
  description: string;
  assigned_to: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbEmailLog {
  id: string;
  event_id: string | null;
  participant_id: string | null;
  certificate_id: string | null;
  subject: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  created_at?: string;
}

export interface DbEvaluation {
  id: string;
  event_id: string;
  team_id: string;
  status: string;
  total_score: number | null;
  judge_id: string | null;
  feedback: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbProjectSubmission {
  id: string;
  team_id: string;
  project_title: string | null;
  demo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbFinalist {
  id: string;
  event_id: string;
  team_id: string;
}

export interface DbProfile {
  id: string;
  full_name: string | null;
  email: string;
  role: 'admin' | 'coordinator' | 'receptionist' | string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbAuditLog {
  id: string;
  event_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at?: string;
}
