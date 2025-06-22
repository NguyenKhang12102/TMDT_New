import axios from 'axios'

const REST_APi_BASE_URL = 'http://localhost:8080/api/products'

export const ListProducts = ()=> axios.get(REST_APi_BASE_URL);