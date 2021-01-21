import { SUPPORTED_ISO } from '@/assets/constants';

import { has } from './has';
import { toUpper } from './toUpper';
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
