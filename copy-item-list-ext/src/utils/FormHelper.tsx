import { Dropdown } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown";
import { IPersonaProps } from "office-ui-fabric-react/lib/components/Persona/Persona.types";
import { TextField } from "office-ui-fabric-react/lib/components/TextField/TextField";
import { TaxonomyPicker } from "@pnp/spfx-controls-react/lib/controls/taxonomyPicker/TaxonomyPicker";
import { DateTimePicker, DateConvention } from '@pnp/spfx-controls-react/lib/dateTimePicker';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as React from "react";
import { ISPUser } from "../model/ISPUser";
import { Constants } from "../model/Constants";
import { IField } from "../model/IFIeld";

export class FormHelper {
    public static GetFieldControl(fieldInfo: IField,
        fieldValue: any,
        editMode: boolean,
        onChange: (field: IField, newValue: any) => void,
        spContext): JSX.Element {
        const noValue = "-";
        // Text, Choice, Boolean
        if (fieldInfo.TypeAsString === Constants.fieldTypeChoice && fieldValue instanceof Array) {
            fieldValue = fieldValue[0];
            fieldValue = fieldValue.key || fieldValue;
        }
        let resultControl: any = <TextField
            disabled={!editMode}
            value={fieldValue}
            label={fieldInfo.Title}
            onChange={(event, newValue) => {
                onChange(fieldInfo, newValue);
            }} />;
        switch (fieldInfo.TypeAsString) {
            case Constants.fieldTypeNote:
                resultControl = <TextField
                    multiline={true}
                    label={fieldInfo.Title}
                    disabled={!editMode}
                    value={fieldValue}
                    onChange={(event, newValue) => {
                        onChange(fieldInfo, newValue);
                    }} />;
                break;
            case Constants.fieldTypeChoice:
                resultControl = <Dropdown
                    label={fieldInfo.Title}
                    selectedKey={fieldValue ? fieldValue.key : 0}
                    options={fieldInfo.Choices.map((option, index) => {
                        return {
                            key: index,
                            text: option
                        };
                    })}
                    disabled={!editMode}
                    multiSelect={false}
                    onChanged={(newValue) => {
                        onChange(fieldInfo, newValue);
                    }} />;
                break;
            case Constants.fieldTypeTaxonomy:
                resultControl = <TaxonomyPicker
                    allowMultipleSelections={false}
                    termsetNameOrID={fieldInfo.TermSetId}
                    panelTitle="Select Term"
                    label={fieldInfo.Title}
                    context={spContext}
                    disabled={!editMode}
                    initialValues={
                        fieldValue ? [{
                                name: fieldValue.Label,
                                key: fieldValue.TermID,
                                path: fieldValue.Label,
                                termSet: fieldValue.TermSetId
                            }]: []}
                    onChange={(newTax) => {
                        onChange(fieldInfo, newTax.map(term => {
                            return {
                                Label: term.name,
                                TermID: term.key,
                                key: term.key,
                                name: term.name
                            };
                        })[0]);
                    }}
                    isTermSetSelectable={false} />;
                break;
            case Constants.fieldTypeTaxonomyMulti:
                resultControl = <TaxonomyPicker
                    allowMultipleSelections={true}
                    termsetNameOrID={fieldInfo.TermSetId}
                    panelTitle="Select Term"
                    disabled={!editMode}
                    label={fieldInfo.Title}
                    context={spContext}
                    initialValues={
                        fieldValue ? fieldValue.map(term => {
                            return {
                                name: term.label,
                                key: term.termId,
                                path: term.label,
                                termSet: fieldInfo.TermSetId
                            };
                        }) : []}
                    onChange={(newTax) => {
                        onChange(fieldInfo, newTax.map(term => {
                            return {
                                Label: term.name,
                                TermID: term.key,
                                key: term.key,
                                name: term.name
                            };
                        }));
                    }}
                    isTermSetSelectable={false} />;
                break;
            case Constants.fieldTypeChoiceMulti:
                resultControl = <Dropdown
                    label={fieldInfo.Title}
                    defaultSelectedKeys={fieldValue ? fieldValue.map(fv => fv.key) : []}
                    options={fieldInfo.Choices.map((option, index) => {
                        return {
                            key: index,
                            text: option
                        };
                    })}
                    disabled={!editMode}
                    multiSelect={true}
                    onChanged={(newValue) => {
                        fieldValue = fieldValue || [];
                        if (newValue.selected) {
                            fieldValue.push(newValue);
                        }
                        else {
                            fieldValue.splice(fieldValue.indexOf(newValue), 1);
                        }
                        onChange(fieldInfo, fieldValue);
                    }}
                />;
                break;
            case Constants.fieldTypeDateTime:
                let dateTimeValue = (fieldValue && !isNaN(Date.parse(fieldValue))) ? new Date(fieldValue) : undefined;
                resultControl = <DateTimePicker
                    value={dateTimeValue}
                    label={fieldInfo.Title}
                    
                    disabled={!editMode}
                    dateConvention={DateConvention.Date}
                    onChange={(newValue) => {
                        if ((dateTimeValue && dateTimeValue.getTime() != newValue.getTime()) || newValue) {
                            onChange(fieldInfo, newValue);
                        }
                    }} />;
                break;
            case Constants.fieldTypeUser:
                resultControl = <PeoplePicker
                    context={spContext}
                    titleText={fieldInfo.Title}
                    showtooltip={true}
                    disabled={!editMode}
                    onChange={(selectedItem) => {
                        onChange(fieldInfo, selectedItem);
                    }}
                    defaultSelectedUsers={fieldValue ? fieldValue.map(user => {
                        return user.Name;
                    }) : []}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} />;
                break;
            case Constants.fieldTypeUserMulti:
                resultControl = <PeoplePicker
                    context={spContext}
                    titleText={fieldInfo.Title}
                    personSelectionLimit={1000}
                    showtooltip={true}
                    disabled={!editMode}
                    onChange={(selectedItem) => {
                        onChange(fieldInfo, selectedItem);
                    }}
                    defaultSelectedUsers={fieldValue ? fieldValue.map(user => {
                        return user.Name;
                    }) : []}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} />;
                break;
            case Constants.fieldTypeUrl:
                resultControl = editMode ?
                    <TextField
                        defaultValue={fieldValue}
                        label={fieldInfo.Title}
                        onChange={(event, newValue) => {
                            onChange(fieldInfo, newValue);
                        }} /> :
                    <a target="_blank" href={fieldValue} >{fieldValue}</a>;
                break;
        }

        return resultControl || noValue;
    }
    public static generateInitials(name: string): string {
        if (name !== undefined) {
            let nameArray = name.split(" ");

            if (nameArray.length > 1) {
                return nameArray[0].substring(0, 1) + nameArray[1].substring(0, 1);
            }
            else {
                return nameArray[0].substring(0, 1);
            }
        }
        else {
            return "";
        }
    }
    public static ConvertISPUserToIPersonaProps(user: ISPUser): IPersonaProps {
        let initials = FormHelper.generateInitials(user.Title);
        return {
            imageInitials: initials,
            primaryText: user.Title,
            secondaryText: !user.Email && user.Email.length > 0 ? user.Email[0] : null,
            optionalText: user.LoginName
        };
    }

}