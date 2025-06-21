import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant"


export const getAllProducts = async (categoryId, typeId) => {
    let url = API_BASE_URL + API_URLS.GET_PRODUCTS;

    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (typeId) params.append("typeId", typeId);

    const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
    console.log("Calling API:", fullUrl);

    try {
        const result = await axios.get(fullUrl);
        console.log("API response:", result.data);
        return result.data;
    } catch (err) {
        console.error("API call error:", err);
        return [];
    }
};


export const getProductBySlug = async (slug)=>{
    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
    try{
        const result = await axios(url,{
            method:"GET",
        });

        return result?.data?.[0];
    }
    catch(err){
        console.error(err);
    }
}