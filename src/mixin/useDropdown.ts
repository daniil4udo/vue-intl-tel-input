import { countries } from '@/assets/all-countries';
import Props from '@/mixin/props';
import { toType, has, uniqBy, isSupportedCountry, isDefined } from '@/utils/';
import { Component, Mixins } from '@/utils/decorators';

import { ICountry, DropdowPosition } from '../components/models';

@Component
export default class Dropdown extends Mixins(Props) {
    private preferredCountriesProxy = [].concat(this.preferredCountries); // not to modify props
    public dropdownSearch = ''
    public dropdownOpenDirection = 'is-bottom-right' as DropdowPosition
    /**
     * Using to move selected countries to the top of the list
     * As long as preferredCountries is a prop
     * we use preferredCountriesProxy to modify it
     */
    public activeCountry = { iso2: this.defaultCountry } as ICountry;

    private get _preferred(): ICountry[] {
        const isLastIndex = (i: number) => (this.preferredCountriesProxy.length - 1) === i;

        return this.preferredCountriesProxy.reduce((a, iso2, i) => {
            const c = this.getCountry(iso2);

            if (isDefined(c)) {
                a.push({
                    ...c,
                    preferred: true,
                    lastPreffered: isLastIndex(i),
                });
            }

            return a;
        }, []);
    }

    private get _processed(): Record<string, ICountry> {
        // List countries after filtered
        if (this.onlyCountries.length !== 0) {
            return this.onlyCountries.reduce((a, iso2) => Object.assign(a, { [iso2]: this.getCountry(iso2) }), {});
        }

        if (this.ignoredCountries.length !== 0) {
            const filterIgnored = {};

            for (const iso2 in countries) {
                if (has(countries, iso2) && !this.ignoredCountries.includes(iso2)) {
                    filterIgnored[iso2] = this.getCountry(iso2);
                }
            }

            return filterIgnored;
        }

        return countries;
    }

    private get _sorted(): ICountry[] {
        return uniqBy([].concat(this._preferred, Object.values(this._processed)), 'iso2');
    }

    public get fileredCountries(): ICountry[] {
        const matchInputCountry = (c = '') => String.prototype.includes.call(c.toLowerCase(), this.dropdownSearch.toLowerCase());

        if (this.dropdownSearch === '') {
            return this._sorted;
        }

        return this._sorted.filter(option => [ option.name, option.dialCode, option.iso2, option.emoji.flag ].some(matchInputCountry));
    }

    public get isEmojiFlagSupported(): boolean {
        return this._sorted.every(c => c.emoji.supported);
    }

    public getCountry(iso2 = ''): ICountry {
        if (isSupportedCountry(iso2) && has(this._processed, iso2)) {
            return this._processed[iso2.toUpperCase()];
        }

        return null;
    }

    public setActiveCountry(c: ICountry | string): ICountry {
        if (!c) {
            return this.activeCountry;
        }

        if (toType(c) !== 'string' && toType(c) !== 'object') {
            throw new TypeError(`[setActiveCountry]: Country argument has to be a string or an object. Got ${typeof c}`);
        }

        this.activeCountry = typeof c === 'string'
            ? this.getCountry(c)
            : { ...c };

        this.updatePreferredCountries(this.activeCountry.iso2);
        this.$emit('country-changed', this.activeCountry.iso2, this.activeCountry);

        return this.activeCountry;
    }

    public updatePreferredCountries(iso2 = ''): string[] {
        /**
         * Move countries, that has been selected to the top of the list
         * Like a recently chosen
         */
        if (!this.preferredCountriesProxy.includes(iso2)) {
            // this.preferredCountriesProxy.push(iso2);
            this.$set(this.preferredCountriesProxy, this.preferredCountriesProxy.length, iso2);

            this.$emit('preferred-changed', iso2, this.preferredCountriesProxy);
        }

        return this.preferredCountriesProxy;
    }
}
