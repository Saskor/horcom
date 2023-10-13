import { makeAutoObservable } from "mobx";
import {
  SEARCHABLE_PLACES,
  SearchablePlace,
  SERVICES_PRODUCERS,
  ServicesProviderOrManufacturer
} from "../constants/searchPage";

type CategoriesWithSubcategories = {
  // category
  [key: string]: {
    // subCategory
    [key: string]: boolean;
  };
}

export type SearchSelectOption = {
  label: string;
  value: string;
  dependentFields: {
    category: { label: string, value: string | null }
  }
}

export type CategoriesSelectorOption = {
  label: string;
  value: string;
}

export type FilterFormField = {
  label: string;
  value: string | number | null;
  dependentFields?: {
    [key: string]: { label: string, value: string | number | null }
  }
};

export type FilterFormValues = {
  category: FilterFormField;
  subcategory: FilterFormField;
  searchablePlace: SearchablePlace;
}

class SearchPageStoreClass {
  private categoriesWithSubcategories: CategoriesWithSubcategories = {}

  public filterFormValues: FilterFormValues = {
    category: {
      label: "Любая категория",
      value: null
    },
    subcategory: {
      label: "",
      value: null
    },
    searchablePlace: {
      name: "Россия",
      regionDistrict: null,
      region: "Россия"
    }
  }

  private requestParamsValueGetters: {
    [key: string]: { getValue: (param: FilterFormField | SearchablePlace) => string | number | null | undefined };
  } = {
    category: {
      getValue: param => param.value
    },
    subcategory: {
      getValue: param => param.value
    },
    searchablePlace: {
      getValue: param => {
        if ("region" in param) {
          return this.getSearchablePlaceOptionLabel(param);
        }

        return param.value || undefined;
      }
    }
  }

  public data: Array<ServicesProviderOrManufacturer> = []

  constructor() {
    makeAutoObservable(this);
  }

  // init
  private getCategoriesWithSubcategories = (
    servicesProvidersOrManufacturers: Array<ServicesProviderOrManufacturer>
  ): CategoriesWithSubcategories => servicesProvidersOrManufacturers.reduce(
    (acc: CategoriesWithSubcategories, servicesProviderOrManufacturer) => {
      if (acc[servicesProviderOrManufacturer.category]) {
        return {
          ...acc,
          [servicesProviderOrManufacturer.category]: {
            ...acc[servicesProviderOrManufacturer.category],
            ...servicesProviderOrManufacturer.subcategories
          }
        };
      }

      return {
        ...acc,
        [servicesProviderOrManufacturer.category]: {
          ...servicesProviderOrManufacturer.subcategories
        }
      };
    },
    {}
  )

  // init
  /*
   *private getCategoriesSelectorOptions = (): Array<CategoriesSelectorOption> => {
   *const categoriesList = Object.keys(this.categoriesWithSubcategories);
   *
   *return categoriesList.map(category => ({
   *  label: category,
   *  value: category
   *}));
   *}
   */

  public createSubcategoryOptions = (inputValue: string): Array<SearchSelectOption> => {
    const subcategoryOptionsWithCurrentCategory: Array<SearchSelectOption> = [];
    const otherSubcategoryOptions: Array<SearchSelectOption> = [];

    const categoriesNames = Object.keys(this.categoriesWithSubcategories);
    categoriesNames.forEach(categoryName => {
      const subcategories = Object.keys(this.categoriesWithSubcategories[categoryName]);

      subcategories.forEach(subcategoryName => {
        if (subcategoryName.toLowerCase().includes(inputValue.toLowerCase())) {
          const subcategory = {
            label: `${subcategoryName} ← ${categoryName}`,
            value: subcategoryName,
            dependentFields: {
              category: { label: categoryName, value: categoryName }
            }
          };

          if (
            this.filterFormValues.category.value
            && this.filterFormValues.category.value === categoryName
          ) {
            subcategoryOptionsWithCurrentCategory.push(subcategory);
          } else {
            otherSubcategoryOptions.push(subcategory);
          }
        }
      });
    });

    return [ ...subcategoryOptionsWithCurrentCategory, ...otherSubcategoryOptions ];
  };

  public getSearchablePlaceOptions = (value: string): Array<SearchablePlace> => (
    SEARCHABLE_PLACES.filter(
      ({ name }) => (
        name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      )
    )
  )

  public getSearchablePlaceOptionLabel = ({ name, regionDistrict, region }: SearchablePlace) => {
    if (name === region) {
      return name;
    }

    const path = regionDistrict ? [ name, regionDistrict, region ] : [ name, region ];

    return path.join(", ");
  }

  private onData = (
    requestParams: FilterFormValues,
    data: Array<ServicesProviderOrManufacturer>
  ): void => {
    // log data
    JSON.stringify({ requestParams, data });
  }

  public requestData = (
    requestParams: FilterFormValues
  ): Array<ServicesProviderOrManufacturer> => {
    const filteredData = SERVICES_PRODUCERS.filter(
      serviceProducer => {
        let allConditionsTruthy = false;
        let requestParamName: keyof FilterFormValues;
        // eslint-disable-next-line guard-for-in
        for (requestParamName in requestParams) {
          const requestParam = requestParams[requestParamName];
          const valueFromRequestParam = this.requestParamsValueGetters[requestParamName].getValue(requestParam);

          if (valueFromRequestParam === null) {
            allConditionsTruthy = true;
            continue;
          }

          switch (requestParamName) {
            case "subcategory":
              if (typeof valueFromRequestParam === "string") {
                let subcategory: string;
                // eslint-disable-next-line guard-for-in
                for (subcategory in serviceProducer.subcategories) {
                  allConditionsTruthy = subcategory.toLowerCase().includes(valueFromRequestParam.toLowerCase());

                  if (allConditionsTruthy) {
                    break;
                  }
                }
              }
              break;

            case "searchablePlace":
              if ("region" in requestParam) {
                if (valueFromRequestParam === "Россия") {
                  allConditionsTruthy = true;
                  break;
                }

                const needToFilterByWholeRegion: boolean = valueFromRequestParam === requestParam.region;
                allConditionsTruthy = needToFilterByWholeRegion
                  ? valueFromRequestParam === serviceProducer[requestParamName].region
                  : valueFromRequestParam === this.getSearchablePlaceOptionLabel(serviceProducer[requestParamName]);
              }

              break;

            default:
              allConditionsTruthy = serviceProducer[requestParamName] === requestParam.value;
          }

          if (!allConditionsTruthy) {
            return false;
          }
        }

        return allConditionsTruthy;
      }
    );

    this.onData(requestParams, filteredData);

    return filteredData;
  };

  private getDependentFieldsByFieldName = (fieldName: string) => {
    let dependentFields;

    switch (fieldName) {
      case "regionId": {
        dependentFields = {
          city: { label: "", value: null }
        };

        break;
      }

      default:
        dependentFields = {};
    }

    return dependentFields;
  }

  public setFilterFormValues = (
    fieldName: string,
    value: {
      label: string,
      value: string | null,
      dependentFields?: {
        [key: string]: { label: string, value: string | null }
      }
    }
  ): void => {
    if (fieldName === "") {
      throw new Error("Invalid field name, fieldName '' not exist.");
    }

    const { dependentFields = this.getDependentFieldsByFieldName(fieldName) } = value;
    const dependentFieldNames = Object.keys(dependentFields);

    this.filterFormValues = {
      ...this.filterFormValues,
      ...(dependentFieldNames.length ? dependentFields : {}),
      [fieldName]: value
    };
  }

  public onChangeFilterFormValue = (fieldName: string, value: any) => {
    this.setFilterFormValues(fieldName, value);
    this.data = this.requestData(this.filterFormValues);
  }

  public init = () => {
    this.categoriesWithSubcategories = this.getCategoriesWithSubcategories(SERVICES_PRODUCERS);
  }
}

export const SearchPageStore = new SearchPageStoreClass();
export type SearchPageStoreType = typeof SearchPageStore;
