import { IUsedDocument } from "../model/IUsedDocument";
import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardPreview,
    DocumentCardTitle,
    IDocumentCardPreviewProps,
  } from '@fluentui/react/lib/DocumentCard';
  import { ImageFit } from '@fluentui/react/lib/Image';
import * as React from "react";
export interface IUsedDocumentCardProps {
    document: IUsedDocument;
}
export function UsedDocumentCard(props: IUsedDocumentCardProps) {
    const previewProps: IDocumentCardPreviewProps = {
        previewImages: [
          {
            name: props.document.resourceVisualization.title,
            linkProps: {
              href: props.document.resourceReference.webUrl,
              target: '_blank',
            },
            previewImageSrc: props.document.resourceVisualization.previewImageUrl,
            previewIconProps:{
              iconName: 'OpenFile',
            },
            imageFit: ImageFit.cover,
            width: 318,
            height: 196,
          },
        ],
      };
    return <DocumentCard
        aria-label={props.document.resourceVisualization.title}
        onClickHref={props.document.resourceReference.webUrl}
    >
        <DocumentCardPreview {...previewProps} />
        <DocumentCardTitle
            title={props.document.resourceVisualization.title}
            shouldTruncate
        />
        <DocumentCardActivity activity={`Last accessed ${new Date(props.document.lastUsed.lastAccessedDateTime).toTimeString()}`} people={[]} />
    </DocumentCard>
}