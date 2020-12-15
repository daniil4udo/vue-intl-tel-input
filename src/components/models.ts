export interface IDropdowButton {
    button: boolean;
    dropdown: boolean;
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
export interface IProps extends IInputProps, IDropdownProps {
    value?: string;
    mode?: '' | 'international' | 'national';
    required?: boolean;
    name?: string;
    invalidMsg?: string;
    disabled?: boolean;
}

export interface ICountry {
    name: string;
    enname: string;
    iso2: string;
    dialCode: string;
    priority: number;
    areaCodes: string[] | null;
    emoji: string;
    unicode: string;
    preferred?: boolean;
    lastPreffered?: boolean;
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
    possible: boolean;
    canBeInternationallyDialled: boolean;
    type: string;
    possibility: string;
    country: ICountry;
}

export type ParseMode = 'input' | 'international' | 'national' | 'e164' | 'rfc3966' | 'significant'
export type DropdowPosition = 'auto' | 'top' | 'bottom'

export interface ITodo {
  id: number;
  content: string;
}

export interface IMeta {
  totalCount: number;
}
