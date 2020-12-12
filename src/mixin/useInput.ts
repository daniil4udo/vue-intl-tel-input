import { ref, computed, SetupContext } from '@vue/composition-api';
import PhoneNumber from 'awesome-phonenumber';

import { ICountry } from '@/assets/all-countries';

export default function (props, ctx: SetupContext, country: ICountry) {
    const phone = ref('');
    const cursorPosition = ref(0);

    /**
     * Computed
     */
    const parsedMode = computed(() => {
        if (props.customValidate) {
            return 'input';
        }
        if (props.mode) {
            if (![ 'international', 'national' ].includes(props.mode)) {
                console.error('Invalid value of prop "mode"');
            }
            else {
                return props.mode;
            }
        }
        if (!phone.value || phone.value[0] !== '+') {
            return 'national';
        }
        return 'international';
    });
    const phoneObject = computed(() => {
        const result = PhoneNumber.call(null, phone.value, country.iso2).toJSON();

        Object.assign(result, {
            isValid: result.valid,
            country,
        });

        return result;
    });
    const phoneText = computed(() => {
        let key = 'input';
        if (phoneObject.value.valid) {
            key = parsedMode.value;
        }
        return phoneObject.value.number[key] || '';
    });

    /**
      * Methods
      */
    function testCharacters() {
        const re = /^[()\-+0-9\s]*$/;
        return re.test(phone.value);
    }
    function testCustomValidate() {
        return props.customValidate instanceof RegExp
            ? props.customValidate.test(phone.value)
            : false;
    }

    return {
        phone,
        cursorPosition,

        parsedMode,
        phoneObject,
        phoneText,

        testCharacters,
        testCustomValidate,
    };
}
