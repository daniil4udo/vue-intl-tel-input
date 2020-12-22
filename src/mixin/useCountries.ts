import has from 'lodash/has';
import uniqBy from 'lodash/uniqBy';
import { Component, Mixins } from 'vue-property-decorator';

import { countries } from '@/assets/all-countries';
import Props from '@/components/props';

import { ICountry } from '../components/models';

@Component
export default class Countries extends Mixins(Props) {
    isFetchingCode = false;

    private get _preferred(): ICountry[] {
        const lastI = (i: number) => (this.preferredCountries.length - 1) === i;

        return this.getCountries(this.preferredCountries).map((c, i) => ({
            ...c,
            preferred: true,
            lastPreffered: lastI(i),
        }));
    }

    private get _filtered(): Record<string, ICountry> {
        // List countries after filtered
        if (this.onlyCountries.length !== 0) {
            return this.onlyCountries.reduce((a, iso2) => Object.assign(a, { [iso2]: this.getCountryByISO(iso2) }), {});
            // return this.onlyCountries.map(iso2 => this.getCountryByISO(iso2));
        }

        if (this.ignoredCountries.length !== 0) {
            const filterIgnored = {};

            for (const iso2 in countries) {
                if (!this.ignoredCountries.includes(iso2)) {
                    filterIgnored[iso2] = this.getCountryByISO(iso2);
                }
            }

            return filterIgnored;

            // for (const iso2 of this.ignoredCountries) {
            //     this.getCountryByISO(iso2) = undefined;
            // }
            // return Object.values(countries).filter(Boolean);
        }

        return countries;
        // return Object.values(countries);
    }

    public get sortedCountries(): ICountry[] {
        return uniqBy([].concat(this._preferred, Object.values(this._filtered)), 'iso2');
    }

    private isCountryAvailable(iso2 = '') {
        if (has(this._filtered, iso2)) {
            return true;
        }
        throw new Error(`DmcTelInput: The country ${iso2} is not available`);
    }

    public getCountryByISO(iso2 = ''): ICountry {
        iso2 = iso2.toUpperCase();

        if (this.isCountryAvailable(iso2)) {
            return this._filtered[iso2];
        }
    }

    /**
     * Get the list of countries from the list of iso2 code
     */
    public getCountries(iso2List: string[] = []) {
        return iso2List
            .map(this.getCountryByISO)
            .filter(Boolean);
    }

    /**
     * Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)
     */
    public async fetchCountryCode() {
        try {
            this.isFetchingCode = true;

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
            this.isFetchingCode = false;
        }
    }
}
