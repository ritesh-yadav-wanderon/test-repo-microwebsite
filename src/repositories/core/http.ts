// Transport for every repository. Nothing outside this folder should call
// `fetch` directly, so timeouts, error shapes and JSON handling stay uniform.

interface GetOptions {
  timeout?: number;
}

/** GET a JSON document. Aborts slow responses instead of hanging the UI. */
export async function getJSON(url: string, { timeout = 9000 }: GetOptions = {}): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

/** POST a JSON body and read the JSON reply. */
export async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return json as T;
}

/** Narrowing helper for walking untyped API payloads. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
