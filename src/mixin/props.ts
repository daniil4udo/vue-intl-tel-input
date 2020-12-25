/* eslint-disable max-classes-per-file */
import { Component, Prop, Mixins, Vue } from 'vue-property-decorator';

import { countries } from '@/assets/all-countries';
import { IDropdowButton, AllowedPhoneNumberTypes, ParseMode } from '@/components/models';

@Component
class DropdownProps extends Vue {
    @Prop({
        type: (Number),
        default: () => 0,
    }) dropdownTabIndex: number;

    @Prop({
        type: (String),
        default: () => 'Search by country name or code',
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
    }) defaultCountry: string;

    @Prop({
        type: (Array),
        default: () => [],
    }) onlyCountries: string[];

    @Prop({
        type: (Array),
        default: () => [],
    }) ignoredCountries: string[];

    @Prop({
        type: (Array),
        default: () => [ 'AE' ],
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

    @Prop({
        type: String,
        validator: prop => [ 'international', 'national', '' ].includes(String(prop)),
        default: () => 'national',
    }) mode: ParseMode;

    @Prop({
        type: Array,
        default: () => [ 'mobile', 'fixed-line', 'fixed-line-or-mobile' ],
        validator: (value: string[]) => [ 'fixed-line', 'mobile', 'fixed-line-or-mobile', 'toll-free', 'premium-rate', 'shared-cost', 'voip', 'personal-number', 'pager', 'uan', 'voicemail', 'unknown' ].some(v => value.includes(v)),
    }) allowedPhoneTypes: AllowedPhoneNumberTypes;

    @Prop({
        type: Boolean,
        default: () => false,
    }) required: boolean;

    @Prop({
        type: String,
        default: () => 'dmc-phone-input',
    }) name: string;

    @Prop({
        type: String,
        default: () => 'Hell, no!',
    }) invalidMsg: string;

    @Prop({
        type: String,
        default: () => 'Phone Input!',
    }) label: string;

    @Prop({
        type: Boolean,
        default: () => false,
    }) disabled: boolean;
}
