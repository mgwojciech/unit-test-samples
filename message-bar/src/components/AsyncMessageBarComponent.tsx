import * as React from "react";
import { IMessage } from "./../logic/model/IMessage";
import { EventMessageManager } from "./../logic/EventMessageManager";
import { EventMessageProvider } from "./../logic/dataProvider/EventMessageProvider";
import { SPClientProvider } from "./../logic/utils/SPClientProvider";
import { MessageBarWithNavigationComponent } from "./MessageBarWithNavigationComponent";

export interface IAsyncMessageBarProps{
    ListTitle?: string;
    SiteUrl: string;
    OnDataLoaded?: ()=>void;
}
export interface IAsyncMessageBarState{
    messages?: IMessage[];
    loading?: boolean;
}

export class AsyncMessageBarComponent extends React.Component<IAsyncMessageBarProps,IAsyncMessageBarState>{
    protected Manager: EventMessageManager;
    constructor(props: IAsyncMessageBarProps){
        super(props);
        this.state = {
            loading: true
        };
    }
    public async componentDidMount(){
        let messageProvider = new EventMessageProvider(SPClientProvider.GetSPHttpClient(), this.props.SiteUrl, this.props.ListTitle);
        this.Manager = new EventMessageManager(messageProvider);
        let messages = await this.Manager.GetMessages();

        this.setState({
            messages,
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