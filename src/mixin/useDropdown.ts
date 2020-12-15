import { reactive, ref, Ref, computed, SetupContext } from '@vue/composition-api';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isPlainObject from 'lodash/isPlainObject';
import toLower from 'lodash/toLower';

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

    const activeCountry: Partial<ICountry> = reactive({
        iso2: props.defaultCountry, // selected country object
    });
    // const dropdown: Partial<ICountry> = reactive({});
    const dropdownSearch: Ref<string> = ref('');
    const dropdownOpenDirection: Ref<DropdowPosition> = ref('is-bottom-right');

    /**
     * Computed
     */
    const fileredCountriesModel = computed(() => countries.sortedCountries.value.filter(option => matchInputCountry(option.name) || matchInputCountry(option.dialCode)));

    /**
     * Methods
     */
    function matchInputCountry(c = '') {
        return String.prototype.includes.call(toLower(c), toLower(dropdownSearch.value));
    }
    function selectCountry(country: ICountry | string) {
        if (isNil(country) || country === '') {
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
                    lastPreffered: !!selected.lastPreffered,
                },
        );
    }
    function setDropdownPosition(el: HTMLElement, minOffset = 200) {
        const spaceBelow = window.innerHeight - el.getBoundingClientRect().bottom;
        const hasEnoughSpaceBelow = spaceBelow > minOffset;

        if (hasEnoughSpaceBelow) {
            dropdownOpenDirection.value = 'is-bottom-right';
        }
        else {
            dropdownOpenDirection.value = 'is-top-right';
        }

        return dropdownOpenDirection.value;
    }

    function getBoolean(prop, key) {
        return typeof prop === 'boolean'
            ? prop
            : get(prop, key, false);
    }

    return {
        ...countries,

        activeCountry,
        // dropdown,
        dropdownSearch,
        dropdownOpenDirection,

        fileredCountriesModel,

        selectCountry,
        setDropdownPosition,
        getBoolean,
    };
}
