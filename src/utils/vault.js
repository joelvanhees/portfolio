import { VAULT } from './vaultData';

// A door without a sign.
//
// Nothing here knows the way in. vaultData.js holds salts and AES-GCM
// ciphertexts; whatever a visitor types is stretched with PBKDF2 and tried as a
// key. Right input, the ciphertext opens and names an address plus the key for
// the sealed page behind it. Wrong input, decryption fails and there is
// nothing to compare against, so the source cannot be read for the answer.
//
// Normalising first keeps the door forgiving where it should be: case,
// spaces, a leading slash and doubled letters in a typed answer do not matter.

const enc = new TextEncoder();
const bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export const normCommand = (s) => s.toLowerCase().replace(/[^a-z0-9äöüß]/g, '');
export const normAnswer = (s) =>
  s.toLowerCase().replace(/[^a-z0-9äöüß]/g, '').replace(/([a-zäöüß])\1+/g, '$1');

const open = async (entry, secret) => {
  if (!entry || !secret || !window.crypto?.subtle) return null;
  try {
    const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt: bytes(entry.s), iterations: entry.n },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(entry.i) }, key, bytes(entry.c));
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    return null;
  }
};

// Only long, single-word slash commands are worth the key stretching. Every
// ordinary command stays instant; the shape gives nothing away.
export const mightOpen = (raw) => /^\/\S{12,}$/.test(raw.trim());

export const tryCommand = (raw) => open(VAULT.cmd, normCommand(raw));
export const tryPassword = (pw) => open(VAULT.pw, normAnswer(pw));
export const tryAnswer = (pw, answer) => open(VAULT.qa, `${normAnswer(pw)}|${normAnswer(answer)}`);

// The key travels in sessionStorage: same origin, gone with the tab, never in
// a URL, a referrer or a server log.
export const walkThrough = (door) => {
  sessionStorage.setItem('jvh.lh', door.k);
  window.location.assign(door.p);
};
