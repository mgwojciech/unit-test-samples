import * as React from 'react';
import { IMessage } from "./../logic/model/IMessage";

export interface IMessageBarComponentProps{
    Messages: IMessage[];
}
export interface IMessaageBarComponentState{
    Visible: boolean;
}

export class MessageBarComponent extends React.Component<IMessageBarComponentProps, IMessaageBarComponentState>{
    constructor(props: IMessageBarComponentProps){
        super(props);
    }
    private renderMessage(message: IMessage): JSX.Element{
        return <div className="simple_message" key={message.Id}>{message.Title}</div>;
    }
    public render(){
        let renderedMessages = this.props.Messages.map(message=>{
            return this.renderMessage(message);
        });
        return <div>
            {this.props.Messages.length === 0 && <span>No messages!</span>}
            {renderedMessages}
        </div>;
    }
}