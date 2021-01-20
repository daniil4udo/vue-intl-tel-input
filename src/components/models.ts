export interface IDropdowButton {
    button: boolean;
    dropdown: boolean;
}

export interface IEmojiCountry {
    flag?: string;
    supported?: boolean;
}
export interface ICountry {
    name: string;
    name_en: string;
    name_local: string;
    iso2: string;
    dialCode: string;
    priority: number;
    areaCodes: string[];
    preferred?: boolean;
    lastPreffered?: boolean;
    emoji: IEmojiCountry;
}

export interface INumber {
    input: string;
    international: string;
    national: string;
    e164: string;
    rfc3966: string;
    significant: string;
}
export interface IPhoneObject {
    number: INumber;
    regionCode: string;
    valid: boolean;
    possible: boolean;
    canBeInternationallyDialled: boolean;
    type: PhoneNumberTypes;
    possibility: Possibility;
    isIntlInput: boolean;
    country: ICountry;
}

export type ParseMode = Exclude<keyof INumber, 'input'>

export type Possibility =
    | 'unknown'
    | 'is-possible'
    | 'invalid-country-code'
    | 'too-long'
    | 'too-short';

export type CustomPossibility =
    | 'no-country-change'
    | 'invalid-phone-type';

export type PhoneNumberTypes =
    | 'fixed-line'
    | 'fixed-line-or-mobile'
    | 'mobile'
    | 'pager'
    | 'personal-number'
    | 'premium-rate'
    | 'shared-cost'
    | 'toll-free'
    | 'uan'
    | 'voip'
    | 'unknown'

export type DropdowPosition =
    | 'is-top-right'
    | 'is-top-left'
    | 'is-bottom-left'
    | 'is-bottom-right'
