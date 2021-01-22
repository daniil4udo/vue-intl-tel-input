import { toUpper } from './toUpper';

export function getBowserLocale(defaultIso = 'GB') {
    const navigator = window.navigator || window.clientInformation;

    const languageList: string[] = [];

    if (navigator.languages) {
        languageList.push(...navigator.languages);
    }
    if (navigator.language) {
        languageList.push(navigator.language);
    }
    if (navigator.userLanguage) {
        languageList.push(navigator.userLanguage);
    }
    if (navigator.browserLanguage) {
        languageList.push(navigator.browserLanguage);
    }
    if (navigator.systemLanguage) {
        languageList.push(navigator.systemLanguage);
    }

    const [ lang, iso ]: string[] = toUpper(languageList.find(l => l.includes('-')) || languageList[0]).split('-');

    if (iso) {
        return iso;
    }
    // fallback to US country
    if (lang === 'EN') {
        return 'GB';
    }

    return null;
}
