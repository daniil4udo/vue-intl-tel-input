export async function getBowserLocale() {
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

    const [ lang, iso ]: string[] = (languageList.find(l => l.includes('-')) || '').split('-');

    if (iso) {
        return iso.toUpperCase();
    }
    // fallback to US country
    if (lang && lang.toLowerCase() === 'en') {
        return 'GB';
    }

    return null;
}
