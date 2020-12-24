import { IResultMap } from '../types';

import getUnicodeSupportMap from './unicode_support_map';

let browserUnicodeSupportMap: IResultMap;

// On Windows, flags render as two-letter country codes, see http://emojipedia.org/flags/
export function isFlagEmoji(emojiUnicode: string) {
    const flagACodePoint = 127462; // parseInt('1F1E6', 16)
    const flagZCodePoint = 127487; // parseInt('1F1FF', 16)

    const cp = emojiUnicode.codePointAt(0);
    // Length 4 because flags are made of 2 characters which are surrogate pairs
    return emojiUnicode.length === 4 && (cp >= flagACodePoint) && (cp <= flagZCodePoint);
}

// Tested on mac OS 10.12.6 and Windows 10 FCU, it renders as two separate characters
export function isRainbowFlagEmoji(emojiUnicode: string) {
    const baseFlagCodePoint = 127987; // parseInt('1F3F3', 16)
    const rainbowCodePoint = 127752; // parseInt('1F308', 16)

    const characters = Array.from(emojiUnicode);
    // Length 4 because flags are made of 2 characters which are surrogate pairs
    return emojiUnicode.length === 4
    && characters[0].codePointAt(0) === baseFlagCodePoint
    && characters[1].codePointAt(0) === rainbowCodePoint;
}

// Chrome <57 renders keycaps oddly
// See https://bugs.chromium.org/p/chromium/issues/detail?id=632294
// Same issue on Windows also fixed in Chrome 57, http://i.imgur.com/rQF7woO.png
export function isKeycapEmoji(emojiUnicode: string) {
    return emojiUnicode.length === 3 && emojiUnicode[2] === '\u20E3';
}

// Helper so we don't have to run `isFlagEmoji` twice
// in `isEmojiUnicodeSupported` logic
export function checkFlagEmojiSupport(unicodeSupportMap: IResultMap, emojiUnicode: string) {
    const isFlagResult = isFlagEmoji(emojiUnicode);
    const isRainbowFlagResult = isRainbowFlagEmoji(emojiUnicode);
    return (
        (unicodeSupportMap.flag && isFlagResult)
        || (unicodeSupportMap.rainbowFlag && isRainbowFlagResult)
        || (!isFlagResult && !isRainbowFlagResult)
    );
}

// Takes in a support map and determines whether
// the given unicode emoji is supported on the platform.
//
// Combines all the edge case tests into a one-stop shop method
export default function isEmojiUnicodeSupported(emojiUnicode: string, unicodeVersion = 'flag') {
    browserUnicodeSupportMap = browserUnicodeSupportMap || getUnicodeSupportMap();

    const isOlderThanChrome57 = browserUnicodeSupportMap
        && browserUnicodeSupportMap.meta
        && browserUnicodeSupportMap.meta.isChrome
        && browserUnicodeSupportMap.meta.chromeVersion < 57;

    // For comments about each scenario, see the comments above each individual respective function
    return browserUnicodeSupportMap[unicodeVersion]
        && !(isOlderThanChrome57 && isKeycapEmoji(emojiUnicode))
        && checkFlagEmojiSupport(browserUnicodeSupportMap, emojiUnicode);
}
