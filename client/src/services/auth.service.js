import BaseHttpService from './base-http.service';
import axios from 'axios';

export default class AuthService extends BaseHttpService {

    async signin(username, password) {
        const result = await axios.post(`${this.URL}/auth/sigin`, { username, password });
        const accessToken = result.data.accessToken;
        this.saveToken(accessToken);

        return result.data.username;
    }

    async signup(username, password) {
        await axios.post(`${this.URL}/auth/signup`, { username, password });
    }

    async signout() {
        this.removeToken();
    }
}