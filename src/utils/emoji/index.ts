import { isSupportedCountry, toUpper } from '@/utils/';

import isEmojiUnicodeSupported, { isFlagEmoji } from './support';

const OFFSET = 127397;

export function isoToEmoji(iso2 = '') {
    if (!isSupportedCountry(iso2)) {
        return null;
    }
    // offset between uppercase ascii and regional indicator symbols
    const emojiGetter = (char = '') => String.fromCodePoint(char.charCodeAt(0) + OFFSET);

    return toUpper(iso2).replace(/./g, emojiGetter);
}
export function emojiToISO(emoji = '') {
    if (!isFlagEmoji(emoji)) {
        return null;
    }
    const isoGetter = (cp = '') => String.fromCharCode(cp.codePointAt(0) - OFFSET);

    return emoji.replace(/../g, isoGetter);
}

export {
    isEmojiUnicodeSupported,
};
export * from './support';
