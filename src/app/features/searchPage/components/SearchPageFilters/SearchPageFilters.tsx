import React from "react";
import cn from "classnames";
import { observer } from "mobx-react";
import { SearchPageStoreType, FilterFormField } from "../../stores/searchPageStore";
import { FieldAutocomplete } from "../../../../shared/components/FieldAutocomplete";
import { SearchablePlace } from "../../constants/searchPage";
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
    getSearchablePlaceOptions,
    onChangeFilterFormValue,
    getSearchablePlaceOptionLabel
  } = searchPageStore;

  React.useEffect(() => init(), [ init ]);

  return (
    <div className={cn(styles.container)}>
      <FieldAutocomplete<FilterFormField>
        getFilteredSuggestions={createSubcategoryOptions}
        fieldName="subcategory"
        onFieldChange={onChangeFilterFormValue}
        placeholder="Что искать"
      />
      <FieldAutocomplete<SearchablePlace>
        getFilteredSuggestions={getSearchablePlaceOptions}
        fieldName="searchablePlace"
        onFieldChange={onChangeFilterFormValue}
        getLabel={getSearchablePlaceOptionLabel}
        placeholder="Где искать"
      />
    </div>
  );
});
