import { PropType } from '@vue/composition-api';

export interface IDropdownProps {
    dropdownTabIndex?: PropType<number>;
    disableCountryCode?: PropType<boolean>;
    disableCountryName?: PropType<boolean>;
    disableFlags?: PropType<boolean>;
    disabledDialCode?: PropType<boolean>;
    defaultCountry?: PropType<string>;
    onlyCountries?: PropType<string[]>;
    ignoredCountries?: PropType<string[]>;
    preferredCountries?: PropType<string[]>;
}
export default {
    // props: {
    // Dropdown props
    dropdownTabIndex: {
        type: (Number as unknown) as PropType<number>,
        default: () => 0,
    },
    disableCountryCode: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => false,
    },
    disableCountryName: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => false,
    },
    disableFlags: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => false,
    },
    disabledDialCode: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => false,
    },
    defaultCountry: {
        type: (String as unknown) as PropType<string>,
        default: () => 'AE',
    },
    onlyCountries: {
        type: (Array as unknown) as PropType<string[]>,
        default: () => [],
    },
    ignoredCountries: {
        type: (Array as unknown) as PropType<string[]>,
        default: () => [],
    },
    preferredCountries: {
        type: (Array as unknown) as PropType<string[]>,
        default: () => [ 'AE' ],
    },
    // },
};
