export interface HourDataType {
    time: string
    temp: number
    icon: string
    description: string;
}
export interface positionProps {
    lat: number;
    lon: number;
}
export interface ClothItem {
    title: string;
    image: string;
    category?: string;
    subCategory?: string;
    brand: string;
}