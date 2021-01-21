import { isDefined } from './isDefined';

export function has<T>(o: T, key: string) {
    return isDefined(o) && Object.prototype.hasOwnProperty.call(o, key);
}
