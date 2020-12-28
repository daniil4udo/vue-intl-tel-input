import uniqBy from 'lodash/uniqBy';

import { countries } from '@/assets/all-countries';
import Props from '@/mixin/props';
import { has, isSupportedCountry } from '@/utils/';
import { Component, Mixins } from '@/utils/decorators';

import { ICountry } from '../components/models';

@Component
export default class Countries extends Mixins(Props) {
    /**
     * Flag that shows loading if we are trying to fetch country ISO from https://ip2c.org/s
     */
    public isFetchingCode = true;
    /**
     * Using to move selected countries to the top of the list
     * As long as preferredCountries is a prop
     * we use preferredCountriesProxy to modify it
     */
    public preferredCountriesProxy = [].concat(this.preferredCountries); // not to modify props

    private get _preferred(): ICountry[] {
        const isLastIndex = (i: number) => (this.preferredCountriesProxy.length - 1) === i;

        return this.getCountries(this.preferredCountriesProxy).map((c, i) => ({
            ...c,
            preferred: true,
            lastPreffered: isLastIndex(i),
        }));
    }

    private get _filtered(): Record<string, ICountry> {
        // List countries after filtered
        if (this.onlyCountries.length !== 0) {
            return this.onlyCountries.reduce((a, iso2) => Object.assign(a, { [iso2]: this.getCountry(iso2) }), {});
        }

        if (this.ignoredCountries.length !== 0) {
            const filterIgnored = {};

            for (const iso2 in countries) {
                if (!this.ignoredCountries.includes(iso2)) {
                    filterIgnored[iso2] = this.getCountry(iso2);
                }
            }

            return filterIgnored;
        }

        return countries;
    }

    public get sortedCountries(): ICountry[] {
        return uniqBy([].concat(this._preferred, Object.values(this._filtered)), 'iso2');
    }

    public get isEmojiFlagSupported() {
        return this.sortedCountries.every(c => c.emoji.supported);
    }

    public getCountry(iso2 = ''): ICountry {
        if (isSupportedCountry(iso2) && has(this._filtered, iso2)) {
            return this._filtered[iso2.toUpperCase()];
        }

        return null;
    }

    public getCountries(iso2List: string[] = []): ICountry[] {
        return iso2List
            .map(this.getCountry)
            .filter(Boolean);
    }
}
