import isEmpty from 'lodash/isEmpty';

import { toUpper } from './toUpper';

export function createUniqueArray(a?: readonly string[]) {
    return !isEmpty(a)
        ? Array.from(new Set(a.map(toUpper)))
        : [];
}
