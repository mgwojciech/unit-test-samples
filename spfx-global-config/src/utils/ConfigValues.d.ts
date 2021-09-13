declare interface IConfigValues {
    TestKey: string;
}

declare module "ConfigValues" {
    const strings: IConfigValues;
    export = strings;
}
