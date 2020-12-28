import { ICountry, DropdowPosition } from '@/components/models';
import Countries from '@/mixin/useCountries';
import { toType } from '@/utils/';
import { Component, Emit, Mixins } from '@/utils/decorators';

@Component
export default class Dropdown extends Mixins(Countries) {
    public dropdownSearch = ''
    public dropdownOpenDirection = 'is-bottom-right' as DropdowPosition
    public activeCountry = { iso2: this.defaultCountry } as ICountry;

    public get fileredCountriesModel(): ICountry[] {
        const matchInputCountry = (c = '') => String.prototype.includes.call(c.toLowerCase(), this.dropdownSearch.toLowerCase());
        return this.sortedCountries.filter(option => [ option.name, option.dialCode, option.iso2, option.emoji.flag ].some(matchInputCountry));
    }

    public updatePreferredCountries(iso2 = ''): string[] {
        /**
         * Move countries, that has been selected to the top of the list
         * Like a recently chosen
         */
        if (!this.preferredCountriesProxy.includes(iso2)) {
            // this.preferredCountriesProxy.push(iso2);
            this.$set(this.preferredCountriesProxy, this.preferredCountriesProxy.length, iso2);

            /**
             * Avoid using decorator
             * to avoid firing every time country changes
             */
            this.$emit('preferred-changed', this.preferredCountriesProxy, iso2);
        }

        return this.preferredCountriesProxy;
    }

    @Emit('country-changed')
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

        return this.activeCountry;
    }
}
