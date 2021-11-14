import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpFxUnitTestsSampleWebPartStrings';
import SpFxUnitTestsSample from './components/SpFxUnitTestsSample';
import { ISpFxUnitTestsSampleProps } from './components/ISpFxUnitTestsSampleProps';

export interface ISpFxUnitTestsSampleWebPartProps {
  description: string;
}

export default class SpFxUnitTestsSampleWebPart extends BaseClientSideWebPart<ISpFxUnitTestsSampleWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpFxUnitTestsSampleProps> = React.createElement(
      SpFxUnitTestsSample,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
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
