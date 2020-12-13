import { ref, Ref, computed, ComputedRef, watch, SetupContext } from '@vue/composition-api';
import PhoneNumber from 'awesome-phonenumber';

import { ICountry } from '@/assets/all-countries';
import useCountries from '@/mixin/useCountries';

interface IPhoneObject {
    number: {
        input: string;
        international: string;
        national: string;
        e164: string;
        rfc3966: string;
        significant: string;
    };
    regionCode: string;
    valid: boolean;
    possible: boolean;
    canBeInternationallyDialled: boolean;
    type: string;
    possibility: string;
    country: ICountry;
}
export default function (props, ctx: SetupContext, country: ICountry) {
    const phone: Ref<string> = ref(props.value || '');
    const cursorPosition = ref(0);

    const { findCountry } = useCountries(props);
    /**
     * Computed
     */

    const parsedPlaceholder: ComputedRef<string> = computed(() => {
        if (props.dynamicPlaceholder && country.iso2) {
            // As for me doesnt make sense to confuse user and show hint with country code
            // const mode = props.mode || 'international';

            return PhoneNumber.getExample(country.iso2, 'mobile').getNumber('national');
        }

        return props.inputPlaceholder;
    });
    const parsedMode: ComputedRef<string> = computed(() => {
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

        if (!phone.value || !isInternationalInput(phone.value)) {
            return 'national';
        }

        return 'international';
    });
    const phoneObject: ComputedRef<IPhoneObject> = computed(() => ({
        ...new PhoneNumber(phone.value, country.iso2).toJSON(),
        country,
    }));
    const phoneText: ComputedRef<string> = computed(() => {
        let key = 'input';

        if (phoneObject.value.valid) {
            key = parsedMode.value;
        }

        return phoneObject.value.number[key] || '';
    });

    const proxyPhone = computed({
        get: () => phone.value,
        set: value => {
            phone.value = value;
            ctx.emit('input', value);

            if (isInternationalInput(value)) {
                // const code = PhoneNumber.call(null, value).getRegionCode();
                const code = PhoneNumber.call(null, phoneObject.value.number.international || '').getRegionCode();

                if (code && findCountry(code)) {
                    Object.assign(country, findCountry(code));

                    if (!findCountry(code)?.preferred) {
                        country.preferred = false;
                    }
                }
            }
        },
    });
    /**
     * Watchers
     */
    function watchValue(value) {
        phone.value = value;
    }
    watch(() => props.value, watchValue, { immediate: true });

    function watchPhoneObject(value) {
        if (value) {
            phone.value = phoneText.value;
        }
        ctx.emit('validate', phoneObject.value);
    }
    watch(() => phoneObject.value.valid, watchPhoneObject);

    /**
     * Methods
     */
    function testCharacters() {
        const re = /^[()\-+0-9\s]*$/;
        return re.test(phone.value);
    }
    function testCustomValidate(): boolean {
        return props.customValidate instanceof RegExp
            ? props.customValidate.test(phone.value)
            : false;
    }
    function isInternationalInput(phoneInput: string) {
        return phoneInput[0] === '+' || phoneInput.startsWith('00');
    }
    // function setCaretPosition(ctrl, pos) {
    //     // Modern browsers
    //     if (ctrl.setSelectionRange) {
    //         ctrl.focus();
    //         ctrl.setSelectionRange(pos, pos);
    //     }
    //     // IE8 and below
    //     else if (ctrl.createTextRange) {
    //         const range = ctrl.createTextRange();
    //         range.collapse(true);
    //         range.moveEnd('character', pos);
    //         range.moveStart('character', pos);
    //         range.select();
    //     }
    // }

    return {
        phone,
        cursorPosition,

        proxyPhone,
        parsedPlaceholder,
        parsedMode,
        phoneObject,
        phoneText,

        testCharacters,
        testCustomValidate,
    };
}
