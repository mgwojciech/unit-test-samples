declare interface ICopyItemCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CopyItemCommandSetStrings' {
  const strings: ICopyItemCommandSetStrings;
  export = strings;
}
