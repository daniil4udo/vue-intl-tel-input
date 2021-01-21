export function isLocalStorageAccessSafe() {
    const TEST_KEY = 'isLocalStorageAccessSafe';
    const TEST_VALUE = 'true';

    try {
        localStorage.setItem(TEST_KEY, TEST_VALUE);
        localStorage.removeItem(TEST_KEY);

        return true;
    }
    catch (e) {
        return false;
    }
}
