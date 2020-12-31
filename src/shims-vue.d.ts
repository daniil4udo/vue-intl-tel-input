declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module '*.scss';

type ObjectKeys<T> =
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Array<any> | string ? string[] :
  never;

declare interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}

declare interface Navigator  {
    userLanguage?: string;
    browserLanguage?: string;
    systemLanguage?: string;
}