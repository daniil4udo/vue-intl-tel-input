import { ref, Ref, computed, ComputedRef } from '@vue/composition-api';
import uniqBy from 'lodash/uniqBy';

import { countries, ICountry } from '../assets/all-countries';

// TScompute
type DropdowPosition = 'auto' | 'top' | 'bottom'

export default function ({
    // disabledDialCode,
    onlyCountries,
    ignoredCountries,
    preferredCountries,
}) {
    /**
     * Data
     */
    const selectedCountry = ref('');
    const dropdownOpenDirection: Ref<DropdowPosition> = ref('auto');

    /**
     * Computed
     */
    const filteredCountries: ComputedRef<ICountry[]> = computed(() => {
        // List countries after filtered
        if (onlyCountries.length !== 0) {
            return countries.filter(({ iso2 }) => onlyCountries.some((c: string) => c.toUpperCase() === iso2));
        }

        if (ignoredCountries.length) {
            return countries.filter(({ iso2 }) => !ignoredCountries.includes(iso2.toUpperCase()) && !ignoredCountries.includes(iso2.toLowerCase()));
        }

        return countries;
    });
    const sortedCountries: ComputedRef<ICountry[]> = computed(() => {
        // Sort the list countries: from preferred countries to all countries
        const _preferredCountries = getCountries(preferredCountries).map(country => ({ ...country, preferred: true }));

        return uniqBy([].concat(_preferredCountries, filteredCountries.value), 'iso2');
    });

    function findCountry(iso = '') {
        return filteredCountries.value
            .find(country => country.iso2.toUpperCase() === iso.toUpperCase());
    }
    /**
     * Get the list of countries from the list of iso2 code
     */
    function getCountries(list: string[] = []) {
        return list
            .map(findCountry)
            .filter(Boolean);
    }

    function setDropdownPosition() {
        const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom;
        const hasEnoughSpaceBelow = spaceBelow > 200;

        if (hasEnoughSpaceBelow) {
            dropdownOpenDirection.value = 'bottom';
        }
        else {
            dropdownOpenDirection.value = 'top';
        }
    }

    function getCountryNameTitle(country: ICountry) {
        return `${country.emoji} +${country.dialCode}`;
    }

    return {
        selectedCountry,
        dropdownOpenDirection,

        filteredCountries,
        sortedCountries,

        getCountries,
        findCountry,
        setDropdownPosition,
        getCountryNameTitle,
    };
}
