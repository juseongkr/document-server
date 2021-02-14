import BaseHttpService from "./base-http.service";
import queryString from "query-string";

export default class DocumentsService extends BaseHttpService {
  fetchDocuments({ status, search, category }) {
    const queryObj = {};

    if (status.length) {
      queryObj.status = status;
    }

    if (search.length) {
      queryObj.search = search;
    }

    if (category.length) {
      queryObj.category = category;
    }

    const queryStr = queryString.stringify(queryObj);
    return this.get(`docs` + (queryStr ? `?${queryStr}` : ""));
  }

  async deleteDocument(id) {
    await this.delete(`docs/id/${id}`);
  }

  createDocument(title, description, category, approvers) {
    approvers = [approvers.split(",")];
    return this.post(`docs`, { title, description, category, approvers });
  }
}
