import { IGraphDate } from "./IGraphDate";

export interface IGraphEvent {
    id: string;
    subject: string;
    bodyPreview: string;
    importance: string;
    isAllDay: boolean;
    start: IGraphDate;
    end: IGraphDate;
    onlineMeeting: {
        joinUrl: string;
    };
    body:{
        contentType: string;
        content: string;
    };
}