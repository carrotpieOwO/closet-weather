import axios from "axios";
import { useState } from "react"
import { ClothItem } from "../index.d";

interface ResponseItem {
    title: string;
    image: string;
    category?: string;
    category1?: string;
    category2?: string;
    category3?: string;
    category4?: string;
    maker: string;
    display: number;
}

export const useShop = () => {
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    
    const search = (value:string, start:number): Promise<{ cloths: ClothItem[] | null, hasMore: boolean }> => {
        setError(null);
        setIsLoading(true);

        return new Promise((resolve, reject) => {
            axios
                .get<{ items: ResponseItem[], total:number, display:number }>('/v1/search/shop.json', {
                    params: {
                        query: value,
                        display: 30,
                        start: start,
                        includeSubCategory: true
                    },
                    headers: {
                        "X-Naver-Client-Id": process.env.REACT_APP_NAVER_ID,
                        "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_SECRET,
                    },
                })
                .then((res) => {
                    console.log('res', res)
                    const cloths:ClothItem[] = res.data.items
                        .filter(item => item.category1 === '패션의류')
                        .map(item =>({
                            title: item.title.replace(/<[^>]*>?/g, ''), //html코드 제거
                            image: item.image,
                            category: item.category3, 
                            subCategory: item.category4, 
                            brand: item.maker
                        }))
                    const hasMore = res.data.total >= (start + res.data.display);
                    setError(null);
                    setIsLoading(false);
                    resolve({ cloths, hasMore });
                })
                .catch((error) => {
                    setError(error.message)
                    setIsLoading(false);
                    reject(error);
                });
        })
        
    }
    return { error, isLoading, search }
}