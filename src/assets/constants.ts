import PhoneNumber from 'awesome-phonenumber';

import { Possibility, CustomPossibility, ParseMode, PhoneNumberTypes } from '@/components/models';

export const PHONE_TYPE: PhoneNumberTypes[] = [
    'fixed-line',
    'mobile',
    'fixed-line-or-mobile',
    'toll-free',
    'premium-rate',
    'shared-cost',
    'voip',
    'personal-number',
    'pager',
    'uan',
    'unknown',
];

export const NUMBER: ParseMode[] = [
    // 'input',
    'international',
    'national',
    'e164',
    'rfc3966',
    'significant',
];

export const POSIBILITY: Possibility[] = [
    'unknown',
    'is-possible',
    'invalid-country-code',
    'too-long',
    'too-short',
];

// https://en.wikipedia.org/wiki/List_of_North_American_Numbering_Plan_area_codes#Non-geographic_area_codes
export const REGIONLESS_NANP_NUMBERS = [ '800', '822', '833', '844', '855', '866', '877', '880', '881', '882', '883', '884', '885', '886', '887', '888', '889' ];

// Test string for first '+' or first two '0's
export const INTL = new RegExp(/^(0{2}|\+)/);

export const VALID_CHAR = new RegExp(/^[\+]?[()\-\d\s]*$/);

export const SUPPORTED_ISO = PhoneNumber.getSupportedRegionCodes().reduce((a, c) => ({ ...a, [c]: c }), {} as Record<string, string>);

// TODO: use i18n later
export const VALIDATION_MESSAGES: Record<Possibility | CustomPossibility, string> = {
    // lib
    'unknown': 'Country is unknown',
    'invalid-country-code': 'Invalid country code',
    'too-long': 'Phone is too long',
    'too-short': 'Phone is too short',
    // custom
    'no-country-change': 'Country change is not allowed',
    'invalid-phone-type': 'Not permitted phone type',
    // default
    'is-possible': 'Phone is invalid',
};
