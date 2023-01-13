export interface IResourceVisualization {
    title: string;
    type: string;
    mediaType: string;
    previewImageUrl: string;
    previewText: string;
    containerWebUrl: string;
    containerDisplayName: string;
    containerType: string;
}

export interface IResourceReference {
    webUrl: string;
    id: string;
    type: string;
}

export interface IUsedDocument{
    id: string;
    lastUsed: {
        lastAccessedDateTime: string;
        lastModifiedDateTime: string;
    }
    resourceVisualization: IResourceVisualization;
    resourceReference: IResourceReference;
}