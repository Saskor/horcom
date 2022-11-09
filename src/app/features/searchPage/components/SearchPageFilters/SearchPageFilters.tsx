import React from "react";
import cn from "classnames";
import { observer } from "mobx-react";
import { SearchPageStoreType, FilterFormValue, SearchSelectOption } from "../../stores/searchPageStore";
import { FieldSelect } from "../../../../shared/components/FieldSelect";
import { FieldAutocomplete } from "../../../../shared/components/FieldAutocomplete";
import styles from "./SearchPageFilters.scss";

export const SearchPageFilters = observer((
  {
    searchPageStore
  }: {
    searchPageStore: SearchPageStoreType
  }
) => {
  const {
    init,
    createSubcategoryOptions,
    categoriesSelectorOptions,
    filterFormValues,
    onChangeFilterFormValue,
    regionsOptions,
    citiesOptions
  } = searchPageStore;

  React.useEffect(() => init(), []);

  return (
    <div className={cn(styles.container)}>
      <FieldSelect<FilterFormValue>
        dropdownMenuItemsData={categoriesSelectorOptions}
        fieldName="category"
        formValues={filterFormValues}
        onFieldChange={onChangeFilterFormValue}
      />
      <FieldAutocomplete<SearchSelectOption>
        getFilteredSuggestions={createSubcategoryOptions}
        fieldName="subcategory"
        formValues={filterFormValues}
        onFieldChange={onChangeFilterFormValue}
      />
      <FieldAutocomplete<FilterFormValue>
        suggestions={regionsOptions}
        fieldName="regionId"
        formValues={filterFormValues}
        onFieldChange={onChangeFilterFormValue}
      />
      <FieldAutocomplete<FilterFormValue>
        suggestions={citiesOptions}
        fieldName="city"
        formValues={filterFormValues}
        onFieldChange={onChangeFilterFormValue}
      />
    </div>
  );
});
