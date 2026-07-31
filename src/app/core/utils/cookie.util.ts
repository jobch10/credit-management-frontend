export function setCookie(name: string, value: string, maxAgeSeconds: number, path = '/'): void {
  const encoded = encodeURIComponent(value);
  document.cookie = `${name}=${encoded}; Max-Age=${maxAgeSeconds}; Path=${path}; SameSite=None; Secure`;
}
export function getCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));

  if (!match) return null;
  return decodeURIComponent(match.split('=')[1] ?? '');
}

export function deleteCookie(name: string, path = '/'): void {
  document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax`;
}