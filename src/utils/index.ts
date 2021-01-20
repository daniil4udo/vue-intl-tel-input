import { isEmpty } from 'lodash';

import { SUPPORTED_ISO } from '@/assets/constants';

import { DropdowPosition } from '../components/models';

export {
    isEmpty,
};

export function isDefined<T>(v: T) {
    return v != null;
}

export function has<T>(o: T, key: string) {
    return isDefined(o) && Object.prototype.hasOwnProperty.call(o, key);
}

export function toUpper(str: string | number) {
    return str.toString().toUpperCase() || '';
}

export function createUniqueArray(a?: readonly any[]) {
    return !isEmpty(a)
        ? Array.from(new Set(a.map(toUpper)))
        : [];
}

/**
 * Check if input is looks like ISO2 – 2 letters (case insensetive)
 * @param iso2 {String}
 */
export function isCorrectISO(iso2 = '') {
    // country code regex
    const ISO_REGEX = /^[a-z]{2}$/i;
    const type = typeof iso2;

    if (!ISO_REGEX.test(iso2)) {
        throw new TypeError(`[isCorrectISO]: iso2 argument must be an ISO 3166-1 alpha-2 String. Got '${type === 'string' ? iso2 : type}'`);
    }

    return true;
}

export function isSupportedCountry(iso2 = '') {
    if (!isCorrectISO(iso2) || !has(SUPPORTED_ISO, toUpper(iso2))) {
        throw new TypeError(`[isCorrectISO]: iso2 country ${iso2} is not supported by awesome-phonenumber`);
    }

    return true;
}

export function getBool<T>(prop: T, path: string): boolean {
    return typeof prop === 'boolean' ? prop : !!prop[path];
}

export function isLocalStorageAccessSafe() {
    const TEST_KEY = 'isLocalStorageAccessSafe';
    const TEST_VALUE = 'true';

    try {
        localStorage.setItem(TEST_KEY, TEST_VALUE);
        localStorage.removeItem(TEST_KEY);

        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)
 */
export async function fetchISO() {
    try {
        const result = await (await fetch('https://ip2c.org/s')).text();

        if (result && result[0] === '1') {
            return toUpper(result.substr(2, 2));
        }
    }
    catch (err) {
        throw new Error('[fetchISO]: Error while fetching country code');
    }
}

export async function getBowserLocale() {
    const navigator = window.navigator || window.clientInformation;

    const languageList: string[] = [];

    if (navigator.languages) {
        languageList.push(...navigator.languages);
    }
    if (navigator.language) {
        languageList.push(navigator.language);
    }
    if (navigator.userLanguage) {
        languageList.push(navigator.userLanguage);
    }
    if (navigator.browserLanguage) {
        languageList.push(navigator.browserLanguage);
    }
    if (navigator.systemLanguage) {
        languageList.push(navigator.systemLanguage);
    }

    const [ lang, iso ]: string[] = (languageList.find(l => l.includes('-')) || '').split('-');

    if (iso) {
        return iso.toUpperCase();
    }
    // fallback to US country
    if (lang && lang.toLowerCase() === 'en') {
        return 'GB';
    }

    return null;
}

/**
 * Buefy specific - dynamicly changes position of the dropdown depending on how close it to the bottom of the page
 * @param el {HTMLElement}
 * @param minOffset {Number}
 */
export function getDropdownPosition(el: HTMLElement, minOffset = 200): DropdowPosition {
    const spaceBelow = window.innerHeight - el.getBoundingClientRect().bottom;

    return spaceBelow > minOffset
        ? 'is-bottom-right'
        : 'is-top-right';
}

export function setCaretPosition(ctrl: HTMLInputElement, pos: number) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
}
