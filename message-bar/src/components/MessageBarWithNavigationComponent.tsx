import * as React from "react";
import { IMessage } from "./../logic/model/IMessage";

export interface IMessageBarWithNavigationComponentProps {
    Messages: IMessage[];
}
export interface IMessageBarWithNavigationComponentComponentState {
    VisibleMessage: IMessage;
}

export class MessageBarWithNavigationComponent extends React.Component<IMessageBarWithNavigationComponentProps, IMessageBarWithNavigationComponentComponentState>{
    constructor(props: IMessageBarWithNavigationComponentProps) {
        super(props);
        this.state = {
            VisibleMessage: props.Messages[0]
        };
        this.renderPrevious = this.renderPrevious.bind(this);
        this.renderNext = this.renderNext.bind(this);
    }
    private renderPrevious(){
        let currentIndex = this.props.Messages.indexOf(this.state.VisibleMessage);
        let previousIndex = ((currentIndex - 1) + this.props.Messages.length) % this.props.Messages.length;
        this.setState({
            VisibleMessage: this.props.Messages[previousIndex]
        });
    }
    private renderNext(){
        let currentIndex = this.props.Messages.indexOf(this.state.VisibleMessage);
        let nextIndex = (currentIndex + 1) % this.props.Messages.length;
        this.setState({
            VisibleMessage: this.props.Messages[nextIndex]
        });
    }
    private renderMessage(message: IMessage): JSX.Element {
        return <div key={message.Id}>
            <button className="button_prev ms-Button ms-Button--primary primaryButton root-138" onClick={this.renderPrevious}>Prev</button>
            <span className="simple_message">{message.Title}</span>
            <button className="button_next ms-Button ms-Button--primary primaryButton root-138" onClick={this.renderNext}>Next</button>
        </div>;
    }
    public render() {
        return <div>
            {this.props.Messages.length === 0 ? <span>No messages!</span> : this.renderMessage(this.state.VisibleMessage)}
        </div>;
    }
}