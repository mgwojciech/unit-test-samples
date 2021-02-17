import * as React from 'react';
import styles from './PnPDemoWebPart.module.scss';
import { IPnPDemoWebPartProps } from './IPnPDemoWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  Provider as FluentUIThemeProvider,
} from "@fluentui/react-northstar";
import { Dashboard } from "@pnp/spfx-controls-react/lib/controls/dashboard/Dashboard";
import { IWidget, WidgetSize } from '@pnp/spfx-controls-react/lib/controls/dashboard/widget/IWidget';
import { TestComponent } from "./TestComponent";
import { Icon } from 'office-ui-fabric-react/lib/components/Icon/Icon';
import { themes } from "@pnp/spfx-controls-react/lib/common/utilities/ThemeUtility";
import { DemoWebPartManager } from '../../../manager/DemoWebPartManager';

export default class PnPDemoWebPart extends React.Component<IPnPDemoWebPartProps, {
  counter,
  isEdit,
  theme
}> {
  protected manager: DemoWebPartManager;
  constructor(props: IPnPDemoWebPartProps) {
    super(props);
    this.manager = new DemoWebPartManager(props.context, this.updateTheme);
    this.state = {
      counter: 0,
      isEdit: false,
      theme: themes[this.manager.getCurrentThemeName()]
    };
  }

  protected updateTheme = (theme) => {
    this.setState({
      theme: themes[theme]
    });
  }
  private getWidgets = () => {
    let defaultWidgets: IWidget[] = [
      {
        title: "Widget 1",
        size: WidgetSize.Single,
        body: [
          {
            id: "t1",
            title: "Tab 1",
            content: <div>Some test div conent</div>
          }
        ]
      },
      {
        title: "Widget 2",
        size: WidgetSize.Single,
        body: [
          {
            id: "t1",
            title: "Tab 1",
            content: <div>Some test div conent</div>
          }
        ]
      },
      {
        title: "Widget 3",
        size: WidgetSize.Single,
        body: [
          {
            id: "t1",
            title: "Tab 1",
            content: <div>Some test div conent</div>
          }
        ]
      },
      {
        title: "Widget 4",
        desc: "Some test description",
        size: WidgetSize.Triple,
        controlOptions: {
        },
        body: [
          {
            id: "t1",
            title: "Tab 1",
            content: <TestComponent />,
          },
          {
            id: "t2",
            title: "Tab 2",
            content: (
              "Content #2"
            ),
          }
        ]
      },
    ];
    return defaultWidgets.map(widget => ({
      ...widget,
      widgetActionGroup: this.calloutItemsExample(widget)
    }));
  }
  private calloutItemsExample = (widget: IWidget) => {
    if (this.state && this.state.isEdit) {
      return [
        {
          id: "action_1",
          title: "Info",
          onClick: () => {
            console.log("Info: " + widget);
          },
          icon: <Icon iconName="Info" />,
        },
        {
          id: "action_2", title: "Popup",
          onClick: () => {
            console.log("popup: " + widget);
          }, icon: <Icon iconName="PopExpand" />
        },
        {
          id: "action_3",
          title: "Share",
          onClick: () => {
            console.log("shre: " + widget);
          },
          icon: <Icon iconName="Share" />,
        },
      ];
    }
  }
  public render(): React.ReactElement<IPnPDemoWebPartProps> {
    const toolbarConfig = {
      actionGroups: {
        h1: {
          b1: {
            title: this.state && this.state.isEdit ? "Stop editing" : "Edit",
            iconName: "Info",
            onClick: () => {
              if (this.state)
                this.setState({ isEdit: !this.state.isEdit });
              else
                this.setState({ isEdit: true });
            }
          }
        },
      },
      filters: [{
        id: "filter-group-1",
        title:
          "Filter group 1",
        items: [
          { id: "filter-group-1-item1", title: "Item 1" },
          { id: "filter-group-1-item2", title: "Item 2" },
          { id: "filter-group-1-item3", title: "Item 3" },
          { id: "filter-group-1-item4", title: "Item 4" },
          { id: "filter-group-1-item5", title: "Item 5" },
        ],
      },
      {
        id: "filter-item-2",
        title: "Item 2",
      },
      {
        id: "filter-group-3",
        title: "Filter group 3",
        items: [
          { id: "filter-group-3-item-1", title: "Item 1" },
          {
            id: "filter-group-3-group-2",
            title: "Filter group 3 sub group 2",
            items: [
              { id: "filter-group-3-group-2-item-1", title: "Item 1" },
              { id: "filter-group-3-group-2-item-2", title: "Item 2" },
              { id: "filter-group-3-group-2-item-3", title: "Item 3" },
            ],
          },
        ],
      }],
      onSelectedFiltersChange: (filters: string[]) => {
        console.log(filters);
        return filters;
      },
      find: true,
      onFindQueryChange: (query: string) => {
        console.log(query);
        return query;
      }
    };
    let widgets = this.getWidgets();
    return (
      <FluentUIThemeProvider theme={this.state.theme} >
        <Dashboard
          widgets={widgets}
          allowHidingWidget={this.state && this.state.isEdit}
          toolbarProps={toolbarConfig}
          onWidgetHiding={(widget) => console.log(widget)}
        />
      </FluentUIThemeProvider>
    );
  }
}
