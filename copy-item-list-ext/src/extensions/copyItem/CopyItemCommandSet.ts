import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import * as React from "react";
import * as ReactDom from "react-dom";
import { CopyItemForm } from "../../components/CopyItemForm";

import * as strings from 'CopyItemCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICopyItemCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'CopyItemCommandSet';

export default class CopyItemCommandSet extends BaseListViewCommandSet<ICopyItemCommandSetProperties> {

  private panelPlaceHolder: HTMLDivElement = null;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized CopyItemCommandSet');
    this.panelPlaceHolder = document.body.appendChild(document.createElement("div"));
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length > 0;
    }
  }

  public showPanel = (event) => {
    const element: React.ReactElement = React.createElement(CopyItemForm, {
      context: this.context,
      event: event,
      open: true
    });
    ReactDom.render(element, this.panelPlaceHolder);
  }
  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        this.showPanel(event);
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
