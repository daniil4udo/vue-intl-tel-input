import { PropType } from '@vue/composition-api';
import { isMobile } from 'buefy/src/utils/helpers';

import { IDropdowButton } from '@/components/models';

export default {
    dropdownTabIndex: {
        type: (Number as unknown) as PropType<number>,
        default: () => 0,
    },
    dropdownPlaceholder: {
        type: (String as unknown) as PropType<string>,
        default: () => 'Search by country name or code',
    },
    hideCountryCode: {
        type: [ Boolean as unknown, Object as unknown ] as PropType<boolean | IDropdowButton>,
        default: () => false,
    },
    hideCountryName: {
        type: [ Boolean as unknown, Object as unknown ] as PropType<boolean | IDropdowButton>,
        default: () => false,
    },
    hideFlags: {
        type: [ Boolean as unknown, Object as unknown ] as PropType<boolean | IDropdowButton>,
        default: () => false,
    },
    emojiFlags: {
        type: [ Boolean as unknown, Object as unknown ] as PropType<boolean | IDropdowButton>,
        default: () => isMobile.any(),
    },
    disabledDropdown: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => true,
    },
    fetchCountry: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => true,
    },
    defaultCountry: {
        type: (String as unknown) as PropType<string>,
        default: () => '',
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
};
