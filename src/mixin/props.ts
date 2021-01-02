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
    }) dropdownId: Readonly<string>;

    @Prop({
        type: Number,
        default: () => 0,
    }) dropdownTabIndex: Readonly<number>;

    @Prop({
        type: String,
        default: () => 'Search by country name, code or ISO',
    }) dropdownPlaceholder: Readonly<string>;

    @Prop({
        type: [ String, Number ],
        default: () => 400,
    }) dropdownHeight: Readonly<string | number>;

    @Prop({
        type: Array,
        validator: t => [ 'click', 'hover', 'contextmenu', 'focus' ].some(Array.prototype.includes.bind(t)),
        default: () => [ 'click' ],
    }) dropdownTriggers: Readonly<string | number>;

    @Prop({
        type: [ Boolean, Object ],
        default: () => false,
    }) hideCountryCode: Readonly<boolean | IDropdowButton>;

    @Prop({
        type: [ Boolean, Object ],
        default: () => false,
    }) hideCountryName: Readonly<boolean | IDropdowButton>;

    @Prop({
        type: [ Boolean, Object ],
        default: () => false,
    }) hideFlags: Readonly<boolean | IDropdowButton>;

    @Prop({
        type: [ Boolean, Object ],
        default: () => emojiFlagsSupport,
    }) emojiFlags: Readonly<boolean | IDropdowButton>;

    // whether or not to allow the dropdown
    @Prop({
        type: Boolean,
        default: () => false,
    }) disabledDropdown: Readonly<boolean>;

    @Prop({
        type: Boolean,
        default: () => true,
    }) fetchCountry: Readonly<boolean>;

    @Prop({
        type: String,
        validator: (iso2: string) => (iso2 !== '' ? isSupportedCountry(iso2) : true),
        default: () => '',
    }) defaultCountry: Readonly<string>;

    @Prop({
        type: [ Array, Set ],
        validator: (iso2: string[]) => (hasList(iso2) ? Array.from(iso2).some(isSupportedCountry) : true),
        default: () => [],
    }) onlyCountries: Readonly<string[]>;

    @Prop({
        type: [ Array, Set ],
        validator: (iso2: string[]) => (hasList(iso2) ? Array.from(iso2).some(isSupportedCountry) : true),
        default: () => [],
    }) ignoredCountries: Readonly<string[]>;

    @Prop({
        type: [ Array, Set ],
        validator: (iso2: string[]) => (hasList(iso2) ? Array.from(iso2).some(isSupportedCountry) : true),
        default: () => [],
    }) preferredCountries: Readonly<string[] | Set<string>>;
}

@Component
class InputProps extends Vue {
    @Prop({
        type: String,
        validator: (a: string) => [ 'on', 'off', 'tel' ].some(t => a.includes(t)),
        default: () => 'tel',
    }) autocomplete: Readonly<string>;

    @Prop({
        type: String,
        default: () => null,
    }) inputId: Readonly<string>;

    @Prop({
        type: Number,
        default: () => 1,
    }) inputTabIndex: Readonly<number>;

    @Prop({
        type: RegExp,
        default: () => null,
    }) customRegExp: Readonly<RegExp>;

    @Prop({
        type: Boolean,
        default: () => true,
    }) validCharactersOnly: Readonly<boolean>;

    @Prop({
        type: String,
        default: () => '5x xxx xxxx',
    }) inputPlaceholder: Readonly<string>;

    @Prop({
        type: String,
        validator: (type: PhoneNumberTypes[]) => PHONE_TYPE.some(t => type.includes(t)),
        default: () => 'mobile',
    }) placeholderNumberType: Readonly<PhoneNumberTypes>;

    @Prop({
        type: Boolean,
        default: () => true,
    }) dynamicPlaceholder: Readonly<boolean>;
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
    }) value: Readonly<string>;
    // v-model

    @Prop({
        type: String,
        default: () => 'en',
    }) locale: Readonly<string>;

    @Prop({
        type: String,
        default: () => null,
    }) fieldId: Readonly<string>;

    // to show dial use 'international' mode
    @Prop({
        type: String,
        validator: (mode: ParseMode) => NUMBER.some(m => m === mode),
        default: () => 'national',
    }) mode: Readonly<ParseMode>;

    @Prop({
        type: Boolean,
        default: () => true,
    }) automaticFormatting: Readonly<boolean>;

    @Prop({
        type: Array,
        validator: (type: PhoneNumberTypes[]) => PHONE_TYPE.some(t => type.includes(t)),
        default: () => [ 'mobile', 'fixed-line', 'fixed-line-or-mobile' ],
    }) allowedPhoneTypes: Readonly<PhoneNumberTypes[]>;

    @Prop({
        type: Boolean,
        default: () => false,
    }) required: Readonly<boolean>;

    // Date.now() will be appended to keep name unique for multiple instances
    @Prop({
        type: String,
        default: () => 'vue-intl-tel-input',
    }) name: Readonly<string>;

    @Prop({
        type: String,
        default: () => 'International Phone Input',
    }) label: Readonly<string>;

    @Prop({
        type: Boolean,
        default: () => false,
    }) disabled: Readonly<boolean>;

    @Prop({
        type: Boolean,
        default: () => true,
    }) isExpanded: Readonly<boolean>;

    @Prop({
        type: [ Boolean, String ],
        default: () => 'fade',
    }) errorAnimation: Readonly<boolean | string>;
}
