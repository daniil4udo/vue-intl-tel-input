import { toUpper } from './toUpper';
/**
 * Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)
 */
export async function fetchISO() {
    try {
        const result = await (await fetch('https://ip2c.org/s')).text();

        if (result && result[0] === '1') {
            return toUpper(result.substr(2, 2));
        }
    }
    catch (err) {
        throw new Error('[fetchISO]: Error while fetching country code');
    }
}
