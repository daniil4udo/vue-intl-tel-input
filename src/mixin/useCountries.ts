import { computed, ComputedRef } from '@vue/composition-api';
import uniqBy from 'lodash/uniqBy';

import { countries, ICountry } from '../assets/all-countries';

export default function ({
    onlyCountries,
    ignoredCountries,
    preferredCountries,
}) {
    /**
     * Computed
     */
    const filteredCountries: ComputedRef<ICountry[]> = computed(() => {
        // List countries after filtered
        if (onlyCountries.length !== 0) {
            return onlyCountries.reduce((a, iso2) => Object.assign(a, { [iso2]: countries[iso2] }), {});
            // return onlyCountries.map(iso2 => countries[iso2]);
        }

        if (ignoredCountries.length !== 0) {
            const filterIgnored = {};

            for (const iso2 in countries) {
                if (!ignoredCountries.includes(iso2)) {
                    filterIgnored[iso2] = countries[iso2];
                }
            }

            return filterIgnored;

            // for (const iso2 of ignoredCountries) {
            //     countries[iso2] = undefined;
            // }
            // return Object.values(countries).filter(Boolean);
        }

        return countries;
        // return Object.values(countries);
    });
    const sortedCountries: ComputedRef<ICountry[]> = computed(() => {
        // Sort the list countries: from preferred countries to all countries
        const _preferredCountries = getCountries(preferredCountries).map(country => ({ ...country, preferred: true }));

        return uniqBy([].concat(_preferredCountries, Object.values(filteredCountries.value)), 'iso2');
    });
    /**
     * Get the list of countries from the list of iso2 code
     */
    function findCountry(iso = '') {
        return filteredCountries.value[iso] || {};
        // return filteredCountries.value.find(country => country.iso2.toUpperCase() === iso.toUpperCase());
    }
    /**
     * Get the list of countries from the list of iso2 code
     */
    function getCountries(iso2List: string[] = []) {
        return iso2List
            .map(findCountry)
            .filter(Boolean);
    }

    function getCountryFormat(country: ICountry) {
        return `${country.emoji} +${country.dialCode}`;
    }

    return {
        filteredCountries,
        sortedCountries,

        findCountry,
        getCountries,
        getCountryFormat,
    };
}
