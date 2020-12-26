import PhoneNumber from 'awesome-phonenumber';
import { Component, Mixins, Watch } from 'vue-property-decorator';

import { IPhoneObject, ParseMode } from '@/components/models';
import Dropdown from '@/mixin/useDropdown';
import { isDefined } from '@/utils/';
// import useCountries from '@/mixin/useCountries';

@Component
export default class Input extends Mixins(Dropdown) {
    public cursorPosition = 0;

    /**
     * V-MODEL
     * Do not modify. Important for v-model to work
     */
    public get phone() {
        return this.value;
    }

    public set phone(value) {
        /**
         * Returns response.number to assign it to v-model (if being used)
         * Returns full response for cases @input is used
         * and parent wants to return the whole response.
         */
        this.$emit('input', value, this.phoneData);
    }
    /**
     * V-MODEL
     */

    public get isAllowedInternationalInput() {
        return !this.disabledDropdown;
    }

    public get parsedPlaceholder() {
        if (this.dynamicPlaceholder && this.activeCountry.iso2) {
            const mode = this.mode || 'international';

            return PhoneNumber.getExample(this.activeCountry.iso2, this.placeholderNumberType).getNumber(mode);
        }

        return this.inputPlaceholder;
    }

    public get phoneData(): IPhoneObject {
        return {
            ...new PhoneNumber(this.phone, this.activeCountry.iso2).toJSON(),
            isIntlInput: this.isInternationalInput(this.phone),
            country: this.activeCountry,
        };
    }

    public get parsedMode(): ParseMode {
        if (this.customRegExp) {
            return 'e164';
        }

        if (this.mode) {
            // TODO: have mode validator. revisit later
            if (![ 'international', 'national' ].includes(this.mode)) {
                console.error('Invalid value of prop "mode"');
            }
            else {
                return this.mode;
            }
        }

        if (!this.phone || !this.phoneData.isIntlInput) {
            return 'national';
        }

        return 'international';
    }

    public get formattedPhone() {
        // let key: ParseMode = 'e164';

        // if (this.phoneData.valid) {
        //     key = this.parsedMode;
        // }

        return this.phoneData.number[this.parsedMode] || '';
    }

    @Watch('phone', { immediate: false })
    onPhoneChanged(value: string) {
        if (isDefined(value)) {
            // const isValidCharactersOnly = this.validCharactersOnly && !testCharacters();
            // const isCustomValidate = this.customRegExp && !testCustomValidate();

            // if (isValidCharactersOnly || isCustomValidate) {
            //     $root.$nextTick(() => {
            //         this.phone = oldValue;
            //     });
            // }

            // this.phone = this.phoneData.number[this.mode];

            // if Intl input is not allowed just remove first char
            // if (value && this.isInternationalInput(value) && !this.isAllowedInternationalInput) {
            //     this.phone = this.phone.substring(1);
            // }

            // Reset the cursor to current position if it's not the last character.
            // if (this.cursorPosition < oldValue.length) {
            //     this.$nextTick(() => {
            //         // TODO: check for correct refs
            //         setCaretPosition(this.$refs.refPhoneInput.$refs.input, this.cursorPosition);
            //     });
            // }
        }
    }

    @Watch('phoneData.regionCode', { immediate: false })
    watchPhoneRegionCode(code: string) {
        if (isDefined(code) && this.isAllowedInternationalInput) {
            this.setActiveCountry(code);

            /**
             * In case user start input with +, format it base on this.mode
             */
            this.phone = this.formattedPhone;
        }
    }

    public testCharacters(value = this.phone) {
        return /^[()\-+0-9\s]*$/.test(value);
    }

    public testCustomValidate(value = this.phone): boolean {
        return this.customRegExp instanceof RegExp
            ? this.customRegExp.test(value)
            : false;
    }

    public isInternationalInput(phoneInput = this.phone) {
        if (typeof phoneInput === 'string') {
            // return /^(?!00|\+)[()\-0-9\s]*$/gi.test()
            return phoneInput[0] === '+' || (phoneInput.length > 2 && phoneInput.startsWith('00'));
        }

        throw new TypeError(`[isInternationalInput]: phoneInput in isInternationalInput has to be as string. Got ${typeof phoneInput}`);
    }
}
