import { IPagedDataProvider } from "mgwdev-m365-helpers/lib/dal/dataProviders";
import { IUsedDocument } from "../model/IUsedDocument";
import { Spinner } from "@fluentui/react";
import * as React from "react";
import { UsedDocumentsGrid } from "./UsedDocumentsGrid";

export interface IUsedDocumentsProps {
    dataProvider: IPagedDataProvider<IUsedDocument>;
}

export function UsedDocuments(props: IUsedDocumentsProps) {
    const [documents, setDocuments] = React.useState<IUsedDocument[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        props.dataProvider.getData().then((data) => {
            setDocuments(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Spinner />;
    }
    return <UsedDocumentsGrid documents={documents} />;
}