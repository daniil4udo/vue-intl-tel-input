/* eslint-disable max-classes-per-file */

import { emojiFlagsSupport } from '@/assets/all-countries';
import { PHONE_TYPE, NUMBER } from '@/assets/constants';
import { isSupportedCountry } from '@/utils/';
import { Component, Prop, Mixins, Vue } from '@/utils/decorators';

import { IDropdowButton, PhoneNumberTypes, ParseMode } from '../components/models';

const hasList = p => (Array.isArray(p) ? p.length > 0 : (p instanceof Set ? p.size > 0 : null));

@Component
class DropdownProps extends Vue {
    @Prop({
        type: String,
        default: () => null,
    }) dropdownId: string;

    @Prop({
        type: Number,
        default: () => 0,
    }) dropdownTabIndex: number;

    @Prop({
        type: String,
        default: () => 'Search by country name, code or ISO',
    }) dropdownPlaceholder: string;

    @Prop({
        type: [ String, Number ],
        default: () => 400,
    }) dropdownHeight: string | number;

    @Prop({
        type: Array,
        validator: t => [ 'click', 'hover', 'contextmenu', 'focus' ].some(Array.prototype.includes.bind(t)),
        default: () => [ 'click' ],
    }) dropdownTriggers: string | number;

    @Prop({
        type: [ Boolean, Object ],
        default: () => false,
    }) hideCountryCode: boolean | IDropdowButton;

    @Prop({
        type: [ Boolean, Object ],
        default: () => false,
    }) hideCountryName: boolean | IDropdowButton;

    @Prop({
        type: [ Boolean, Object ],
        default: () => false,
    }) hideFlags: boolean | IDropdowButton;

    @Prop({
        type: [ Boolean, Object ],
        default: () => emojiFlagsSupport,
    }) emojiFlags: boolean | IDropdowButton;

    // whether or not to allow the dropdown
    @Prop({
        type: Boolean,
        default: () => false,
    }) disabledDropdown: boolean;

    @Prop({
        type: Boolean,
        default: () => true,
    }) fetchCountry: boolean;

    @Prop({
        type: String,
        validator: (iso2: string) => (iso2 !== '' ? isSupportedCountry(iso2) : true),
        default: () => '',
    }) defaultCountry: string;

    @Prop({
        type: [ Array, Set ],
        validator: (iso2: string[]) => (hasList(iso2) ? Array.from(iso2).some(isSupportedCountry) : true),
        default: () => [],
    }) onlyCountries: string[];

    @Prop({
        type: [ Array, Set ],
        validator: (iso2: string[]) => (hasList(iso2) ? Array.from(iso2).some(isSupportedCountry) : true),
        default: () => [],
    }) ignoredCountries: string[];

    @Prop({
        type: [ Array, Set ],
        validator: (iso2: string[]) => (hasList(iso2) ? Array.from(iso2).some(isSupportedCountry) : true),
        default: () => [],
    }) preferredCountries: string[] | Set<string>;
}

@Component
class InputProps extends Vue {
    @Prop({
        type: String,
        validator: (a: string) => [ 'on', 'off', 'tel' ].some(t => a.includes(t)),
        default: () => 'tel',
    }) autocomplete: string;

    @Prop({
        type: String,
        default: () => null,
    }) inputId: string;

    @Prop({
        type: Number,
        default: () => 0,
    }) inputTabIndex: number;

    @Prop({
        type: RegExp,
        default: () => null,
    }) customRegExp: RegExp;

    @Prop({
        type: Boolean,
        default: () => true,
    }) validCharactersOnly: boolean;

    @Prop({
        type: String,
        default: () => '5x xxx xxxx',
    }) inputPlaceholder: string;

    @Prop({
        type: String,
        validator: (type: PhoneNumberTypes[]) => PHONE_TYPE.some(t => type.includes(t)),
        default: () => 'mobile',
    }) placeholderNumberType: PhoneNumberTypes;

    @Prop({
        type: Boolean,
        default: () => true,
    }) dynamicPlaceholder: boolean;
}

@Component
export default class Props extends Mixins(DropdownProps, InputProps) {
    /**
     * Avoid using adding here native attts
     * already binding those via v-bind="$attrs"
     */

    // for v-model to work
    @Prop({
        type: [ String, Number ],
        default: () => '',
    }) value: string;
    // v-model

    @Prop({
        type: String,
        default: () => 'en',
    }) locale: string;

    @Prop({
        type: String,
        default: () => null,
    }) fieldId: string;

    // to show dial use 'international' mode
    @Prop({
        type: String,
        validator: (mode: ParseMode) => NUMBER.some(m => m === mode),
        default: () => 'national',
    }) mode: ParseMode;

    @Prop({
        type: Boolean,
        default: () => true,
    }) automaticFormatting: boolean;

    @Prop({
        type: Array,
        validator: (type: PhoneNumberTypes[]) => PHONE_TYPE.some(t => type.includes(t)),
        default: () => [ 'mobile', 'fixed-line', 'fixed-line-or-mobile' ],
    }) allowedPhoneTypes: PhoneNumberTypes[];

    @Prop({
        type: Boolean,
        default: () => false,
    }) required: boolean;

    // Date.now() will be appended to keep name unique for multiple instances
    @Prop({
        type: String,
        default: () => 'vue-intl-tel-input',
    }) name: string;

    @Prop({
        type: String,
        default: () => 'International Phone Input',
    }) label: string;

    @Prop({
        type: Boolean,
        default: () => false,
    }) disabled: boolean;

    @Prop({
        type: Boolean,
        default: () => true,
    }) isExpanded: boolean;

    @Prop({
        type: [ Boolean, String ],
        default: () => 'fade',
    }) errorAnimation: boolean | string;
}
