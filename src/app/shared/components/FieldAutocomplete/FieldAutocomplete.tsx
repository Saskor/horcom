import React from "react";
import { Autocomplete } from "../Autocomplete";
import { MenuItemComponentType, StandardOption } from "../../componentsStateServices/types";
import { FilterFormValues } from "app/features/searchPage/stores/searchPageStore";

export const FieldAutocomplete = <Option extends StandardOption, >(
  {
    getFilteredSuggestions,
    MenuItemComponent,
    fieldName,
    onFieldChange,
    getLabel,
    placeholder = "",
    formValues
  }: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    MenuItemComponent?: MenuItemComponentType<Option>;
    fieldName: keyof FilterFormValues;
    onFieldChange: (changingFieldName: string, value: Option) => void;
    getLabel?: (newValue: Option) => string;
    placeholder?: string;
    formValues: { [key: string]: any };
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
      getLabel={getLabel}
      placeholder={placeholder}
      initialValue={formValues[fieldName]}
    />
  );
};
