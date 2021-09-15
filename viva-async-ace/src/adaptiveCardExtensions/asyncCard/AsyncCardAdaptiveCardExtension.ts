import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AsyncCardPropertyPane } from './AsyncCardPropertyPane';
import { AsyncCardController } from '../../controller/AsyncCardController';
import { IUser } from '../../model/IUser';

export interface IAsyncCardAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IAsyncCardAdaptiveCardExtensionState {
  description: string;
  user?: IUser;
  manager?: IUser;
  detailsLoaded?: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'AsyncCard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AsyncCard_QUICK_VIEW';

export default class AsyncCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAsyncCardAdaptiveCardExtensionProps,
  IAsyncCardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AsyncCardPropertyPane | undefined;
  private controller: AsyncCardController;
  public async onInit(): Promise<void> {
    this.controller = new AsyncCardController(this.context);
    let me = await this.controller.getInitialData();
    this.state = {
      description: this.properties.description,
      user: me
    };
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView(this.controller));

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AsyncCard-property-pane'*/
      './AsyncCardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AsyncCardPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
