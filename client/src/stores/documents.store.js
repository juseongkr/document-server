import { observable, action } from "mobx";

export default class DocumentsStore {
  @observable documents = [];
  @observable filters = { status: "", search: "", category: "" };

  constructor(documentsService) {
    this.documentsService = documentsService
  }

  updateFilters({ status, search, category }) {
    this.filters.status = status;
    this.filters.search = search;
    this.filters.category = category;
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

  @action
  async createDocument(title, description, category, approvers) {
    const result = await this.documentsService.createDocument(title, description, category, approvers);

    if (result) {
      this.documents.push(result.data);
    }
  }

  @action
  async deleteDocument(id) {
    const idx = this.documents.findIndex((doc) => doc.id === id);
    await this.documentsService.deleteDocument(id);
    this.documents.splice(idx, 1);
  }
}
