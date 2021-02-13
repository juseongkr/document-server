import { action, observable } from "mobx";

export default class UserStore {
  @observable username = null;

  constructor(authService) {
    this.authService = authService;
  }

  @action
  async signin(username, password) {
    this.username = await this.authServices.sigin(username, password);
  }

  @action
  async signup(username, password) {
    return this.authServices.signup(username, password);
  }

  @action
  signout() {
    this.username = null;
    this.authServices.removeToken();
  }
}
