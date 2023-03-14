export interface HourDataType {
    time: string
    temp: number
    icon: string
    description: string;
}
export interface HourDataProps {
    dt_txt: string;
    dt: number,
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
      feels_like: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
}
export interface CurrentDataProps {
    name: string,
    weather: [
        description: string,
        icon: string
    ],
    main: {
        temp: number,
        feels_like: number
    }
}
export interface CurrentDataType {
    location: string;
    icon: string;
    description: string;
    currentTemp: number;
    // todayMaxTmep: number;
    // todayMinTemp: number;
    feelsLikeTemp: number;
}
export interface PositionProps {
    lat: number;
    lon: number;
}
export interface ClothItem {
    title: string;
    image: string;
    category?: string;
    subCategory?: string;
    brand: string;
    uid?:string;
    id?:string;
}
export interface QueryProps {
    fieldPath: string | FieldPath;
    whereFilterOp: WhereFilterOp;
    search?: string | string[]
}