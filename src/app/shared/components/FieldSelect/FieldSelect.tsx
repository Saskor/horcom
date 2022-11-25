import React from "react";
import { Select } from "../Select";
import { MenuItemComponentType, StandardOption } from "../../componentsStateServices/ServiceBase";

export const FieldSelect = <Option extends StandardOption, >(
  {
    dropdownMenuItemsData,
    fieldName,
    formValues,
    onFieldChange,
    MenuItemComponent
  }: {
    dropdownMenuItemsData: Array<Option>;
    fieldName: string;
    formValues: { [key: string]: any };
    onFieldChange: (changingFieldName: string, value: Option) => void;
    MenuItemComponent?: MenuItemComponentType;
  }
) => {
  const onChange = React.useCallback(
    (value: Option) => onFieldChange(fieldName, value),
    [ onFieldChange, fieldName ]
  );

  return (
    <Select<Option>
    dropdownMenuPortalTargetId="portal-root"
    dropdownMenuItemsData={dropdownMenuItemsData}
    onChange={onChange}
    value={formValues[fieldName]}
    MenuItemComponent={MenuItemComponent}
  />
  );
};
