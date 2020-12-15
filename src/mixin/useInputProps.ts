import { PropType } from '@vue/composition-api';

export default {
    inputTabIndex: {
        type: (Number as unknown) as PropType<number>,
        default: () => 0,
    },
    customRegExp: {
        type: (RegExp as unknown) as PropType<RegExp>,
        default: () => null,
    },
    validCharactersOnly: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => true,
    },
    inputPlaceholder: {
        type: (String as unknown) as PropType<string>,
        default: () => '5x xxx xxxx',
    },
    dynamicPlaceholder: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => true,
    },
};
