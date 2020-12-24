export interface IDropdowButton {
    button: boolean;
    dropdown: boolean;
}

export interface IProps extends IInputProps, IDropdownProps {
    value?: string;
    mode?: '' | 'international' | 'national';
    allowedPhoneTypes?: AllowedPhoneNumberTypes;
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

export interface IPhoneObject {
    number: {
        input: string;
        international: string;
        national: string;
        e164: string;
        rfc3966: string;
        significant: string;
    };
    regionCode: string;
    valid: boolean;
    isIntlInput: boolean;
    possible: boolean;
    canBeInternationallyDialled: boolean;
    type: PhoneNumberTypes;
    possibility: string;
    country: ICountry;
}

export type ParseMode = 'input' | 'international' | 'national' | 'e164' | 'rfc3966' | 'significant'
export type PhoneNumberTypes = 'fixed-line' | 'mobile' | 'fixed-line-or-mobile' | 'toll-free' | 'premium-rate' | 'shared-cost' | 'voip' | 'personal-number' | 'pager' | 'uan' | 'voicemail' | 'unknown'
export type AllowedPhoneNumberTypes = Array<PhoneNumberTypes>;
export type DropdowPosition = 'is-top-right' | 'is-top-left' | 'is-bottom-left' | 'is-bottom-right'

export interface ITodo {
  id: number;
  content: string;
}
export interface IMeta {
  totalCount: number;
}
