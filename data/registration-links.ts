/**
 * Centralized Google Forms Registration Links Configuration for TEKNOVA 2026.
 *
 * Requirements:
 * - Base Form: Individual registrations Google Form
 * - Question Parameter: entry.1596960882
 * - IDEATEK: Separate Google Form (forms.gle/HKSktzkPNjtu8Wx38)
 * - Raw URL parameters preserved verbatim (exact whitespace '+' encoding & fee strings).
 */

export const INDIVIDUAL_GOOGLE_FORM_BASE =
  'https://docs.google.com/forms/d/e/1FAIpQLSdCVIj4gWHmVIgQQYg5AHsoVXgueqNnlDpa722alf8VRGzgUg/viewform';

export const INDIVIDUAL_GOOGLE_FORM_SHORTLINK = 'https://forms.gle/ndjgjQvCKTjcVUiy5';

export const GOOGLE_FORM_QUESTION_PARAMETER = 'entry.1596960882';

export const IDEATEK_GOOGLE_FORM = 'https://forms.gle/HKSktzkPNjtu8Wx38';

/**
 * Exact prefilled Google Form registration URLs mapped by event slug.
 * All parameter values are exact strings provided by the organizers.
 */
export const EVENT_REGISTRATION_URLS: Record<string, string> = {
  // Flagship Ideathon (Separate Google Form)
  'ideatek': 'https://forms.gle/HKSktzkPNjtu8Wx38',

  // 1. BUG SLAYER (Debugging)
  'bug-slayer': 'https://docs.google.com/forms/d/e/1FAIpQLSdCVIj4gWHmVIgQQYg5AHsoVXgueqNnlDpa722alf8VRGzgUg/viewform?usp=pp_url&entry.1596960882=BUG+SLAYER+(DEBUGGING)+++++++++++++++++++++++++(%E2%82%B9100/-+per+head)',

  // 2. MIRROR MASTER (Replica)
  'mirror-master': 'https://docs.google.com/forms/d/e/1FAIpQLSdCVIj4gWHmVIgQQYg5AHsoVXgueqNnlDpa722alf8VRGzgUg/viewform?usp=pp_url&entry.1596960882=MIRROR+MASTER+(REPLICA)+++++++++++++++++++++++(%E2%82%B9200/-+per+head)',

  // 3. TEKNOVA E-CLASH
  'teknova-e-clash': 'https://docs.google.com/forms/d/e/1FAIpQLSdCVIj4gWHmVIgQQYg5AHsoVXgueqNnlDpa722alf8VRGzgUg/viewform?usp=pp_url&entry.1596960882=TEKNOVA+E-CLASH++++++++++++++++++++++++++++++++++++++++(%E2%82%B9150/-+per+head)',

  // 4. TEK ROYAL
  'tek-royal': 'https://docs.google.com/forms/d/e/1FAIpQLSdCVIj4gWHmVIgQQYg5AHsoVXgueqNnlDpa722alf8VRGzgUg/viewform?usp=pp_url&entry.1596960882=TEK+ROYAL+++++++++++++++++++++++++++++++++++++++++++++++++++++++(%E2%82%B9100/-+per+head)',

  // 5. TEKTONIQ
  'tektoniq': 'https://docs.google.com/forms/d/e/1FAIpQLSdCVIj4gWHmVIgQQYg5AHsoVXgueqNnlDpa722alf8VRGzgUg/viewform?usp=pp_url&entry.1596960882=TEKTONIQ+++++++++++++++++++++++++++++++++++++++++++++++++++++++++(%E2%82%B9100/-+per+head)',

  // 6. FIND-X
  'find-x': 'https://docs.google.com/forms/d/e/1FAIpQLSdCVIj4gWHmVIgQQYg5AHsoVXgueqNnlDpa722alf8VRGzgUg/viewform?usp=pp_url&entry.1596960882=FIND-X+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++(%E2%82%B9100/-+per+head)'
};

/**
 * Returns the exact Google Form registration URL for a given event ID or slug.
 * Returns null if no official URL is configured (pending).
 */
export function getEventRegistrationUrl(slugOrId: string): string | null {
  if (!slugOrId) return null;
  const key = slugOrId.toLowerCase().trim();
  return EVENT_REGISTRATION_URLS[key] || null;
}

