import { reactive, ref, Ref, SetupContext } from '@vue/composition-api';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isPlainObject from 'lodash/isPlainObject';

import { IProps, ICountry, DropdowPosition } from '@/components/models';

import useCountries from './useCountries';

export default function (props: IProps, ctx: SetupContext) {
    if (props.defaultCountry && props.fetchCountry) {
        throw new Error('DmcTelInput: Do not use \'fetch-country\' and \'default-country\' options in the same time');
    }

    /**
     * Data
     */
    const countries = useCountries(props);

    const activeCountry: Partial<ICountry & { model: string }> = reactive({
        model: '', // v-model for autocomplete
        iso2: props.defaultCountry, // selected country object
    });
    const dropdownOpenDirection: Ref<DropdowPosition> = ref('auto');

    function selectCountry(country: ICountry | string) {
        if (isNil(country)) {
            // for (const key in activeCountry) {
            //     if (has(activeCountry, key)) {
            //         activeCountry[key] = '';
            //     }
            // }
            return activeCountry;
        }
        if (typeof country !== 'string' && !isPlainObject(country)) {
            throw new TypeError(`Country argument has to be a string or an object. Got ${typeof country}`);
        }

        const selected = typeof country === 'string'
            ? countries.getCountryByISO(country)
            : country;

        return Object.assign(
                activeCountry,
                selected,
                {
                    preferred: !!selected.preferred,
                    model: getCountryFormat(selected),
                },
        );
    }
    function setDropdownPosition() {
        const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom;
        const hasEnoughSpaceBelow = spaceBelow > 200;

        if (hasEnoughSpaceBelow) {
            dropdownOpenDirection.value = 'bottom';
        }
        else {
            dropdownOpenDirection.value = 'top';
        }
    }

    /**
     * Template to displain in the countries autocomplete
     */
    function getCountryFormat(country: ICountry) {
        return `${country.emoji} +${country.dialCode}`;
    }

    function getBoolean(prop, key) {
        return typeof prop === 'boolean'
            ? prop
            : get(prop, key, false);
    }

    return {
        ...countries,

        activeCountry,
        dropdownOpenDirection,

        selectCountry,
        getCountryFormat,
        setDropdownPosition,
        getBoolean,
    };
}
