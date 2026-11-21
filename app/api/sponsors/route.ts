import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase, DbSponsor } from '@/lib/supabase';
import { OFFICIAL_SPONSORS, Sponsor } from '@/data/sponsors';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const client = supabaseAdmin || supabase;
    
    // Attempt database query
    const { data, error } = await client
      .from('sponsors')
      .select('id, name, slug, tier, category, description, logo_url, website_url, is_active, display_order, highlighted')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      // Graceful fallback to verified official fest sponsors
      return NextResponse.json({
        success: true,
        source: 'fallback',
        message: error ? `DB query bypassed (${error.message}); using official sponsors catalogue` : 'Using official sponsors catalogue',
        total: OFFICIAL_SPONSORS.length,
        sponsors: OFFICIAL_SPONSORS,
      });
    }

    const sponsors: Sponsor[] = (data as DbSponsor[]).map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      tier: d.tier,
      category: d.category,
      description: d.description || undefined,
      logoUrl: d.logo_url,
      websiteUrl: d.website_url || undefined,
      isActive: d.is_active,
      displayOrder: d.display_order,
      highlighted: d.highlighted,
    }));

    return NextResponse.json({
      success: true,
      source: 'database',
      total: sponsors.length,
      sponsors,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      source: 'fallback',
      message: err?.message || 'Database unavailable; fallback used',
      total: OFFICIAL_SPONSORS.length,
      sponsors: OFFICIAL_SPONSORS,
    });
  }
}

