import { countries } from '@/assets/all-countries';
import Props from '@/mixin/props';
import { toType, isSupportedCountry, keyByIso } from '@/utils/';
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

    private get _preferred(): Map<string, ICountry> {
        return keyByIso(this.preferredCountriesProxy, this.getCountry, true);
    }

    private get _processed(): Map<string, ICountry> {
        // List countries after filtered
        if (this.onlyCountries.length !== 0) {
            return keyByIso(this.onlyCountries, this.getCountry);
        }

        if (this.ignoredCountries.length !== 0) {
            for (const iso of this.ignoredCountries) {
                countries.delete(iso);
            }
        }

        return countries;
    }

    private get _sorted(): ICountry[] {
        return Object.values(Object.fromEntries(new Map([ ...this._preferred, ...this._processed ])));
    }

    public get fileredCountries(): ICountry[] {
        const matchInputCountry = (c = '') => String.prototype.includes.call(c.toString().toLowerCase(), this.dropdownSearch.toString().toLowerCase());

        if (this.dropdownSearch === '') {
            return this._sorted;
        }

        return this._sorted.filter(option => [ option.name, option.dialCode, option.iso2, option.emoji.flag ].some(matchInputCountry));
    }

    public get isEmojiFlagSupported(): boolean {
        for (let i = 0; i < this._sorted.length; i++) {
            if (!this._sorted[i].emoji.supported) {
                return false;
            }
        }
        return true;
    }

    public getCountry(iso2 = ''): ICountry {
        if (iso2 !== '' && isSupportedCountry(iso2) && this._processed.has(iso2)) {
            return this._processed.get(iso2.toUpperCase());
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
