import { ref, Ref, computed, ComputedRef, watch, SetupContext } from '@vue/composition-api';
import PhoneNumber from 'awesome-phonenumber';

import { IProps, IPhoneObject, ParseMode } from '@/components/models';
import useDropdow from '@/mixin/useDropdown';
// import useCountries from '@/mixin/useCountries';

export default function (props: IProps, ctx: SetupContext) {
    const dropdown = useDropdow(props, ctx);

    // const proxyPhone: Ref<string> = ref(props.value);
    const phone: Ref<string> = ref(props.value.trim());
    const cursorPosition: Ref<number> = ref(0);

    // const { findCountry } = useCountries(props);
    /**
     * Computed
     */
    const isAllowedInternationalInput = computed(() => !props.disabledDropdown);
    const parsedPlaceholder: ComputedRef<string> = computed(() => {
        if (props.dynamicPlaceholder && dropdown.activeCountry.iso2) {
            // As for me doesnt make sense to confuse user and show hint with country code
            // const mode = props.mode || 'international';

            return PhoneNumber.getExample(dropdown.activeCountry.iso2, 'mobile').getNumber('national');
        }

        return props.inputPlaceholder;
    });
    const phoneObject: ComputedRef<IPhoneObject> = computed(() => ({
        ...new PhoneNumber(phone.value, dropdown.activeCountry.iso2).toJSON(),
        isIntlInput: isInternationalInput(phone.value),
        country: dropdown.activeCountry,
    }));
    const parsedMode: ComputedRef<ParseMode> = computed(() => {
        if (props.customRegExp) {
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

        if (!phone.value || !phoneObject.value.isIntlInput) {
            return 'national';
        }

        return 'international';
    });
    const phoneText: ComputedRef<string> = computed(() => {
        let key: ParseMode = 'input';

        if (phoneObject.value.valid) {
            key = parsedMode.value;
        }

        return phoneObject.value.number[key] || '';
    });

    /**
     * Watchers
     */
    function watchPhone(value = '', oldValue = '') {
        // phone.value = value;
        // ctx.emit('input', value);

        // const isValidCharactersOnly = props.validCharactersOnly && !testCharacters();
        // const isCustomValidate = props.customRegExp && !testCustomValidate();

        // if (isValidCharactersOnly || isCustomValidate) {
        //     ctx.root.$nextTick(() => {
        //         phone.value = oldValue;
        //     });
        // }
        if (value && isInternationalInput(value) && isAllowedInternationalInput.value) {
            const code = PhoneNumber.call(null, phoneObject.value.number.international || '').getRegionCode();

            dropdown.selectCountry(code);
        }

        // Reset the cursor to current position if it's not the last character.
        if (cursorPosition.value < oldValue.length) {
            ctx.root.$nextTick(() => {
                // setCaretPosition(this.$refs.input, cursorPosition);
            });
        }
    }
    watch(() => phone.value, watchPhone, { immediate: false });

    function watchValue(value = '') {
        phone.value = value;
    }
    watch(() => props.value, watchValue);

    function watchPhoneValidity(value = false) {
        if (value) {
            phone.value = phoneText.value;
        }

        ctx.root.$nextTick(() => {
            ctx.emit('validate', phoneObject.value);
        });
    }
    watch(() => phoneObject.value.valid, watchPhoneValidity);

    /**
     * Methods
     */
    function testCharacters(value = phone.value) {
        const re = /^[()\-+0-9\s]*$/;

        return re.test(value);
    }
    function testCustomValidate(value = phone.value): boolean {
        return props.customRegExp instanceof RegExp
            ? props.customRegExp.test(value)
            : false;
    }
    function isInternationalInput(phoneInput = phone.value) {
        if (typeof phoneInput === 'string') {
            // return /^(?!00|\+)[()\-0-9\s]*$/gi.test()
            return phoneInput[0] === '+' || (phoneInput.length > 2 && phoneInput.startsWith('00'));
        }

        throw new TypeError(`DmcTelInput: phoneInput in isInternationalInput has to be as string. Got ${typeof phoneInput}`);
    }
    function setCaretPosition(ctrl, pos) {
        // Modern browsers
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        }
        // IE8 and below
        else if (ctrl.createTextRange) {
            const range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    return {
        ...dropdown,
        phone,
        cursorPosition,

        parsedPlaceholder,
        parsedMode,
        phoneObject,
        phoneText,
        isAllowedInternationalInput,

        isInternationalInput,
        testCharacters,
        testCustomValidate,
        setCaretPosition,
    };
}
