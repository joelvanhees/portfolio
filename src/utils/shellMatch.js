/*
 * Intent matching for the shell.
 *
 * The previous version tested `input.includes('ort')` and friends, which is
 * why "portfolio" answered with the location, "build" with the Figma essay,
 * "display" with the game and "answer" with the profile. Anything not spelled
 * exactly like a command fell through to an error, so "hilfe", "projekte" and
 * "tell me about yourself" all failed.
 *
 * This works on whole words instead:
 *   - a phrase found in the input scores highest,
 *   - then an exact word,
 *   - then a word that starts with the term,
 *   - then a word within one or two edits of it, which covers typos.
 * The best-scoring intent wins, so the order they are declared in no longer
 * decides the answer. Below the threshold nothing is guessed; the closest
 * candidates are offered instead.
 *
 * No model involved: for a fixed set of topics this resolves in well under a
 * millisecond, works offline, and cannot fail or cost anything.
 */

const FOLD = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss', á: 'a', à: 'a', é: 'e', è: 'e' };

export const normalise = (text) =>
  text
    .toLowerCase()
    .replace(/[äöüßáàéè]/g, (c) => FOLD[c] ?? c)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Words too common to carry intent; counting them would let a long question
// out-score a precise one.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'do', 'does', 'did', 'you', 'your', 'me', 'my', 'i', 'it', 'to', 'of',
  'for', 'and', 'or', 'in', 'on', 'at', 'can', 'could', 'would', 'what', 'how', 'who', 'tell', 'show',
  'give', 'about', 'more', 'some', 'any', 'please', 'hast', 'habe', 'hab', 'ich', 'du', 'dir', 'dich',
  'mir', 'mich', 'der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'einen', 'und', 'oder', 'ist', 'sind',
  'kann', 'kannst', 'was', 'wie', 'mal', 'bitte', 'mir', 'zu', 'von', 'fuer', 'auf', 'es', 'sie', 'er',
]);

// Distance capped at `max`: anything further is not a typo, it is a different
// word, and computing the exact figure would be wasted work.
//
// Adjacent transpositions count as one edit, not two — "abuot" for "about" is
// the single commonest way a fast typist misses, and plain Levenshtein rates
// it as far from the target as a word with two unrelated letters wrong.
const withinEdits = (a, b, max) => {
  if (Math.abs(a.length - b.length) > max) return false;
  let twoBack = null;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        row[j] = Math.min(row[j], twoBack[j - 2] + 1);
      }
      best = Math.min(best, row[j]);
    }
    if (best > max) return false;
    twoBack = previous;
    previous = row;
  }
  return previous[b.length] <= max;
};

const typoAllowance = (term) => (term.length >= 7 ? 2 : term.length >= 5 ? 1 : 0);

const scoreTerm = (term, words, phrase) => {
  if (term.includes(' ')) return phrase.includes(term) ? 6 : 0;
  let best = 0;
  for (const word of words) {
    if (word === term) return 4;
    if (term.length >= 4 && (word.startsWith(term) || term.startsWith(word))) best = Math.max(best, 2.5);
    else {
      const allowance = typoAllowance(term);
      // Worth 2, not 1.5: a one-word input whose only signal is a misspelling
      // ("contct", "abuot") has to be able to clear the threshold on its own.
      if (allowance && withinEdits(word, term, allowance)) best = Math.max(best, 2);
    }
  }
  return best;
};

/**
 * @returns {{ intent, score, suggestions }} — `intent` is null when nothing
 * clears the threshold, in which case `suggestions` holds the nearest ids.
 */
export const matchIntent = (rawInput, intents, { threshold = 2.5 } = {}) => {
  const phrase = normalise(rawInput);
  // A word that names a command is never filler, whatever the stopword list
  // says. Without this "about joel" drops the word "about" and answers with
  // the profile — which is the exact thing that made the shell feel broken.
  const commands = new Set(intents.map((i) => i.id));
  const words = phrase.split(' ').filter((w) => w && (commands.has(w) || !STOPWORDS.has(w)));
  // An input of nothing but stopwords still deserves its own words back.
  const pool = words.length ? words : phrase.split(' ').filter(Boolean);

  const ranked = intents
    .map((intent) => {
      let score = 0;
      for (const term of intent.terms) score += scoreTerm(term, pool, phrase);
      // A single decisive hit should beat a scatter of weak ones.
      const peak = Math.max(0, ...intent.terms.map((t) => scoreTerm(t, pool, phrase)));
      // "about" and "joel" describe the whole site, so they match nearly any
      // question and would otherwise tie with the topic actually being asked
      // for — "tell me about instagram" would answer with the manifesto. A
      // broad intent still wins when it is the only thing that matched.
      const specificity = intent.broad ? 0.85 : 1;
      return { intent, score: (score * 0.5 + peak) * specificity };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  if (top && top.score >= threshold) return { intent: top.intent, score: top.score, suggestions: [] };
  return {
    intent: null,
    score: top?.score ?? 0,
    suggestions: ranked.slice(0, 3).map((r) => r.intent.id),
  };
};

export default matchIntent;
