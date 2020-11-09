import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TeamsCalendarWebPartStrings';
import TeamsCalendar from './components/TeamsCalendar';
import { ITeamsCalendarProps } from './components/ITeamsCalendarProps';

export interface ITeamsCalendarWebPartProps {
  description: string;
}

export default class TeamsCalendarWebPart extends BaseClientSideWebPart<ITeamsCalendarWebPartProps> {

  public async onInit() {
  }
  public render(): void {
    const element: React.ReactElement<ITeamsCalendarProps> = React.createElement(
      TeamsCalendar,
      {
        context: this.context
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
