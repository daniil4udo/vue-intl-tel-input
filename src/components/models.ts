export interface IDropdowButton {
    button: boolean;
    dropdown: boolean;
}

export interface IProps extends IInputProps, IDropdownProps {
    value?: string;
    mode?: keyof INumber;
    allowedPhoneTypes?: PhoneNumberTypes[];
    required?: boolean;
    name?: string;
    invalidMsg?: string;
    disabled?: boolean;
}
export interface IDropdownProps {
    dropdownTabIndex?: number;
    dropdownPlaceholder?: string;
    hideCountryCode?: boolean | IDropdowButton;
    hideCountryName?: boolean | IDropdowButton;
    hideFlags?: boolean | IDropdowButton;
    emojiFlags?: boolean | IDropdowButton;
    disabledDropdown?: boolean;
    fetchCountry?: boolean;
    defaultCountry?: string;
    onlyCountries?: string[];
    ignoredCountries?: string[];
    preferredCountries?: string[];
}
export interface IInputProps {
    inputTabIndex?: number;
    customRegExp?: RegExp;
    validCharactersOnly?: boolean;
    inputPlaceholder?: string;
    dynamicPlaceholder?: boolean;
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
    areaCodes: string | number | string[];
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
    isIntlInput: boolean;
    possible: boolean;
    canBeInternationallyDialled: boolean;
    type: PhoneNumberTypes;
    possibility: Possibility;
    country: ICountry;
}

export type Possibility =
    | 'unknown'
    | 'is-possible'
    | 'invalid-country-code'
    | 'too-long'
    | 'too-short';
export type ParseMode =
    // | 'input'
    | 'e164'
    | 'international'
    | 'national'
    | 'rfc3966'
    | 'significant'
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
