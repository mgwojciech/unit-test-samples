import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IHttpClient } from "./IHttpClient";
import {
    Environment,
    EnvironmentType
  } from '@microsoft/sp-core-library';
import { SharePointHttpClient } from "./SharePointHttpClient";
import { MockHttpClient } from "./MockHttpClient";

export class SPClientProvider{
    public static Context : WebPartContext | ApplicationCustomizerContext;
    public static MockGetRequests: {requestUrl: string, response: string}[] = [];
    public static MockPostRequests: {requestUrl: string, response: string}[] = [];
    public static MockOnRequest: (url:string, options?:any)=>void;
    public static GetSPHttpClient() : IHttpClient{
        if(Environment.type === EnvironmentType.Local || Environment.type === EnvironmentType.Test){
            let result = new MockHttpClient();
            result.GetRequests = this.MockGetRequests;
            result.PostRequests = this.MockPostRequests;
            result.OnRequest = this.MockOnRequest;

            return result;
        }
        else{
            return new SharePointHttpClient(this.Context.spHttpClient);
        }
    }
}