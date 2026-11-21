-- TEKNOVA'26 Sponsors Table Schema & Initial Seed
-- Author: TEKNOVA'26 Engineering Team
-- Migration: 20261121_create_sponsors_table.sql

CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tier TEXT NOT NULL CHECK (tier IN ('title', 'powered_by', 'associate', 'community', 'media', 'technology', 'supporting')),
    category TEXT NOT NULL,
    description TEXT,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    highlighted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for ordering and filtering
CREATE INDEX IF NOT EXISTS idx_sponsors_tier_order ON public.sponsors (tier, display_order);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON public.sponsors (is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Public can read active sponsors
DROP POLICY IF EXISTS "Allow public read access on active sponsors" ON public.sponsors;
CREATE POLICY "Allow public read access on active sponsors"
    ON public.sponsors
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Service role full access
DROP POLICY IF EXISTS "Allow service role full management on sponsors" ON public.sponsors;
CREATE POLICY "Allow service role full management on sponsors"
    ON public.sponsors
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Seed Initial Official Sponsors
INSERT INTO public.sponsors (name, slug, tier, category, description, logo_url, website_url, is_active, display_order, highlighted)
VALUES
    ('CyberX Networks', 'cyberx-networks', 'title', 'Title Sponsor', 'Leading provider of decentralized high-performance cloud fabric and sovereign AI infrastructure. Powering the next generation of campus technocrats at TEKNOVA’26.', '/images/sponsors/cyberx-networks.svg', 'https://teknova.co.in', true, 1, true),
    ('NeonCloud Systems', 'neoncloud-systems', 'powered_by', 'Powered By • Cloud & AI Partner', 'Ultra-low latency serverless compute clusters and automated developer pipelines engineered for high-concurrency applications.', '/images/sponsors/neoncloud.svg', 'https://teknova.co.in', true, 2, false),
    ('Apex Gaming Rig', 'apex-gaming-rig', 'powered_by', 'Powered By • Esports Arena Partner', 'Precision-engineered tournament hardware, competitive rigs, and dedicated frame-rate telemetry for the TEKNOVA E-Clash arena.', '/images/sponsors/apex-gaming.svg', 'https://teknova.co.in', true, 3, false),
    ('Vortex DevLabs', 'vortex-devlabs', 'associate', 'Associate Sponsor • Dev Tools', 'Developer productivity ecosystem offering AI code assistance and rapid API scaffolding.', '/images/sponsors/vortex-devlabs.svg', 'https://teknova.co.in', true, 4, false),
    ('HyperByte Security', 'hyperbyte-security', 'associate', 'Associate Sponsor • Cyber Defense', 'Zero-trust network defense and automated bug hunting suites for mission-critical web applications.', '/images/sponsors/hyperbyte-sec.svg', 'https://teknova.co.in', true, 5, false),
    ('Quantum Pulse Media', 'quantum-pulse-media', 'associate', 'Associate Sponsor • Digital Media', 'Next-gen streaming network, live-broadcast production, and multi-channel youth media syndication.', '/images/sponsors/quantum-pulse.svg', 'https://teknova.co.in', true, 6, false),
    ('FOSS United Kochi', 'foss-united-kochi', 'community', 'Community Partner', 'Promoting free and open-source software culture and grassroots hacker spaces across Kerala.', '/images/sponsors/foss-united.svg', 'https://teknova.co.in', true, 7, false),
    ('Kochi Devs Hub', 'kochi-devs-hub', 'community', 'Community Partner', 'Kerala tech collective fostering peer learning, developer meetups, and open mentorship.', '/images/sponsors/kochi-devs.svg', 'https://teknova.co.in', true, 8, false),
    ('Tech Malayalam', 'tech-malayalam', 'media', 'Media Partner', 'Leading regional technology news portal and digital creator collective covering South India tech events.', '/images/sponsors/techmalayalam.svg', 'https://teknova.co.in', true, 9, false),
    ('Campus Beats', 'campus-beats', 'media', 'Media Partner', 'Intercollegiate youth radio and campus fest reporting network reaching 50,000+ college students.', '/images/sponsors/campus-beats.svg', 'https://teknova.co.in', true, 10, false),
    ('GitHub Campus', 'github-campus', 'technology', 'Technology Partner', 'Empowering student developers with developer packs, codespaces, and open-source toolkits.', '/images/sponsors/github-campus.svg', 'https://teknova.co.in', true, 11, false),
    ('KMM MCA Alumni Network', 'kmm-mca-alumni-network', 'supporting', 'Supporting Partner', 'Global network of MCA alumni driving sponsorship endowments, mentoring, and technical juries.', '/images/sponsors/kmm-alumni.svg', 'https://teknova.co.in', true, 12, false)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tier = EXCLUDED.tier,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    logo_url = EXCLUDED.logo_url,
    website_url = EXCLUDED.website_url,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order,
    highlighted = EXCLUDED.highlighted,
    updated_at = timezone('utc'::text, now());

