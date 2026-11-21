import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Attempt using public client (adheres to RLS)
    const { data: publicData, error: publicError } = await supabase
      .from('events')
      .select('id, name, slug, description, event_type, rules, venue, registration_fee, prize_pool, is_published, registration_open')
      .eq('is_published', true)
      .order('created_at', { ascending: true });

    if (!publicError && publicData && publicData.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'supabase-public-client',
        events: publicData
      });
    }

    // 2. Server-side fallback with admin client strictly filtering is_published=true
    // Ensures published events are retrieved even if the RLS SELECT policy is not yet applied in PostgreSQL
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('events')
      .select('id, name, slug, description, event_type, rules, venue, registration_fee, prize_pool, is_published, registration_open')
      .eq('is_published', true)
      .order('created_at', { ascending: true });

    if (adminError) {
      return NextResponse.json({
        success: false,
        error: adminError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      source: 'supabase-live-db',
      events: adminData || []
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Database unavailable'
    }, { status: 500 });
  }
}

