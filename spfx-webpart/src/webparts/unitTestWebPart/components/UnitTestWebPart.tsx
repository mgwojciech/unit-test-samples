import * as React from 'react';
import { IUnitTestWebPartProps } from './IUnitTestWebPartProps';
import { ItemsWithAuthorDetailsManager } from '../../../manager/ItemsWithAuthorDetailsManager';
import { SPFxSPHttpClient } from '../../../dal/SPFxSPHttpClient';
import { DIListItemProvider } from '../../../dal/DIListItemProvider';
import { ISPListItem } from '../../../model/ISPListItem';
import { IUserListItem } from '../../../model/IUserListItem';
import { ItemsWithAdminInfo } from '../../../components/ItemsWithAdminInfo';
import { ComplexComponent } from '../../../components/ComplexComponent';

export default class UnitTestWebPart extends React.Component<IUnitTestWebPartProps, {}> {
  private manager: ItemsWithAuthorDetailsManager;
  constructor(props: IUnitTestWebPartProps) {
    super(props);
    const httpClient = new SPFxSPHttpClient(this.props.context.spHttpClient);
    const itemsProvider = new DIListItemProvider<ISPListItem>(httpClient, this.props.context.pageContext.web.absoluteUrl, "Documents");
    const usersProvider = new DIListItemProvider<IUserListItem>(httpClient, this.props.context.pageContext.web.absoluteUrl, "User Information List");

    this.manager = new ItemsWithAuthorDetailsManager(itemsProvider, usersProvider);
  }
  public render(): React.ReactElement<IUnitTestWebPartProps> {
    return (
      <section>
        <ItemsWithAdminInfo manager={this.manager} />
        <ComplexComponent context={this.props.context} />
      </section>
    );
  }
}
