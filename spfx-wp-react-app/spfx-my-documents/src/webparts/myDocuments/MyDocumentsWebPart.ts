import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MyDocumentsWebPartStrings';
import { IUsedDocument } from "my-documents/lib/model/IUsedDocument";
import { IUsedDocumentsProps, UsedDocuments } from "my-documents/lib/components/UsedDocuments"
import { GraphODataPagedDataProvider, IPagedDataProvider } from 'mgwdev-m365-helpers/lib/dal';
import { SPFxGraphHttpClient } from 'mgwdev-m365-helpers';

export interface IMyDocumentsWebPartProps {
  description: string;
}

export default class MyDocumentsWebPart extends BaseClientSideWebPart<IMyDocumentsWebPartProps> {

  private _dataProvider: IPagedDataProvider<IUsedDocument>;
  public render(): void {

    const element: React.ReactElement<IUsedDocumentsProps> = React.createElement(
      UsedDocuments,
      {
        dataProvider: this._dataProvider,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    const spfxGraphClient = await this.context.aadHttpClientFactory.getClient('https://graph.microsoft.com');
    const graphClient = new SPFxGraphHttpClient(spfxGraphClient);
    this._dataProvider = new GraphODataPagedDataProvider(graphClient, 'https://graph.microsoft.com/v1.0/me/insights/used');
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
                PropertyPaneTextField('description', {
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
