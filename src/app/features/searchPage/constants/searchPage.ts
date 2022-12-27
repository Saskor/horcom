import { StandardOption } from "../../../shared/componentsStateServices/ServiceBase";

export const REGIONS: {[index: number]: string} = {
  1: "Республика Адыгея",
  2: "Республика Башкортостан",
  3: "Республика Бурятия",
  4: "Республика Алтай",
  5: "Республика Дагестан",
  6: "Республика Ингушетия",
  7: "Кабардино-Балкарская Республика",
  8: "Республика Калмыкия",
  9: "Республика Карачаево-Черкессия",
  10: "Республика Карелия",
  11: "Республика Коми",
  12: "Республика Марий-Эл",
  13: "Республика Мордовия",
  14: "Республика Саха (Якутия)",
  15: "Республика Северная Осетия - Алания",
  16: "Республика Татарстан",
  17: "Республика Тыва",
  18: "Республика Удмуртия",
  19: "Республика Хакасия",
  20: "Чеченская республика",
  21: "Республика Чувашия",
  22: "Алтайский край",
  23: "Краснодарский край",
  24: "Красноярский край",
  25: "Приморский край",
  26: "Ставропольский край",
  27: "Хабаровский край",
  28: "Амурская область",
  29: "Архангельская область",
  30: "Астраханская область",
  31: "Белгородская область",
  32: "Брянская область",
  33: "Владимирская область",
  34: "Волгоградская область",
  35: "Вологодская область",
  36: "Воронежская область",
  37: "Ивановская область",
  38: "Иркутская область",
  39: "Калининградская область",
  40: "Калужская область",
  41: "Камчатская область",
  42: "Кемеровская область",
  43: "Кировская область",
  44: "Костромская область",
  45: "Курганская область",
  46: "Курская область",
  47: "Ленинградская область",
  48: "Липецкая область",
  49: "Магаданская область",
  50: "Московская область",
  51: "Мурманская область",
  52: "Нижегородская область",
  53: "Новгородская область",
  54: "Новосибирская область",
  55: "Омская область",
  56: "Оренбургская область",
  57: "Орловская область",
  58: "Пензенская область",
  59: "Пермский край",
  60: "Псковская область",
  61: "Ростовская область",
  62: "Рязанская область",
  63: "Самарская область",
  64: "Саратовская область",
  65: "Сахалинская область",
  66: "Свердловская область",
  67: "Смоленская область",
  68: "Тамбовская область",
  69: "Тверская область",
  70: "Томская область",
  71: "Тульская область",
  72: "Тюменская область",
  73: "Ульяновская область",
  74: "Челябинская область",
  75: "Забайкальский край",
  76: "Ярославская область",
  77: "Москва",
  78: "Санкт-Петербург",
  79: "Еврейская автономная область",
  80: "Забайкальский край",
  81: "Пермский край",
  82: "Республика Крым",
  83: "Ямало-ненецкий автономный округ",
  84: "Красноярский край",
  85: "Иркутская область",
  86: "Ханты-Мансийский автономный округ - Югра",
  87: "Чукотский автономный округ",
  88: "Красноярский край",
  89: "Ямало-ненецкий автономный округ",
  91: "Калининградская область",
  92: "Севастополь",
  94: "Байконур",
  95: "Чеченская республика",
  96: "Свердловская область"
};

export type SearchablePlace = {
  name: string;
  regionDistrict: string | null;
  region: string;
} & StandardOption;

export type SearchablePlaceSuggestion = {
  displayPriority: number; /** Number from 1 and bigger*/
} & SearchablePlace;

export const SEARCHABLE_PLACES: Array<SearchablePlaceSuggestion> = [
  {
    name: "Москва",
    regionDistrict: null,
    region: "Москва",
    displayPriority: 1
  },
  {
    name: "Московская область",
    regionDistrict: null,
    region: "Московская область",
    displayPriority: 2
  },
  {
    name: "Электросталь",
    regionDistrict: null,
    region: "Московская область",
    displayPriority: 3

  },
  {
    name: "Ногинск",
    regionDistrict: null,
    region: "Московская область",
    displayPriority: 3
  },
  {
    name: "Ликино-Дулево",
    regionDistrict: null,
    region: "Московская область",
    displayPriority: 3
  }
];

export const VK_DOMAIN = "https://vk.com/";
// __hashTag__ it is any hashtag without # symbol
export const VK_SEARCH_REVIEWS_PAGE = "https://vk.com/search?c%5Bper_page%5D=40&c%5Bq%5D=%23__hashTag__&c%5Bsection%5D=statuses";
export type ServicesProviderOrManufacturer = {
  id: number;
  name: string;
  searchablePlace: SearchablePlace;
  address: string;
  subcategories: {[key: string]: boolean};
  category: string;
  vkProfile: string;
  profilePhotoLink: string;
  phoneNumber: string;
  reviewsHashtag: string;
  reviewsLink: string;
};
export const SERVICES_PRODUCERS: Array<ServicesProviderOrManufacturer> = [
  {
    id: 1,
    name: "Алексей Ниточкин",
    searchablePlace: {
      name: "Электросталь",
      regionDistrict: null,
      region: "Московская область"
    },
    address: "г. Электросталь, ул. Суворова",
    subcategories: {
      "диагностика автомобилей": true,
      чиптюнинг: true,
      "ремонт электронных блоков управления двигателем": true,
      "ремонт электрооборудования автомобилей": true,
      "замена датчиков и исполнительных механизмов": true
    },
    category: "ремонт спецтехники",
    vkProfile: "krokodil330",
    profilePhotoLink: "https://sun1-96.userapi.com/s/v1/if1/EogRTotUT9KWRJWx6XgzwicmpTXtobX9HqbxJB180-03kGU0nJcFkmECEs00EewnGOsm6Q.jpg?size=200x273&quality=96&crop=67,67,1401,1913&ava=1",
    phoneNumber: "+7 (999)-999-55-00",
    reviewsHashtag: "#car_diag_50_1",
    reviewsLink: ""
  },
  {
    id: 2,
    name: "Иванов Иван",
    searchablePlace: {
      name: "Москва",
      regionDistrict: null,
      region: "Москва"
    },
    address: "г. Москва, ул. Суворова",
    subcategories: {
      "диагностика автомобилей": true,
      чиптюнинг: true,
      "ремонт электронных блоков управления двигателем": true,
      "ремонт электрооборудования автомобилей": true,
      "замена датчиков и исполнительных механизмов": true
    },
    category: "ремонт автомобилей",
    vkProfile: "krokodil330",
    profilePhotoLink: "https://sun1-96.userapi.com/s/v1/if1/EogRTotUT9KWRJWx6XgzwicmpTXtobX9HqbxJB180-03kGU0nJcFkmECEs00EewnGOsm6Q.jpg?size=200x273&quality=96&crop=67,67,1401,1913&ava=1",
    phoneNumber: "+7 (999)-999-55-00",
    reviewsHashtag: "#car_diag_50_2",
    reviewsLink: ""
  },
  {
    id: 3,
    name: "Смирнов Сергей",
    searchablePlace: {
      name: "Ногинск",
      regionDistrict: null,
      region: "Московская область"
    },
    address: "г. Ногинск, ул. Суворова",
    subcategories: {
      "диагностика автомобилей": true,
      чиптюнинг: true,
      "ремонт электронных блоков управления двигателем": true,
      "ремонт электрооборудования автомобилей": true,
      "замена датчиков и исполнительных механизмов": true
    },
    category: "ремонт автомобилей",
    vkProfile: "krokodil330",
    profilePhotoLink: "https://sun1-96.userapi.com/s/v1/if1/EogRTotUT9KWRJWx6XgzwicmpTXtobX9HqbxJB180-03kGU0nJcFkmECEs00EewnGOsm6Q.jpg?size=200x273&quality=96&crop=67,67,1401,1913&ava=1",
    phoneNumber: "+7 (999)-999-55-00",
    reviewsHashtag: "#car_diag_50_3",
    reviewsLink: ""
  },
  {
    id: 4,
    name: "Алексей Ниточкин",
    searchablePlace: {
      name: "Ликино-Дулево",
      regionDistrict: null,
      region: "Московская область"
    },
    address: "г. Ликино-Дулево, ул. Суворова",
    subcategories: {
      "диагностика автомобилей": true,
      чиптюнинг: true,
      "ремонт электронных блоков управления двигателем": true,
      "ремонт электрооборудования автомобилей": true,
      "замена датчиков и исполнительных механизмов": true
    },
    category: "ремонт автомобилей",
    vkProfile: "krokodil330",
    profilePhotoLink: "https://sun1-96.userapi.com/s/v1/if1/EogRTotUT9KWRJWx6XgzwicmpTXtobX9HqbxJB180-03kGU0nJcFkmECEs00EewnGOsm6Q.jpg?size=200x273&quality=96&crop=67,67,1401,1913&ava=1",
    phoneNumber: "+7 (999)-999-55-00",
    reviewsHashtag: "#car_diag_50_4",
    reviewsLink: ""
  }
];
