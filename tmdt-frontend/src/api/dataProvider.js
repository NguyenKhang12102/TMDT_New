import { fetchUtils } from 'react-admin';
import { API_BASE_URL, getHeaders } from './constant';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    const headers = getHeaders(); // Lấy token & Content-Type
    Object.entries(headers).forEach(([key, value]) => {
        options.headers.set(key, value);
    });

    return fetchUtils.fetchJson(url, options);
};

const dataProvider = {
    getList: (resource, params) => {
        let url;

        if (resource === 'category-types') {
            url = `${API_BASE_URL}/api/category-types`;
        } else if (resource === 'categories') {
            url = `${API_BASE_URL}/api/category`;
        } else {
            url = `${API_BASE_URL}/api/${resource}`;
        }

        return httpClient(url).then(({ json }) => ({
            data: json.map(item => ({
                id: item.id,
                name: item.name,
            })),
            total: json.length,
        }));
    },

    // Các hàm khác nếu cần (getOne, update, delete...) có thể thêm sau
};

export default dataProvider;
