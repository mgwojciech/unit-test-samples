import { IUsedDocument } from "../model/IUsedDocument";
import { UsedDocumentCard } from "./UsedDocumentCard";
import * as React from "react";

export interface IUsedDocumentsGridProps {
    documents: IUsedDocument[];
}

export function UsedDocumentsGrid(props: IUsedDocumentsGridProps) {
    return <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gridGap: "10px",
    }}>{props.documents.map(doc=><UsedDocumentCard key={doc.id} document={doc} />)}</div>
}