import React from "react";
import { Autocomplete } from "../Autocomplete";
import { MenuItemComponentType, StandardOption } from "../../componentsStateServices/types";

export const FieldAutocomplete = <Option extends StandardOption, >(
  {
    getFilteredSuggestions,
    MenuItemComponent,
    fieldName,
    formValues,
    onFieldChange,
    getLabel,
    placeholder = ""
  }: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    MenuItemComponent?: MenuItemComponentType<Option>;
    fieldName: string;
    formValues: { [key: string]: any };
    onFieldChange: (changingFieldName: string, value: Option) => void;
    getLabel?: (newValue: Option) => string;
    placeholder?: string;
  }
) => {
  const onChange = React.useCallback(
    // eslint-disable-next-line no-shadow
    (value: Option) => onFieldChange(fieldName, value),
    [ onFieldChange, fieldName ]
  );

  return (
    <Autocomplete<Option>
      getFilteredSuggestions={getFilteredSuggestions}
      MenuItemComponent={MenuItemComponent}
      onChange={onChange}
      value={formValues[fieldName]}
      getLabel={getLabel}
      placeholder={placeholder}
    />
  );
};
