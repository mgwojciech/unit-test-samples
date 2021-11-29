import { IListViewCommandSetExecuteEventParameters, ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import * as React from "react";
import { Dropdown, PrimaryButton, Spinner } from "office-ui-fabric-react";
import { CopyItemManager } from "../managers/CopyItemManager";
import { IField, IFieldValue } from "../model/IFIeld";
import { FormHelper } from "../utils/FormHelper";
import { SPHelper } from "../utils/SPHelper";

export interface ICopyItemFormProps {
    context: ListViewCommandSetContext;
    event: IListViewCommandSetExecuteEventParameters;
    open: boolean;
}

export interface ICopyItemFormState {
    isOpen: boolean;
    loading: boolean;
    fieldsToCopy: {
        key: string;
        text: string;
        selected: boolean;
    }[];
    isDropDownOpen?: boolean;
    customFieldsValues: IFieldValue[];
}

export class CopyItemForm extends React.Component<ICopyItemFormProps, ICopyItemFormState>{
    public manager: CopyItemManager;
    constructor(props: ICopyItemFormProps) {
        super(props);
        this.state = {
            isOpen: props.open,
            loading: true,
            fieldsToCopy: [],
            customFieldsValues: []
        };
        this.manager = new CopyItemManager(props.context);
    }

    public async componentDidMount() {
        await this.manager.loadListInfo();
        this.setState({
            loading: false,
            fieldsToCopy: this.manager.fields.map(fld => ({
                key: fld.InternalName,
                text: fld.Title,
                selected: true
            }))
        });
    }

    protected setOpen = (isOpened) => {
        this.setState({
            isOpen: isOpened
        });
    }
    protected handleOnFieldsToCopyChange = (event: React.FormEvent<HTMLDivElement>, option?: {
        key: string;
        text: string;
        selected: boolean;
    }, index?: number) => {
        let fields = this.state.fieldsToCopy;
        fields[index].selected = option.selected;
        this.setState({
            fieldsToCopy: fields
        });
    }
    protected copyItems = async () => {
        let customFieldsValues = this.state.customFieldsValues.map(fld => ({
            ...fld,
            value: SPHelper.mapFieldValueToSPFormat(this.manager.fields.filter(field => field.InternalName === fld.name)[0], fld.value)
        }));
        this.setState({
            loading: true
        });
        await this.manager.copyItems(this.props.event.selectedRows.map(row => row.getValueByName("ID")), this.state.fieldsToCopy.filter(fld => fld.selected).map(fld => fld.key), customFieldsValues);
        this.setState({
            loading: false,
            isOpen: false
        });
        window.location.reload();
    }
    protected renderFooter = () => {
        return <div>
            <PrimaryButton disabled={this.state.isDropDownOpen} text="Copy selected items" onClick={this.copyItems} />
        </div>;
    }
    public componentWillReceiveProps(props: ICopyItemFormProps) {
        this.setState({
            isOpen: props.open
        });
    }
    protected updateCustomValue(field: IField, newValue: any) {
        let customValues = this.state.customFieldsValues;
        let currentField = customValues.filter(fld => fld.name === field.InternalName)[0];
        if (!currentField) {
            customValues.push({
                name: field.InternalName,
                type: field.TypeAsString,
                value: newValue
            });
        }
        else {
            currentField.value = newValue;
        }
        this.setState({
            customFieldsValues: customValues
        });
    }
    public render(): JSX.Element {
        return <Panel
            headerText="Copy list item"
            isOpen={this.state.isOpen}
            isFooterAtBottom={true}
            onRenderFooter={this.renderFooter}
            onDismiss={() => this.setOpen(false)}
            // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
            closeButtonAriaLabel="Close"
        >
            <div>
                {this.state.loading && <Spinner />}
                {!this.state.loading && (<div>
                    <div>
                        <Dropdown
                            multiSelect={true}
                            placeholder="Fields to copy"
                            label="Copy values in fields"
                            options={this.state.fieldsToCopy}
                            onFocus={()=>this.setState({...this.state, isDropDownOpen: true})}
                            onBlur={()=>this.setState({...this.state, isDropDownOpen: false})}
                            onChange={this.handleOnFieldsToCopyChange}
                        />
                    </div>
                    <div>
                        {this.state.fieldsToCopy.map((fld, index) => <div key={index}>
                            {!fld.selected && FormHelper.GetFieldControl(this.manager.fields[index],
                                this.getCustomFieldValue(fld),
                                true,
                                (f, newValue) => {
                                    this.updateCustomValue(f, newValue);
                                },
                                this.props.context)}</div>)}
                    </div>
                </div>)}
            </div>
        </Panel>;
    }
    public getCustomFieldValue(fld: {
        key: string;
        text: string;
        selected: boolean;
    }) {
        let fldValue = this.state.customFieldsValues.filter(f => fld.key === f.name)[0];
        if(fldValue){
            return fldValue.value;
        }
    }
}