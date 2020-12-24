// type Keys = keyof typeof IunicodeSupportTestMap;
// type Values = typeof unicodeSupportTestMap[Keys];
// type TestMap = Record<Keys, Values>

export interface IUnicodeSupportTestMap {
    'personZwj': string;
    'horseRacing': string;
    'flag': string;
    'rainbowFlag': string;
    'skinToneModifier': string[];

    '9.0': string;
    '8.0': string;
    '7.0': string;
    '6.1': string;
    '6.0': string;
    '5.2': string;
    '5.1': string;
    '4.1': string;
    '4.0': string;
    '3.2': string;
    '3.0': string;
    '1.1': string;
}

export interface IResultMap extends IUnicodeSupportTestMap {
    meta?: {
        isChrome: boolean;
        chromeVersion: number;
    };
}
