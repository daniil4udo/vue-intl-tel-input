/* eslint-disable max-classes-per-file */

import { Component, Prop, Mixins, Vue } from 'vue-property-decorator';

// TODO: reorganize emoji helpers
import { emojiFlagsSupport } from '@/assets/all-countries';
import { PHONE_TYPE, NUMBER } from '@/assets/constants';
import { isSupportedCountry, isEmpty } from '@/utils/';

import { IDropdowButton, PhoneNumberTypes, ParseMode } from '../components/types';

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

    // TODO: add ability to allow user specify own geo IP lookupp function
    @Prop({
        type: [ Boolean, Function ],
        default: () => true,
    }) autoCountry: Readonly<boolean>;

    // initial country
    @Prop({
        type: String,
        validator: (iso2: string) => (iso2 !== '' ? isSupportedCountry(iso2) : true),
        default: () => '',
    }) defaultCountry: Readonly<string>;

    // display only these countries
    @Prop({
        type: Array,
        validator: (iso2: string[]) => (isEmpty(iso2) ? true : iso2.some(isSupportedCountry)),
        default: () => [],
    }) onlyCountries: Readonly<string[]>;

    // don't display these countries
    @Prop({
        type: Array,
        validator: (iso2: string[]) => (isEmpty(iso2) ? true : iso2.some(isSupportedCountry)),
        default: () => [],
    }) ignoredCountries: Readonly<string[]>;

    // the countries at the top of the list.
    @Prop({
        type: Array,
        validator: (iso2: string[]) => (isEmpty(iso2) ? true : iso2.some(isSupportedCountry)),
        default: () => [],
    }) preferredCountries: Readonly<string[]>;
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
    }) customRegexp: Readonly<RegExp>;

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
    // TODO: switch to PropSync
    @Prop({
        type: [ String, Number ],
        default: () => '',
    }) value: Readonly<string>;
    // v-model

    // TODO: add locales
    @Prop({
        type: Object,
        default: () => {},
    }) localizedCountries: Readonly<Record<string, string>>;

    // native input alert, ID of the entire field
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

    // native input alert
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

    // native input alert
    @Prop({
        type: Boolean,
        default: () => false,
    }) disabled: Readonly<boolean>;

    @Prop({
        type: Boolean,
        default: () => true,
    }) isExpanded: Readonly<boolean>;

    // transition name for appearing & disapearing error message underneath the input
    @Prop({
        type: [ Boolean, String ],
        default: () => 'fade',
    }) errorAnimation: Readonly<boolean | string>;
}
