import has from 'lodash/has';
import uniqBy from 'lodash/uniqBy';
import { Component, Mixins } from 'vue-property-decorator';

import { countries } from '@/assets/all-countries';
import Props from '@/mixin/props';
import { isCorrectISO } from '@/utils/';

import { ICountry } from '../components/models';

@Component
export default class Countries extends Mixins(Props) {
    public isFetchingCode = false;

    private get _preferred(): ICountry[] {
        const isLastIndex = (i: number) => (this.preferredCountries.length - 1) === i;

        return this.getCountries(this.preferredCountries).map((c, i) => ({
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
        if (isCorrectISO(iso2) && has(this._filtered, iso2)) {
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
