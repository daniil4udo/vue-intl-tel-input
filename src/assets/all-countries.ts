// Array of country objects for the flag dropdown.

// Here is the criteria for the plugin to support a given country/territory
// - It has an iso2 code: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
// - It has it's own country calling code (it is not a sub-region of another country): https://en.wikipedia.org/wiki/List_of_country_calling_codes
// - It has a flag in the region-flags project: https://github.com/behdad/region-flags/tree/gh-pages/png
// - It is supported by libphonenumber (it must be listed on this page): https://github.com/googlei18n/libphonenumber/blob/master/resources/ShortNumberMetadata.xml

// Each country array has the following information:
// [
//    Country name,
//    iso2 code,
//    International dial code,
//    Order (if >1 country with same dial code),
//    Area codes
// ]
import _countries from './countries.json';
import _emojiCountries from './emojiCountries.json';

const countriesArr: ICountry[] = [];
const countries: Record<string, ICountry> = {};
const countriesIso: Set<string> = new Set();

// loop over all of the countries above, restructuring the data to be objects with named keys
for (const country of _countries) {
    const name = String(country[0]).split(/([\\(||//)])/g).filter(el => el !== '');
    if (name.includes('(') && name.includes(')')) {
        /**
         * We may want to encode to unicode
         * name[2] is a non latinic country name
         */
        // name[2] = escapeUnicode(name[2]);
    }

    const iso2 = String(country[1]).toUpperCase();
    const countryDict = {
        name: name.join(''), // country[0],
        iso2,
        dialCode: String(country[2]),
        priority: Number(country[3]) || 0,
        areaCodes: country[4] || null,
        ..._emojiCountries[iso2],
    };

    countriesIso.add(iso2);
    countriesArr.push(countryDict);
    Object.assign(countries, { [iso2]: countryDict });
}

export interface ICountry {
    name: string;
    iso2: string;
    dialCode: string;
    priority: number;
    areaCodes: string[] | null;
    preferred?: boolean;
    emoji: string;
    unicode: string;
}

export {
    countriesIso,
    countriesArr,
    countries,
};
