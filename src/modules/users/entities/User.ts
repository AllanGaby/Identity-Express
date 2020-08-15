export enum UserStatus {
  Created = 'created',
  Validated = 'validated',
}

export default class User {
  id: string;

  name: string;

  email: string;

  password: string;

  hash: string;

  status: UserStatus;
}
