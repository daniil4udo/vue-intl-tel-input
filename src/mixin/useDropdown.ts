import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isPlainObject from 'lodash/isPlainObject';
import { Component } from 'vue-property-decorator';

import { ICountry, DropdowPosition } from '@/components/models';
import Countries from '@/mixin/useCountries';

@Component
export default class Dropdown extends Countries {
    dropdownSearch = ''
    dropdownOpenDirection = 'is-bottom-right' as DropdowPosition
    activeCountry = {
        iso2: this.defaultCountry, // selected country object
    } as ICountry;

    public get fileredCountriesModel() {
        return this.sortedCountries.filter(option => this.matchInputCountry(option.name) || this.matchInputCountry(option.dialCode));
    }

    private matchInputCountry(c = '') {
        return String.prototype.includes.call(c.toLowerCase(), this.dropdownSearch.toLowerCase());
    }

    public selectCountry(country: ICountry | string) {
        if (isNil(country) || country === '') {
            return this.activeCountry;
        }
        if (typeof country !== 'string' && !isPlainObject(country)) {
            throw new TypeError(`Country argument has to be a string or an object. Got ${typeof country}`);
        }

        this.activeCountry = typeof country === 'string'
            ? this.getCountryByISO(country)
            : country;

        return this.activeCountry;
    }

    public setDropdownPosition(el: HTMLElement, minOffset = 200) {
        const spaceBelow = window.innerHeight - el.getBoundingClientRect().bottom;
        const hasEnoughSpaceBelow = spaceBelow > minOffset;

        if (hasEnoughSpaceBelow) {
            this.dropdownOpenDirection = 'is-bottom-right';
        }
        else {
            this.dropdownOpenDirection = 'is-top-right';
        }

        return this.dropdownOpenDirection;
    }

    public getBoolean(prop, key) {
        return typeof prop === 'boolean'
            ? prop
            : get(prop, key, false);
    }
}
