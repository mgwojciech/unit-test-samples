import * as React from 'react';
import { IUnitTestWebPartProps } from './IUnitTestWebPartProps';
import { SearchCenter } from "avenga-sp-components/lib/pages/SearchPage/SearchCenter";
import { SPFxSPHttpClient } from "mgwdev-m365-helpers/lib/dal/http/SPFxSPHttpClient";
import { SPSearchDataProvider } from "mgwdev-m365-helpers/lib/dal/dataProviders/SPSearchDataProvider";
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';

export default class UnitTestWebPart extends React.Component<IUnitTestWebPartProps, {}> {
  protected dataProvider;
  constructor(props: IUnitTestWebPartProps) {
    super(props);
    const httpClient = new SPFxSPHttpClient(this.props.context.spHttpClient as any);
    this.dataProvider = new SPSearchDataProvider<any>(
      `/_api/search/postquery`, httpClient, ["Path",
      "Title",
      "BannerImageUrlOWSURLH",
      "PictureThumbnailURL",
      "Description",
      "LastModifiedTime",
      "FirstPublishedDate",
      "AuthorOWSUSER",
      "EditorOWSUSER",
      "SPWebUrl",
      "ListID",
      "ListItemID",
      "UniqueId",
      "DepartmentId",
      "NormUniqueId",], "{searchTerms} IsDocument:1");
    this.dataProvider.pageSize = 9;
    this.dataProvider.setRefiners([{
      field: "FileType",
      size: 10
    }, {
      field: "DisplayAuthor"
    }]);
  }
  public render(): React.ReactElement<IUnitTestWebPartProps> {
    return (
      <section>
        <FluentProvider theme={teamsLightTheme}>
          <SearchCenter dataProvider={this.dataProvider} initialQuery='*' />
        </FluentProvider>
      </section>
    );
  }
}
