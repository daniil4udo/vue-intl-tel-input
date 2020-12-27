import isPlainObject from 'is-plain-object';
import { Component, Emit, Mixins } from 'vue-property-decorator';

import { ICountry, DropdowPosition } from '@/components/models';
import Countries from '@/mixin/useCountries';

@Component
export default class Dropdown extends Mixins(Countries) {
    public dropdownSearch = ''
    public dropdownOpenDirection = 'is-bottom-right' as DropdowPosition
    public activeCountry = {
        iso2: this.defaultCountry, // selected country object
    } as ICountry;

    public get fileredCountriesModel() {
        return this.sortedCountries.filter(option => [ option.name, option.dialCode, option.iso2, option.emoji.flag ].some(this.matchInputCountry));
    }

    private matchInputCountry(c = '') {
        return String.prototype.includes.call(c.toLowerCase(), this.dropdownSearch.toLowerCase());
    }

    public updatePreferredCountries(iso2 = '') {
        /**
         * Move countries, that has been selected to the top of the list
         */
        //
        // Like a recently chosen
        if (!this.preferredCountriesProxy.includes(iso2)) {
            // this.preferredCountriesProxy.push(iso2);
            this.$set(this.preferredCountriesProxy, this.preferredCountriesProxy.length, iso2);
        }

        return this.preferredCountriesProxy;
    }

    @Emit('country-changed')
    public setActiveCountry(c: ICountry | string) {
        if (!c) {
            return this.activeCountry;
        }
        if (typeof c !== 'string' && !isPlainObject(c)) {
            throw new TypeError(`[setActiveCountry]: Country argument has to be a string or an object. Got ${typeof c}`);
        }

        this.activeCountry = typeof c === 'string'
            ? this.getCountry(c)
            : { ...c };

        this.updatePreferredCountries(this.activeCountry.iso2);

        return this.activeCountry;
    }
}
