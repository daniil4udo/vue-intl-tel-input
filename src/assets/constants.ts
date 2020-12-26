import { Possibility, ParseMode, PhoneNumberTypes } from '@/components/models';

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
    'voicemail',
    'unknown',
];

export const NUMBER: ParseMode[] = [
    'input',
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
