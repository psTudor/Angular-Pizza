export interface Roles {
  client: boolean;
  waiter: boolean;
  admin: boolean;
}

export class User {
  uid: string;
  email: string;
  roles: Roles;

  constructor({authData}: { authData: any }) {
    this.uid = authData.uid;
    this.email = authData.email;
    this.roles = {admin: false, waiter: false, client: true }
  }
}
