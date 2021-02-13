import BaseHttpService from "./base-http.service";
import queryString from 'query-string';

export default class DocumentsService extends BaseHttpService {
    fetchDocuments({ status, serach, category }) {
        const filter = {};

        if (status.length) {
            filter.status = status;
        }

        if (serach.length) {
            filter.serach = serach;
        }

        if (category.length) {
            filter.category = category;
        }

        const filterString = queryString.stringify(filter);

        return this.get(`docs` + (filterString ? `?${filterString}` : ''));
    }

    createDocument(title, description, category, approvers) {
        return this.post(`docs`, { title, description, category, approvers });
    }

    
    
    
    async deleteDocument(id) {
        await this.delete(`docs/${id}`);
    }
}