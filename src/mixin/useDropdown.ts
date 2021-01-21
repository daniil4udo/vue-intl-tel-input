import { Component, Mixins } from 'vue-property-decorator';

import allCountries from '@/assets/all-countries';
import Props from '@/mixin/props';
import { toUpper, has, createUniqueArray, isEmpty } from '@/utils/';

import { ICountry, DropdowPosition } from '../components/types';

@Component
export default class Dropdown extends Mixins(Props) {
    /**
     * proccessed countries
     * base on PREFERRED, IGNORED & ONLY countries
     */
    public countriez = null as Record<string, ICountry>;

    /**
     * PROXIES
     * Removing duplicates
     */
    private get _preferredCountries() {
        return createUniqueArray(this.preferredCountries);
    }

    private get _ignoredCountries() {
        return createUniqueArray(this.ignoredCountries);
    }

    private get _onlyCountries() {
        return createUniqueArray(this.onlyCountries);
    }

    /**
     * Currently chosen active country
     */
    public activeCountry = { iso2: this.defaultCountry } as ICountry;

    // here we store just dial codes
    private dialCodes = {};
    // here we store "country codes" (both dial codes and their area codes)
    private countryCodes = {};
    private countryCodeMaxLen = 0;

    /**
     * Dropdown options
     */
    public dropdownSearch = '';
    public dropdownOpenDirection = 'is-bottom-right' as DropdowPosition;

    public get fileredCountriez(): Record<string, ICountry> {
        const matchInputCountry = (c = '') => String.prototype.includes.call(toUpper(c), toUpper(this.dropdownSearch));

        if (this.dropdownSearch === '') {
            return this.countriez;
        }

        const f = {};
        for (const iso2 in this.countriez) {
            if (has(this.countriez, iso2) && [ this.countriez[iso2].name, this.countriez[iso2].dialCode, this.countriez[iso2].iso2 ].some(matchInputCountry)) {
                f[iso2] = this.countriez[iso2];
            }
        }

        return f;
        // return this.countriez;
    }

    /**
     *
     * Proccess countries dictionary
     * with ONLY / IGNORED / PREFERRED countries data
     */
    public processCountriesData() {
        /**
         * – DEFAULT, ONLY and PREFERRED countries can intersect among each other
         * – IGNORED cannot intersect with DEFAULT, ONLY and PREFERRED
         */
        for (const c of [].concat(this.defaultCountry || '', this._preferredCountries, this._onlyCountries)) {
            if (this._ignoredCountries.includes(c)) {
                throw new Error(`Ignored country "${c}" is intersecting with default, preferred or only`);
            }
        }

        /**
         * – DEFAULT and PREFFERED have to be in ONLY (if declared ones)
         */
        for (const c of [].concat(this.defaultCountry || '', this._preferredCountries)) {
            if (isEmpty(this._ignoredCountries) || this._onlyCountries.length === 0) {
                break;
            }

            if (!this._onlyCountries.includes(c)) {
                throw new Error(`"ONLY" countries doen't have "${c}" iso country`);
            }
        }

        // process onlyCountries or ignoredCountries array if present
        this._processAllCountries();

        // process the countryCodes map
        this._processCountryCodes();

        // process the preferredCountries
        this._processPreferredCountries();

        // translate countries according to localizedCountries option
        if (this.localizedCountries) {
            this._translateCountriesByLocale();
        }

        // sort countries by name
        if (this._onlyCountries.length || this.localizedCountries) {
            /**
             * The localeCompare() method returns a number indicating whether a reference string comes before,
             * or after, or is the same as the given string in sort order
             *
             * reason for type [ string, ICountry ] behind the Object.entries
             */
            this.countriez = Object.fromEntries(Object.entries(this.countriez).sort((a, b) => a[1].name_en.localeCompare(b[1].name_en)));
        }
    }

    // process onlyCountries or ignoredCountries array if present
    private _processAllCountries() {
        if (this._onlyCountries.length > 0) {
            this.countriez = {};

            for (const iso2 of this._onlyCountries) {
                // this.countriez[iso2] = allCountries[iso2];
                this.countriez[iso2] = this.getCountry(iso2, true);
            }
        }
        else {
            this.countriez = { ...allCountries };

            for (const iso2 of this._ignoredCountries) {
                delete this.countriez[iso2];
            }
        }
    }

    /**
     * propxy variable not to modify props
     * Using to move selected countries to the top of the list
     * As long as preferredCountries is a prop
     * we use _preferredCountries to modify it
     */
    private _processPreferredCountries() {
        if (this._preferredCountries.length === 0) {
            return;
        }

        // contains only preffered countries
        // with assigned extra info
        const p = {};

        for (let i = 0; i < this._preferredCountries.length; i++) {
            const countryData = this.getCountry(this._preferredCountries[i]);

            if (countryData) {
                Object.assign(countryData, {
                    preferred: true,
                    lastPreffered: this.isLastIndex(i),
                });

                p[this._preferredCountries[i]] = countryData;
            }
        }

        // this will put preferred countries on in fromt
        this.countriez = { ...p, ...this.countriez };
    }

    // Translate Countries by object literal provided on config
    private _translateCountriesByLocale() {
        for (const iso2 in this.countriez) {
            if (has(this.countriez, iso2)) {
                const iso = toUpper(this.countriez[iso2].iso2);

                if (has(this.localizedCountries, iso)) {
                    this.countriez[iso2].name = this.localizedCountries[iso];
                }
                // TODO: add extra support with Intl
            }
        }
    }

    // add a country code to this.countryCodes
    private _addCountryCode(iso2 = '', countryCode = '', priority?: number) {
        if (countryCode.length > this.countryCodeMaxLen) {
            this.countryCodeMaxLen = countryCode.length;
        }
        if (!has(this.countryCodes, countryCode)) {
            this.countryCodes[countryCode] = [];
        }
        // bail if we already have this country for this countryCode
        for (let i = 0; i < this.countryCodes[countryCode].length; i++) {
            if (this.countryCodes[countryCode][i] === iso2) {
                return;
            }
        }
        // check for undefined as 0 is falsy
        const index = (priority !== undefined) ? priority : this.countryCodes[countryCode].length;
        this.countryCodes[countryCode][index] = iso2;
    }

    // process the countryCodes map
    private _processCountryCodes() {
        for (const iso2 in this.countriez) {
            if (has(this.countriez, iso2)) {
                // first: add dial codes
                const c = this.countriez[iso2];

                if (!this.dialCodes[c.dialCode]) {
                    this.dialCodes[c.dialCode] = true;
                }
                this._addCountryCode(c.iso2, c.dialCode, c.priority);

                // next: add area codes
                // this is a second loop over countries, to make sure we have all of the "root" countries
                // already in the map, so that we can access them, as each time we add an area code substring
                // to the map, we also need to include the "root" country's code, as that also matches
                // area codes
                if (!isEmpty(c.areaCodes)) {
                    const rootCountryCode = this.countryCodes[c.dialCode][0];

                    // for each area code
                    for (let j = 0; j < c.areaCodes.length; j++) {
                        const areaCode = c.areaCodes[j];

                        // for each digit in the area code to add all partial matches as well
                        for (let k = 1; k < areaCode.length; k++) {
                            const partialDialCode = c.dialCode + areaCode.substr(0, k);
                            // start with the root country, as that also matches this dial code
                            this._addCountryCode(rootCountryCode, partialDialCode);
                            this._addCountryCode(c.iso2, partialDialCode);
                        }
                        // add the full area code
                        this._addCountryCode(c.iso2, c.dialCode + areaCode);
                    }
                }
            }
        }
    }

    /**
     * find the country data for the given country code
     * the ignoreOnlyCountriesOption is only used during init() while parsing the onlyCountries array
     */
    public getCountry(iso2 = '', ignoreOnlyCountriesOption = false, allowFail = true): ICountry {
        const countryDict = ignoreOnlyCountriesOption ? allCountries : this.countriez;

        if (countryDict[iso2]) {
            return countryDict[iso2];
        }

        if (allowFail) {
            return null;
        }

        throw new Error(`No country data for "${iso2}"`);
    }

    public setActiveCountry(c: ICountry | string): ICountry {
        if (!c) {
            return this.activeCountry;
        }

        if (typeof c !== 'string' && typeof c !== 'object') {
            throw new TypeError(`[setActiveCountry]: Country argument has to be a string or an object. Got ${typeof c}`);
        }

        this.activeCountry = typeof c === 'string'
            ? this.getCountry(c)
            : { ...c };

        /**
         * UPDATE PREFERRED as well
         * Move countries, that has been selected to the top of the list
         * Like a recently chosen feat
         */
        if (!this._preferredCountries.includes(this.activeCountry.iso2)) {
            this.$set(this._preferredCountries, this._preferredCountries.length, this.activeCountry.iso2);
            this._processPreferredCountries();

            this.$emit('preferred-changed', this._preferredCountries);
        }

        this.$emit('country-changed', this.activeCountry.iso2, this.activeCountry);

        return this.activeCountry;
    }

    /**
     * utils
     */
    private isLastIndex(j: number) {
        return (this._preferredCountries.length - 1) === j;
    }
}
