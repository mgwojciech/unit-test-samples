import * as React from 'react';
import styles from './GlobalConfigTest.module.scss';
import { IGlobalConfigTestProps } from './IGlobalConfigTestProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as globalConfigValues from "ConfigValues";

export default class GlobalConfigTest extends React.Component<IGlobalConfigTestProps, {}> {
  public render(): React.ReactElement<IGlobalConfigTestProps> {
    return (
      <div className={ styles.globalConfigTest }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Here we go... out test value is:</span>
              <p className={ styles.subTitle }>{globalConfigValues.TestKey}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
