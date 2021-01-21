export function getBool<T>(prop: T, path: string): boolean {
    return typeof prop === 'boolean' ? prop : !!prop[path];
}
