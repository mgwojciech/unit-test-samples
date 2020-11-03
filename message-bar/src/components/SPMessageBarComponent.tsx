import * as React from "react";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { IMessage } from "./../logic/model/IMessage";
import { SPHttpClient } from "@microsoft/sp-http";
import { MessageBarWithNavigationComponent } from "./MessageBarWithNavigationComponent";

export interface ISPMessageBarComponentProps{
    context: ApplicationCustomizerContext
}
export interface ISPMessageBarComponentState{
    messages?: IMessage[];
    loading?: boolean;
}

export class SPMessageBarComponent extends React.Component<ISPMessageBarComponentProps,ISPMessageBarComponentState>{
    constructor(props: ISPMessageBarComponentProps){
        super(props);
        this.state = {
            loading: true
        };
    }

    public async componentDidMount():Promise<void>{
        let apiUrl = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Events')/items`;
        let eventsResponse = await this.props.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
        let events = await eventsResponse.json();
        this.setState({
            messages: events.value,
            loading: false
        });
    }
    public render(): JSX.Element{
        if(this.state.loading){
            return <div className="loading">Loading...</div>;
        }
        else{
            return <MessageBarWithNavigationComponent Messages={this.state.messages} />;
        }
    }
}