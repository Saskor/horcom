import React from "react";
import { Autocomplete } from "../Autocomplete";
import { MenuItemComponentType, StandardOption } from "../../componentsStateServices/ServiceBase";

export const FieldAutocomplete = <Option extends StandardOption, >(
  {
    getFilteredSuggestions,
    suggestions,
    MenuItemComponent,
    fieldName,
    formValues,
    onFieldChange,
    getLabel,
    placeholder = ""
  }: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    suggestions?: Array<Option>;
    MenuItemComponent?: MenuItemComponentType;
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
      suggestions={suggestions}
      MenuItemComponent={MenuItemComponent}
      onChange={onChange}
      value={formValues[fieldName]}
      getLabel={getLabel}
      placeholder={placeholder}
    />
  );
};
