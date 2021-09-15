import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AsyncCardAdaptiveCardExtensionStrings';
import { AsyncCardController } from '../../../controller/AsyncCardController';
import { IAsyncCardAdaptiveCardExtensionProps, IAsyncCardAdaptiveCardExtensionState } from '../AsyncCardAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IAsyncCardAdaptiveCardExtensionProps,
  IAsyncCardAdaptiveCardExtensionState,
  IQuickViewData
> {
  constructor(protected controller: AsyncCardController){
    super();
  }
  public get data(): IQuickViewData {
    if (!this.state.detailsLoaded) {
      this.controller.getManager().then(manager=>{
        this.setState({
          ...this.state,
          manager,
          detailsLoaded: true
        })
      })
      return {
        subTitle: "",
        title: "Loading details",
        description: ""
      };
    }
    else{
      return {
        subTitle: this.state.user.jobTitle,
        title: this.state.user.displayName,
        description: this.state.manager.displayName
      }
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}