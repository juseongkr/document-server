import { observable, action } from "mobx";

export default class DocumentsStore {
  @observable documents = [];
  @observable inbox = [];
  @observable outbox = [];
  @observable archive = [];
  @observable filters = { status: "", search: "", category: "" };

  constructor(documentsService) {
    this.documentsService = documentsService;
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
    this.inbox = [];
    this.outbox = [];
    this.archive = [];
  }

  @action
  async fetchDocuments() {
    const result = await this.documentsService.fetchDocuments(this.filters);

    if (result) {
      this.documents = result.data;
    }
  }

  @action
  async fetchInbox() {
    const result = await this.documentsService.fetchInbox();

    if (result) {
      this.inbox = result.data;
    }
  }

  @action
  async fetchArchive() {
    const result = await this.documentsService.fetchArchive();

    if (result) {
      this.archive = result.data;
    }
  }

  @action
  async fetchOutbox() {
    const result = await this.documentsService.fetchOutbox();

    if (result) {
      this.outbox = result.data;
    }
  }

  @action
  async approveDocument(id) {
    await this.documentsService.approveDocument(id);
    this.fetchInbox();
    this.fetchOutbox();
    this.fetchArchive();
  }

  @action
  async rejectDocument(id) {
    await this.documentsService.rejectDocument(id);
    this.fetchInbox();
    this.fetchOutbox();
    this.fetchArchive();
  }

  @action
  async createDocument(title, description, category, approvers) {
    const result = await this.documentsService.createDocument(
      title,
      description,
      category,
      approvers
    );

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
