import * as React from "react";
import { SPDocument } from "../model/SPDocument";
import {
    Body1,
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    Image,
    Text
} from "@fluentui/react-components";
import Utilities from "../utils/Utilities";

export type DocumentCardProps = {
    document: SPDocument;
}

export function DocumentCard(props: DocumentCardProps) {
    return <Card key={props.document.NormUniqueId}>
        <CardHeader image={
            <Image src={Utilities.getFileImageUrl(props.document.Path)} />
        }
            header={
                <Body1>
                    <b>{props.document.Title}</b>
                </Body1>
            }
        >
        </CardHeader>
        <CardPreview>
        </CardPreview>
        <CardFooter>
            <Text>Last Modified: {(new Date(props.document.LastModifiedTime).toLocaleDateString())}</Text>
            <Text>Modified By: {props.document.ModifiedBy}</Text>
        </CardFooter>
    </Card>
}