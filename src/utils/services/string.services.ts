import badWords from "@assets/content/badwords";

const leetMap: Record<string, string> = {
  '4': 'a', '@': 'a',
  '0': 'o',
  '1': 'i', '!': 'i',
  '3': 'e', '€': 'e',
  '$': 's', '5': 's',
  '7': 't'
};

const normalizeForBadword = (word: string): string => {
  return word
    .toLowerCase()
    .split('')
    .map(ch => leetMap[ch] ?? ch)
    .join('')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')
    .replace(/(.)\1+/g, '$1');
};

const stringService = {
  normalizeString: (str: string): string =>
    str.trim().replace(/\s+/g, ' ').toLowerCase(),

  capitalizeFirstLetters: (str: string): string =>
    str
      .toLowerCase()
      .replace(/(^|\.\s*)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase()),

  removeSpacesAndLowerCase: (str: string): string =>
    str.replace(/\s+/g, '').toLowerCase(),

  filterBadwords: (str: string): string => {
    return str
      .split(/(\b)/)
      .map(token => {
        const cleaned = token.replace(/[^\wÀ-ÿ]/g, '');
        const norm = normalizeForBadword(cleaned);
        if (norm && badWords.includes(norm)) {
          return '*'.repeat(token.length);
        }
        return token;
      })
      .join('');
  },

  containsBadwords: (str: string): boolean => {
    return str
      .split(/(\b)/)
      .some(token => {
        const cleaned = token.replace(/[^\wÀ-ÿ]/g, '');
        const norm = normalizeForBadword(cleaned);
        return Boolean(norm && badWords.includes(norm));
      });
  }
};

export default stringService;
