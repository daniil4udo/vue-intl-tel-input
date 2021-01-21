import { toUpper } from '../toUpper';

import { isFlagEmoji } from './support';

const OFFSET = 127397;

export function isoToEmoji(iso2 = '') {
    // isSupportedCountry already performed

    // offset between uppercase ascii and regional indicator symbols

    return toUpper(iso2).replace(/./g, (char = '') => String.fromCodePoint(char.charCodeAt(0) + OFFSET));
}
export function emojiToISO(emoji = '') {
    if (!isFlagEmoji(emoji)) {
        return null;
    }

    return emoji.replace(/../g, (cp = '') => String.fromCharCode(cp.codePointAt(0) - OFFSET));
}
