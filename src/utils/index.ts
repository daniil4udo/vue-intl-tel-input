import get from 'lodash/get';

import { IPhoneObject } from '../components/models';

/**
 * So user can add custom validation message base on phone Object :)
 * @returns {String} - either generic string or object with keys are posibilities and values are String
 */
export function validationMessage(phoneObject: IPhoneObject): string {
    if (phoneObject && phoneObject.possibility && phoneObject.country.name_en) {
        const template = `Phone number error: ${phoneObject.possibility.replaceAll('-', ' ')} for ${phoneObject.country.name_en}`;

        switch (phoneObject.possibility) {
            case 'invalid-country-code': return template;
            case 'too-long': return template;
            case 'too-short': return template;
        }

        return `Phone number error: invalid phone for ${phoneObject.country.name_en}`;
    }

    // Most probable scenario that at this pooint we dont have country setted yet
    return 'Phone number error: country is unknown';
}

export function isCorrectISO(iso2 = '') {
    // country code regex
    const ISO_REGEX = /^[a-z]{2}$/i;

    if (!ISO_REGEX.test(iso2)) {
        const type = typeof iso2;
        throw new TypeError(`[isCorrectISO]: iso2 argument must be an ISO 3166-1 alpha-2 String. Got '${type === 'string' ? iso2 : type}'`);
    }

    return true;
}

export function getBoolean(prop, key: string): boolean {
    return typeof prop === 'boolean'
        ? prop
        : get(prop, key, false);
}

function isPropertyAccessSafe(base, property) {
    let safe;

    try {
        safe = !!base[property];
    }
    catch (error) {
        safe = false;
    }

    return safe;
}

function isFunctionCallSafe(base, functionName, ...args) {
    let safe = true;

    try {
        base[functionName](...args);
    }
    catch (error) {
        safe = false;
    }

    return safe;
}

export function isLocalStorageAccessSafe() {
    let safe;

    const TEST_KEY = 'isLocalStorageAccessSafe';
    const TEST_VALUE = 'true';

    safe = isPropertyAccessSafe(window, 'localStorage');
    if (!safe) return safe;

    safe = isFunctionCallSafe(window.localStorage, 'setItem', TEST_KEY, TEST_VALUE);

    if (safe) window.localStorage.removeItem(TEST_KEY);

    return safe;
}

/**
 * Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)
 */
export async function fetchISO() {
    try {
        const response = await fetch('https://ip2c.org/s');
        const responseText = await response.text();
        const result = String(responseText || '').toUpperCase();
        if (result && result[0] === '1') {
            return result.substr(2, 2);
        }
    }
    catch (err) {
        throw new Error('DmcTelInput: Error while fetching country code');
    }
}
