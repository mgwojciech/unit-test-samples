import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpFxFullStackSampleWebPartStrings';
import { BatchGraphClient, IHttpClient, SPFxGraphHttpClient } from "mgwdev-m365-helpers";
import { SPFxBackendClient } from '../../dal/SPFxBackendClient';
import { IHelloComponentProps,  HelloComponent} from "client-app/lib/components/HelloComponent";


export interface ISpFxFullStackSampleWebPartProps {
  appIdUri: string;
  backendUrl: string;
}

export default class SpFxFullStackSampleWebPart extends BaseClientSideWebPart<ISpFxFullStackSampleWebPartProps> {

  protected backendClient: IHttpClient;
  protected graphClient: IHttpClient;
  private defaultAppIdUri: string = "<app-id-uri>";
  public render(): void {
    const element: React.ReactElement<IHelloComponentProps> = React.createElement(
      HelloComponent,
      {
        backendClient: this.backendClient,
        graphClient: this.graphClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    const [graphSPFxClient, backendSPFxClient] = await Promise.all(
      [
        this.context.aadHttpClientFactory.getClient('https://graph.microsoft.com'),
        this.context.aadHttpClientFactory.getClient(this.properties.appIdUri || this.defaultAppIdUri)
      ]
    );
    this.graphClient = new BatchGraphClient(new SPFxGraphHttpClient(graphSPFxClient)); 
    this.backendClient = new SPFxBackendClient(backendSPFxClient, this.properties.backendUrl || "https://localhost:44440/");
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('appIdUri', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('backendUrl', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
