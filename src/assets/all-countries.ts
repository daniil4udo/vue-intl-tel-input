// Array of country objects for the flag dropdown.

// Here is the criteria for the plugin to support a given country/territory
// - It has an iso2 code: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
// - It has it's own country calling code (it is not a sub-region of another country): https://en.wikipedia.org/wiki/List_of_country_calling_codes
// - It has a flag in the region-flags project: https://github.com/behdad/region-flags/tree/gh-pages/png
// - It is supported by libphonenumber (it must be listed on this page): https://github.com/googlei18n/libphonenumber/blob/master/resources/ShortNumberMetadata.xml

import { ICountry } from '@/components/models';

import _countries from './countries.json';
import _emojiCountries from './emojiCountries.json';

// const countriesArr: ICountry[] = [];
const countries: Record<string, ICountry> = {};
const countriesIso: Set<string> = new Set();

// loop over all of the countries above, restructuring the data to be objects with named keys
for (const c of _countries) {
    /**
     * We may want to encode to unicode
     * name[2] is a non latinic c name
     */
    const names = String(c[0]).split(/([\\(||//)])/g).filter(el => el !== '');
    // if (names.includes('(') && names.includes(')')) {
    //     names[2] = escapeUnicode(names[2]);
    // }

    const iso2 = String(c[1]).toUpperCase();
    const countryDict: ICountry = {
        name: [ ...names ].join(''), // c[0], // Country name,
        names: [ ...names ].filter(s => (s && s !== '(' && s !== ')')), // c[0], // Country name,
        iso2, // iso2 code,
        dialCode: String(c[2]), // International dial code,
        priority: Number(c[3]) || 0, // Order (if >1 country with same dial code),
        areaCodes: c[4] || null, // Area codes
        ..._emojiCountries[iso2],
    };

    countriesIso.add(iso2);
    // countriesArr.push(countryDict);
    Object.assign(countries, { [iso2]: countryDict });
}

export {
    countriesIso,
    // countriesArr,
    countries,
};
