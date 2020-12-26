/* eslint-disable max-classes-per-file */
import isEmpty from 'lodash/isEmpty';
import { Component, Prop, Mixins, Vue } from 'vue-property-decorator';

import { countries } from '@/assets/all-countries';
import { PHONE_TYPE, NUMBER } from '@/assets/constants';
import { isCorrectISO, validationMessage } from '@/utils/';

import { IPhoneObject, IDropdowButton, PhoneNumberTypes, ParseMode } from '../components/models';

@Component
class DropdownProps extends Vue {
    @Prop({
        type: (Number),
        default: () => 0,
    }) dropdownTabIndex: number;

    @Prop({
        type: (String),
        default: () => 'Search by country name, code or ISO',
    }) dropdownPlaceholder: string;

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
        default: () => Object.values(countries).every(c => c.emoji.supported),
    }) emojiFlags: boolean | IDropdowButton;

    // whether or not to allow the dropdown
    @Prop({
        type: (Boolean),
        default: () => false,
    }) disabledDropdown: boolean;

    @Prop({
        type: (Boolean),
        default: () => true,
    }) fetchCountry: boolean;

    @Prop({
        type: (String),
        default: () => '',
        validator: (iso2: string) => (iso2 !== '' ? isCorrectISO(iso2) : true),
    }) defaultCountry: string;

    @Prop({
        type: (Array),
        default: () => [],
        validator: (iso2: string[]) => (!isEmpty(iso2) ? iso2.some(isCorrectISO) : true),
    }) onlyCountries: string[];

    @Prop({
        type: (Array),
        default: () => [],
        validator: (iso2: string[]) => (!isEmpty(iso2) ? iso2.some(isCorrectISO) : true),
    }) ignoredCountries: string[];

    @Prop({
        type: (Array),
        default: () => [],
        validator: (iso2: string[]) => (!isEmpty(iso2) ? iso2.some(isCorrectISO) : true),
    }) preferredCountries: string[];
}

@Component
class InputProps extends Vue {
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
        type: String,
        default: () => '',
    }) value: string;
    // v-model

    @Prop({
        type: String,
        validator: (mode: ParseMode) => NUMBER.some(m => m === mode),
        default: () => 'national',
    }) mode: ParseMode;

    @Prop({
        type: Array,
        default: () => [ 'mobile', 'fixed-line', 'fixed-line-or-mobile' ],
        validator: (type: PhoneNumberTypes[]) => PHONE_TYPE.some(t => type.includes(t)),
    }) allowedPhoneTypes: PhoneNumberTypes[];

    @Prop({
        type: Boolean,
        default: () => false,
    }) required: boolean;

    // Date.now() will be appended to keep name unique for multiple instances
    @Prop({
        type: String,
        default: () => 'dmc-phone-input',
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
        type: Function,
        default: (phoneData: IPhoneObject) => validationMessage(phoneData),
    }) customInvalidMsg: (phoneData: IPhoneObject) => string;
}
