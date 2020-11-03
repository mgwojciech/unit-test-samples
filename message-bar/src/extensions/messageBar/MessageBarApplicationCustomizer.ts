import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'MessageBarApplicationCustomizerStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { SPClientProvider } from './../../logic/utils/SPClientProvider';
import { AsyncMessageBarComponent, IAsyncMessageBarProps } from "./../../components/AsyncMessageBarComponent";

const LOG_SOURCE: string = 'MessageBarApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IMessageBarApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class MessageBarApplicationCustomizer
  extends BaseApplicationCustomizer<IMessageBarApplicationCustomizerProperties> {

  @override
  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    SPClientProvider.Context = this.context;
    const element: React.ReactElement<IAsyncMessageBarProps> = React.createElement(
      AsyncMessageBarComponent,
      {
        SiteUrl: this.context.pageContext.site.absoluteUrl
      }
    );
    let placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, {
      onDispose: this.onDispose
    });
    ReactDom.render(element, placeholder.domElement);
  }
}
