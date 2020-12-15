import { ref, computed, ComputedRef } from '@vue/composition-api';
import has from 'lodash/has';
import uniqBy from 'lodash/uniqBy';

import { IProps, ICountry } from '@/components/models';

import { countries } from '../assets/all-countries';

export default function (props: IProps) {
    const isFetchCountryCode = ref(false);
    const preferredISOs = ref(props.preferredCountries);

    /**
     * Computed
     */
    const _preferred: ComputedRef<ICountry[]> = computed(() => {
        const lastI = preferredISOs.value.length - 1;

        return getCountries(preferredISOs.value).map((c, i) => ({
            ...c,
            preferred: true,
            lastPreffered: lastI === i,
        }));
    });
    const _filtered: ComputedRef<Record<string, ICountry>> = computed(() => {
        // List countries after filtered
        if (props.onlyCountries.length !== 0) {
            return props.onlyCountries.reduce((a, iso2) => Object.assign(a, { [iso2]: getCountryByISO(iso2) }), {});
            // return props.onlyCountries.map(iso2 => getCountryByISO(iso2));
        }

        if (props.ignoredCountries.length !== 0) {
            const filterIgnored = {};

            for (const iso2 in countries) {
                if (!props.ignoredCountries.includes(iso2)) {
                    filterIgnored[iso2] = getCountryByISO(iso2);
                }
            }

            return filterIgnored;

            // for (const iso2 of props.ignoredCountries) {
            //     getCountryByISO(iso2) = undefined;
            // }
            // return Object.values(countries).filter(Boolean);
        }

        return countries;
        // return Object.values(countries);
    });
    const sortedCountries: ComputedRef<ICountry[]> = computed(() => uniqBy([].concat(_preferred.value, Object.values(_filtered.value)), 'iso2'));

    function isCountryAvailable(iso2 = '') {
        if (has(_filtered.value, iso2)) {
            return true;
        }
        throw new Error(`DmcTelInput: The country ${iso2} is not available`);
    }
    function getCountryByISO(iso2 = ''): ICountry {
        iso2 = iso2.toUpperCase();

        if (isCountryAvailable(iso2)) {
            return _filtered.value[iso2];
        }
    }
    /**
     * Get the list of countries from the list of iso2 code
     */
    function getCountries(iso2List: string[] = []) {
        return iso2List
            .map(getCountryByISO)
            .filter(Boolean);
    }

    /**
     * Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)
     */
    async function fetchCountryCode() {
        try {
            isFetchCountryCode.value = true;

            const response = await fetch('https://ip2c.org/s');
            const responseText = await response.text();
            const result = String(responseText || '').toUpperCase();
            if (result && result[0] === '1') {
                return result.substr(2, 2);
            }
        }
        catch (err) {
            throw new Error('DmcTelInput: Error while fetching country code');
        }
        finally {
            isFetchCountryCode.value = false;
        }
    }

    return {
        preferredISOs,
        isFetchCountryCode,

        sortedCountries,

        getCountryByISO,
        getCountries,
        fetchCountryCode,
    };
}
