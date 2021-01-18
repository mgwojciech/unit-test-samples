export interface IField{
    InternalName: string;
    Title: string;
    Choices?: string[];
    Description?: string;
    TypeAsString: string;
    SspId?: string;
    TermSetId?: string;
}
export interface IFieldValue{
    name: string;
    type: string;
    value?: string;
}