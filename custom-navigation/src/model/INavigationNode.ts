export interface INavigationNode {
    title: string;
    url: string;
    id: string;
    fileDirRef: string;
    fileLeafRef: string;
    childCount: number;
}

export interface ISPNavigationNode {
    Title: string;
    URL: string;
    FileDirRef: string;
    FileLeafRef: string;
    ItemChildCount: number;
    FolderChildCount: number;
    ID: string;
}