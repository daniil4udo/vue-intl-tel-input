import { IPhoneObject } from '../components/models';

/**
 * So user can add custom validation message base on phone Object :)
 * @returns {String} - either generic string or object with keys are posibilities and values are String
 */
export function validationMessage(phoneObject: IPhoneObject): string {
    if (phoneObject && phoneObject.possibility && phoneObject.country.name_en) {
        const template = `Phone number error: ${phoneObject.possibility.replaceAll('-', ' ')} for ${phoneObject.country.name_en}`;

        switch (phoneObject.possibility) {
            case 'invalid-country-code': return template;
            case 'too-long': return template;
            case 'too-short': return template;
        }

        return `Phone number error: invalid phone for ${phoneObject.country.name_en}`;
    }

    // Most probable scenario that at this pooint we dont have country setted yet
    return 'Phone number error: country is unknown';
}