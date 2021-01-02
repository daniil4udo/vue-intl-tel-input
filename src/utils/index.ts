import { SUPPORTED_ISO } from '@/assets/constants';

import { DropdowPosition, ICountry } from '../components/models';

export function isDefined<T>(v: T) {
    return v != null;
}

export function has<T>(o: T, key: string) {
    return isDefined(o) && Object.prototype.hasOwnProperty.call(o, key);
}

export function keyByIso(countriesArr: string[], getterfn, preferred = false) {
    const m: Map<string, ICountry> = new Map();
    const c = [ ...new Set(countriesArr) ];

    for (let i = 0; i < c.length; i++) {
        const countryData = getterfn(countriesArr[i]);

        if (isDefined(countryData)) {
            if (preferred) {
                const isLastIndex = (j: number) => (countriesArr.length - 1) === j;

                Object.assign(countryData, {
                    preferred: true,
                    lastPreffered: isLastIndex(i),
                });
            }

            m.set(countriesArr[i], countryData);
        }
    }

    return m;
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
    if (!isCorrectISO(iso2) || !has(SUPPORTED_ISO, iso2.toUpperCase())) {
        throw new TypeError(`[isCorrectISO]: iso2 country ${iso2} is not supported by awesome-phonenumber`);
    }

    return true;
}

export function getBooleanProp<T>(prop: T, path: string): boolean {
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
        const responseText = await (await fetch('https://ip2c.org/s')).text();
        const result = String(responseText || '').toUpperCase();

        if (result && result[0] === '1') {
            return result.substr(2, 2).toUpperCase();
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
