// https://github.com/atnmorrison/country-locale-map
// {
//     "name": "Afghanistan",
//     "iso2": "AF",
//     "numeric": "4",
//     "locales": [
//         "ps_AF",
//         "fa_AF",
//         "uz_Arab_AF"
//     ],
//     "default_locale": "ps_AF",
//     "currency": "AFN",
//     "languages": [
//         "ps",
//         "uz",
//         "tk"
//     ],
//     "capital": "Kabul",
//     "continent": "Asia",
//     "region": "South Asia"
// }

import _locales from './countries-locales.json';

const locales = {};

// loop over all of the locales above, restructuring the data to be objects with named keys
for (const l of _locales) {
    const iso2 = String(l[1]).toUpperCase();

    // Safari doesnt support it
    // if('Intl' in window && 'DisplayNames' in window.Intl) {

    // }
    const regionNames = new Intl.DisplayNames(l[3].map(lng => lng.replaceAll('_', '-')), { type: 'region' });

    const localesDict = {
        name_en: l[0],
        name_local: regionNames.of(iso2),
        iso2,
        numeric: l[2],
        locales: l[3],
        default_locale: l[4],
        currency: l[5],
        languages: l[6],
        capital: l[7],
        continent: l[8],
        region: l[9],
    };

    Object.assign(locales, { [iso2]: localesDict });
}

export {
    locales,
};
