import { useEffect, useRef, useState } from 'react';
import { tryAnswer, tryPassword, walkThrough } from '../utils/vault';

// The vault behind the portrait. Two locks, typed like a terminal: a code,
// then a question only a few people can answer. The question itself is sealed
// under the code, so it does not show up anywhere until the code is right.

const ACID = '#C7FF2E';

const VaultConsole = ({ onClose }) => {
  const [lines, setLines] = useState(['TRESOR // ZUGRIFF ANGEFORDERT', 'Code eingeben.']);
  const [step, setStep] = useState('code');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const code = useRef('');
  const tries = useRef(0);
  const field = useRef(null);

  useEffect(() => {
    field.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!busy) field.current?.focus();
  }, [busy, step]);

  const say = (...next) => setLines((prev) => [...prev, ...next]);

  const deny = () => {
    tries.current += 1;
    setShake(true);
    setTimeout(() => setShake(false), 420);
    if (tries.current >= 3) {
      say('ZUGRIFF VERWEIGERT. Verbindung getrennt.');
      setTimeout(onClose, 1400);
      return;
    }
    say('ZUGRIFF VERWEIGERT.');
  };

  const submit = async (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || busy) return;
    setInput('');
    setBusy(true);

    if (step === 'code') {
      say(`> ${'•'.repeat(value.length)}`, 'Prüfe …');
      const sealed = await tryPassword(value);
      if (sealed) {
        code.current = value;
        tries.current = 0;
        say('Code akzeptiert. Stufe 2 von 2.', sealed.q);
        setStep('answer');
      } else {
        deny();
      }
    } else {
      say(`> ${value}`, 'Entschlüssele …');
      const door = await tryAnswer(code.current, value);
      if (door) {
        say('ZUGRIFF GEWÄHRT.');
        setStep('open');
        setTimeout(() => walkThrough(door), 900);
        return;
      }
      deny();
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-label="Tresor">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-2xl border bg-black p-5 font-meta text-[12px] leading-relaxed"
        style={{
          borderColor: `${ACID}55`,
          color: ACID,
          boxShadow: `0 0 40px ${ACID}22`,
          transform: shake ? 'translateX(6px)' : 'none',
          transition: 'transform 70ms',
        }}
      >
        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-wider opacity-60">
          <span>/ VAULT.SYS</span>
          <button type="button" onClick={onClose} className="px-2 py-1 hover:opacity-60" aria-label="Schließen">[ ESC ]</button>
        </div>
        <div className="mb-3 min-h-[120px] whitespace-pre-wrap">
          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          {busy && step !== 'open' && <div className="animate-pulse">▌</div>}
        </div>
        {step !== 'open' && (
          <label className="flex items-center gap-2 border-t pt-3" style={{ borderColor: `${ACID}33` }}>
            <span className="opacity-60">{step === 'code' ? 'CODE' : 'ANTWORT'} &gt;</span>
            <input
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type={step === 'code' ? 'password' : 'text'}
              inputMode={step === 'code' ? 'numeric' : 'text'}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="send"
              disabled={busy}
              className="min-w-0 flex-1 bg-transparent py-2 text-[16px] outline-none placeholder:opacity-30"
              style={{ color: ACID, caretColor: ACID }}
              aria-label={step === 'code' ? 'Code' : 'Antwort'}
            />
            {/* The numeric keypad on phones has no return key, so the form needs
                a button of its own. */}
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="shrink-0 rounded-lg border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-opacity active:scale-95 disabled:opacity-30"
              style={{ borderColor: ACID, color: ACID }}
            >
              Senden ↵
            </button>
          </label>
        )}
      </form>
    </div>
  );
};

export default VaultConsole;
