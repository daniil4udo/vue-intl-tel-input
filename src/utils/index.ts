import PhoneNumber from 'awesome-phonenumber';
import { PropertyPath } from 'lodash';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import _uniqBy from 'lodash/uniqBy';

import { IPhoneObject, DropdowPosition } from '../components/models';

export function isDefined<T>(v: T) {
    return !_isNil(v);
}

export function has<T>(o: T, key: PropertyPath) {
    return _has(o, key);
}

export type AllTypes = 'primitive' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'null' | 'undefined' | 'object' | 'array' | 'arguments' | 'buffer' | 'function' | 'generatorfunction' | 'map' | 'weakmap' | 'set' | 'weakset' | 'regexp' | 'date';
export function toType<T>(val: T): AllTypes {
    return {}.toString
        .call(val)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
}
/**
 * So user can add custom validation message base on phone Object :)
 * @returns {String} - either generic string or object with keys are posibilities and values are String
 */
export function validationMessage(phoneData: IPhoneObject) {
    if (phoneData && phoneData.possibility && phoneData.country.name_en) {
        const template = `Phone number error: ${phoneData.possibility.replaceAll('-', ' ')} for ${phoneData.country.name_en}`;

        switch (phoneData.possibility) {
            case 'invalid-country-code': return template;
            case 'too-long': return template;
            case 'too-short': return template;
        }

        return `Phone number error: invalid phone for ${phoneData.country.name_en}`;
    }

    // Most probable scenario that at this pooint we dont have country setted yet
    return 'Phone number error: country is unknown';
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

const supported = PhoneNumber.getSupportedRegionCodes().reduce((a, c) => ({ ...a, [c]: c }), {} as Record<string, string>);
export function isSupportedCountry(iso2 = '') {
    if (!isCorrectISO(iso2) || !has(supported, iso2.toUpperCase())) {
        throw new TypeError(`[isCorrectISO]: iso2 country ${iso2} is not supported by awesome-phonenumber`);
    }

    return true;
}

export function getBoolean<T>(prop: T, path: string): boolean {
    return typeof prop === 'boolean'
        ? prop
        : _get(prop, path, false);
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
        const response = await fetch('https://ip2c.org/s');
        const responseText = await response.text();
        const result = String(responseText || '').toUpperCase();

        if (result && result[0] === '1') {
            return result.substr(2, 2);
        }
    }
    catch (err) {
        throw new Error('[fetchISO]: Error while fetching country code');
    }
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

export function strEncodeUTF16(str = '') {
    const arr: number[] = [];
    for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
    }

    return arr;
}

export { isMobile } from 'buefy/src/utils/helpers';
export {
    _isEmpty as isEmpty,
    _uniqBy as uniqBy,
};
