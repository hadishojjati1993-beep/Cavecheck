// lib/marketplaces/utils/sanitize.ts

const DEFAULT_QUERY_MAX_LEN = 120;
const DEFAULT_VALUE_MAX_LEN = 200;

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return "";
  }
}

/**
 * Normalize Unicode and remove control / invisible characters that can break URLs or bypass filters.
 * Keeps it conservative for marketplace search queries.
 */
export function normalizeText(input: string): string {
  let s = input;

  // Normalize Unicode to reduce homoglyph / compatibility issues.
  // NFKC is usually safest for user-entered search queries.
  try {
    s = s.normalize("NFKC");
  } catch {
    // ignore if environment does not support normalize
  }

  // Remove ASCII control chars + DEL
  s = s.replace(/[\u0000-\u001F\u007F]/g, "");

  // Remove common zero-width/invisible chars
  s = s.replace(/[\u200B-\u200F\u2060\uFEFF]/g, "");

  return s;
}

export function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Returns a safe query string for marketplace search.
 * - Normalizes Unicode
 * - Removes control/invisible chars
 * - Collapses whitespace
 * - Truncates
 *
 * It does NOT over-sanitize by removing useful characters.
 * Safety is enforced when encoding into URL params.
 */
export function safeQuery(input: unknown, maxLen = DEFAULT_QUERY_MAX_LEN): string {
  const raw = toStr(input);
  if (!raw) return "";

  const s = normalizeWhitespace(normalizeText(raw));
  if (!s) return "";

  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

/**
 * Encodes query for use in URL query params safely.
 * Always call this when placing user input into URLSearchParams or manual query strings.
 */
export function encodeQuery(input: unknown, maxLen = DEFAULT_QUERY_MAX_LEN): string {
  return encodeURIComponent(safeQuery(input, maxLen));
}

/**
 * Size fields are usually short and strictly formatted.
 * Keep conservative allowlist.
 */
export function safeSize(s: unknown): string {
  const v = normalizeWhitespace(normalizeText(toStr(s)));
  // allow digits, dot, slash, hyphen, letters, spaces
  const cleaned = v.replace(/[^0-9a-zA-Z.\-\/\s]/g, "").trim();
  return cleaned.slice(0, 16);
}

export function safeLocale(s: unknown): string {
  const v = normalizeWhitespace(normalizeText(toStr(s)));
  // e.g. en-US, de-DE
  const cleaned = v.replace(/[^a-zA-Z\-]/g, "").trim();
  return cleaned.slice(0, 12);
}

export function safeCountry(s: unknown): string {
  const v = normalizeWhitespace(normalizeText(toStr(s))).toUpperCase();
  const cleaned = v.replace(/[^A-Z]/g, "").trim();
  return cleaned.slice(0, 2);
}

/**
 * Safe string for query param values (non-query fields).
 * Normalizes, strips control/invisible, trims, and truncates.
 */
export function safeParamValue(v: unknown, maxLen = DEFAULT_VALUE_MAX_LEN): string {
  const s = normalizeWhitespace(normalizeText(toStr(v)));
  if (!s) return "";
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

/**
 * Strict URL validation for outgoing links (prevents javascript: / data: injection).
 */
export function isSafeHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && !!u.hostname;
  } catch {
    return false;
  }
}

/**
 * Build a safe HTTPS URL by combining a base URL and query params.
 * - Prevents protocol injection (requires https base)
 * - Encodes params safely
 * - Skips empty values
 *
 * Use this in marketplace providers to avoid broken links and injection.
 */
export function buildHttpsUrl(
  baseUrl: string,
  params: Record<string, unknown>,
  options?: {
    allowKeys?: string[];
    maxValueLen?: number;
  }
): string {
  if (!isSafeHttpsUrl(baseUrl)) {
    throw new Error("Unsafe baseUrl (must be https)");
  }

  const u = new URL(baseUrl);
  const allow = options?.allowKeys ? new Set(options.allowKeys) : null;
  const maxValueLen = options?.maxValueLen ?? DEFAULT_VALUE_MAX_LEN;

  for (const [k, v] of Object.entries(params)) {
    if (!k) continue;
    if (allow && !allow.has(k)) continue;

    const key = String(k).trim();
    if (!key) continue;

    const value = safeParamValue(v, maxValueLen);
    if (!value) continue;

    u.searchParams.set(key, value);
  }

  return u.toString();
}

/**
 * Safely append params to an existing https URL (preserves existing affiliate params).
 * Does not remove existing params unless overwritten by the same key.
 */
export function appendHttpsParams(
  url: string,
  params: Record<string, unknown>,
  options?: {
    allowKeys?: string[];
    maxValueLen?: number;
  }
): string {
  if (!isSafeHttpsUrl(url)) {
    throw new Error("Unsafe url (must be https)");
  }
  return buildHttpsUrl(url, params, options);
}

/**
 * Safe extraction helper: ensures we only accept string-like values.
 * Useful when reading input objects that may contain unknown.
 */
export function safeString(value: unknown): string | undefined {
  if (!isString(value)) return undefined;
  const v = normalizeWhitespace(normalizeText(value));
  return v.length ? v : undefined;
}
