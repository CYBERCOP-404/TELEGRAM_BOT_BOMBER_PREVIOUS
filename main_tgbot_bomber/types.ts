
export enum AppView {
  LOGIN = 'LOGIN',
  SENDER = 'SENDER',
  CONGRATS = 'CONGRATS'
}

export interface UserCredentials {
  token: string;
  userId: string;
}

export interface SendStatus {
  sent: number;
  failed: number;
  remaining: number;
  total: number;
}
