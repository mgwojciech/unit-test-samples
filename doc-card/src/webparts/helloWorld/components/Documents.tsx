import * as React from "react";
import { IDocumentsProvider } from "../../../dal/IDocumentsProvider";
import { IDocument } from "../../../model/IDocument";

export interface IDocumentsProps{
    documentsProvider: IDocumentsProvider;
}

export function Documents(props: IDocumentsProps){

    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<IDocument[]>([]);

    React.useEffect(()=>{
        props.documentsProvider.getDocuments().then(docs=>{
            setData(docs);
            setLoading(false);
        })
    }, []);

    if(loading){
        return <div data-testid="documents-loading-animation" />;
    }
    else{
        return <div>{data.map(doc=><a data-testid="document-href-element" key={doc.id} href={doc.url}>{doc.title}</a>)}</div>;
    }
}