/**
 * Parser cookie sederhana sebagai pengganti `cookie-parser`.
 *
 * Dipakai hanya untuk membaca cookie auth (access_token & refresh_token) yang
 * nilainya berupa JWT, sehingga tidak butuh penanganan signed cookie.
 */
export function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (header === undefined) return cookies;

  for (const part of header.split(";")) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) continue;

    const name = part.slice(0, separatorIndex).trim();
    if (name === "") continue;

    const rawValue = part.slice(separatorIndex + 1).trim();

    try {
      cookies[name] = decodeURIComponent(rawValue);
    } catch {
      cookies[name] = rawValue;
    }
  }

  return cookies;
}
