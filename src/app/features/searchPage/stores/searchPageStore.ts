import { makeAutoObservable } from "mobx";
import { REGIONS, SERVICES_PRODUCERS, ServicesProviderOrManufacturer } from "../constants/searchPage";

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

export type FilterFormValue = {
  label: string;
  value: string | number | null;
  dependentFields?: {
    [key: string]: { label: string, value: string | number | null }
  }
};

type FilterFormValues = {
  category: FilterFormValue;
  subcategory: FilterFormValue;
  regionId: FilterFormValue;
  city: FilterFormValue;
}

class SearchPageStoreClass {
  private categoriesWithSubcategories: CategoriesWithSubcategories = {}

  public categoriesSelectorOptions: Array<CategoriesSelectorOption> = []

  public regionsOptions: Array<FilterFormValue> = []

  public citiesOptions: Array<FilterFormValue> = []

  public filterFormValues: FilterFormValues = {
    category: {
      label: "Любая категория",
      value: null
    },
    subcategory: {
      label: "",
      value: null
    },
    regionId: {
      label: "Москва",
      value: 50
    },
    city: {
      label: "Москва",
      value: "Москва"
    }
  }

  public data: Array<ServicesProviderOrManufacturer> = []

  constructor() {
    makeAutoObservable(this);
  }

  // init
  private getCategoriesWithSubcategories = (
    servicesProvidersOrManufacturers: Array<ServicesProviderOrManufacturer>
  ): CategoriesWithSubcategories => {
    const result = servicesProvidersOrManufacturers.reduce(
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
    );

    return result;
  }

  // init
  private getCategoriesSelectorOptions = (): Array<CategoriesSelectorOption> => {
    const categoriesList = Object.keys(this.categoriesWithSubcategories);

    return categoriesList.map(category => ({
      label: category,
      value: category
    }));
  }

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

  private getCitiesAutocompleteOptions = (
    data: Array<ServicesProviderOrManufacturer>
  ) => (data.map(item => (
    {
      label: item.city,
      value: item.city
    }
  )));

  private getRegionsOptions = () => Object.keys(REGIONS).map(
    (regionId): FilterFormValue => ({
      label: REGIONS[Number(regionId)],
      value: Number(regionId)
    })
  );

  private onData = (
    requestParams: FilterFormValues,
    data: Array<ServicesProviderOrManufacturer>
  ): void => {
    // region ID always an integer bigger than zero
    if (Number.isInteger(requestParams.regionId.value)) {
      this.citiesOptions = this.getCitiesAutocompleteOptions(data);
    }
  }

  public requestData = (
    requestParams: FilterFormValues
  ): Array<ServicesProviderOrManufacturer> => {
    const filteredData = SERVICES_PRODUCERS.filter(
      serviceProducer => {
        let allConditionsTruthy = false;
        let requestParamName: keyof FilterFormValues;
        for (requestParamName in requestParams) {
          const requestParam = requestParams[requestParamName];

          if (requestParam.value === null) {
            allConditionsTruthy = true;
            continue;
          }

          switch (requestParamName) {
          case "subcategory":
            if (typeof requestParam.value === "string") {
              let subcategory: string;
              for (subcategory in serviceProducer.subcategories) {
                allConditionsTruthy = subcategory.toLowerCase().includes(requestParam.value.toLowerCase());

                if (allConditionsTruthy) {
                  break;
                }
              }
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
    this.categoriesSelectorOptions = this.getCategoriesSelectorOptions();
    this.regionsOptions = this.getRegionsOptions();
  }
}

export const SearchPageStore = new SearchPageStoreClass();
export type SearchPageStoreType = typeof SearchPageStore;
