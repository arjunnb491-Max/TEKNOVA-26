import { NextRequest, NextResponse } from 'next/server';
import { syncGoogleFormRegistration } from '@/lib/google-form-sync';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const configuredSecret = process.env.GOOGLE_FORMS_WEBHOOK_SECRET;
    const providedSecret = req.headers.get('x-webhook-secret') || searchParams.get('secret');

    if (configuredSecret && providedSecret !== configuredSecret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid webhook secret.' }, { status: 401 });
    }

    const body = await req.json();

    // Support both single submission and array of submissions (bulk sync)
    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        const res = await syncGoogleFormRegistration(item);
        results.push(res);
      }
      return NextResponse.json({
        success: true,
        totalProcessed: results.length,
        results
      });
    }

    const result = await syncGoogleFormRegistration(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error('Google Form Webhook Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process Google Form submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/webhooks/google-form',
    message: 'TEKNOVA 2026 Google Form Webhook listener is active.',
    instructions: 'Send POST requests with participant response details. Payment proof and screenshots are automatically excluded.'
  });
}

