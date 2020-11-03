import { IMessage } from "./IMessage";
import * as React from 'react';

export class SimpleMessage implements IMessage{
    public Id: number;    
    public Title: string;
    public Description?: string;
    public Link: string;
    constructor(message:IMessage){
        this.Id = message.Id;
        this.Title = message.Title;
        this.Description = message.Description;
        this.Link = message.Link;
    }
    public Render(): JSX.Element {
        return <div className="simple_message" key={this.Id}>
            {this.Title}
        </div>;
    }
}