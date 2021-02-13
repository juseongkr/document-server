import axios from 'axios';

export default class BaseHttpService {
    URL = 'http://localhost:3000';
    _accessToken = null;

    constructor(routerStore) {
        this.routerStore = routerStore;
    }

    async get(endpoint, options={}) {
        Object.assign(options, this._getCommonOptions());
        return axios.get(`${this.URL}/${endpoint}`, options)
            .catch(error => this._handleHttpError(error));
    }

    async post(endpoint, data={}, options={}) {
        Object.assign(options, this._getCommonOptions());
        return axios.post(`${this.URL}/${endpoint}`, data, options)
            .catch(error => this._handleHttpError(error));
    }

    async delete(endpoint, options={}) {
        Object.assign(options, this._getCommonOptions());
        return axios.delete(`${this.URL}/${endpoint}`, options)
            .catch(error => this._handleHttpError(error));
    }

    async patch(endpoint, data={}, options={}) {
        Object.assign(options, this._getCommonOptions());
        return axios.patch(`${this.URL}/${endpoint}`, data, options)
            .catch(error => this._handleHttpError(error));
    }

    get accessToken() {
        return this._accessToken ? this._accessToken : this.loadToken();
    }

    saveToken(accessToken) {
        this._accessToken = accessToken;

        return localStorage.setItem('accessToken', accessToken);
    }

    loadToken() {
        const token = localStorage.getItem('accessToken');
        this._accessToken = token;

        return token;
    }

    removeToken() {
        localStorage.removeItem('accessToken');
    }

    _handleHttpError(error) {
        const { statusCode } = error.response.data;

        if (statusCode !== 401) {
            throw error;
        }

        return this._handleUnauthorized()
    }

    _handleUnauthorized() {
        this.routerStore.push('/signin');
    }

    _getCommonOptions() {
        const token = this.loadToken();

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }
}