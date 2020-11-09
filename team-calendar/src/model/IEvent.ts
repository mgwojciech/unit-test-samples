export interface IEvent{
    id: string;
    startTime: Date;
    endTime: Date;
    subject: string;
    bodyPreview: string;
    eventBody: string;
    joinLink: string;
}