import { observable, action } from "mobx";

export default class DocumentStore {
    @observable
    documents = [];
    
    @observable
    filters = { status: '', search: '', catetory: '' };

    constructor(documentsService) {
        this.documentsService = documentsService;
    }

    updateFilters({ status, search }) {
        this.filters.status = status;
        this.filters.search = search;
        this.fetchDocuments();
    }

    @action
    resetDocuments() {
        this.documents = [];
    }

    @action
    async fetchDocuments() {
        const result = await this.documentsService.fetchDocuments(this.filters);
        if (result) {
            this.documents = result.data;
        }
    }
}