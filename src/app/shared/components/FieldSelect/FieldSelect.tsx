import React from "react";
import { Select } from "../Select";
import { MenuItemComponentType, StandardOption } from "../../componentsStateServices/types";

export const FieldSelect = <Option extends StandardOption, >(
  {
    dropdownMenuItemsData,
    fieldName,
    formValues,
    onFieldChange,
    MenuItemComponent,
    getLabel
  }: {
    dropdownMenuItemsData: Array<Option>;
    fieldName: string;
    formValues: { [key: string]: any };
    onFieldChange: (changingFieldName: string, value: Option) => void;
    MenuItemComponent?: MenuItemComponentType<Option>;
    getLabel?: (newValue: Option) => string;
  }
) => {
  const onChange = React.useCallback(
    (value: Option) => onFieldChange(fieldName, value),
    [ onFieldChange, fieldName ]
  );

  return (
    <Select<Option>
    dropdownMenuItemsData={dropdownMenuItemsData}
    onChange={onChange}
    value={formValues[fieldName]}
    MenuItemComponent={MenuItemComponent}
    getLabel={getLabel}
  />
  );
};
