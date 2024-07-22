export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRole {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
}

/**
 * Interface for the layout
 */
export interface ILayout {
  icon: string;
  breadcrumb: string[];
  name: string;
  parentPath?: string;
}

/**
 * Interface for type of form
 */
export enum ITypeForm {
  create = "CREATE",
  update = "UPDATE"
}

/**
 * Interface for account type
 */
export enum IAccountType {
  personal = 0,
  shared = 1,
}

/**
 * Interface for account
 */
export interface IAccount {
  id?: number;
  name?: string;
  description?: string;
  owner?: IUser;
  type?: IAccountType | string;
  balance?: number;
  createdAt?: Date;
  updatedAt?: Date;
  default?: boolean;
}

/**
 * Interface for balance colors
 */
export enum IBalance{
  surplus = '#3E7422',
  deficit = '#D23537',
  balance = '#B17A0C'
}

export interface IForgotResetPassword{
  otp:string;
  newPassword:string;
  email:string;
}
export interface ISendInvite{
  inviteToEmail:string,
  accountId:number;
}

/**
 * Interface for account user
 */ 
export interface IAccountUser{
  id?: number;
  account?: IAccount;
  user?: IUser;
  isActive?: boolean;
  lastTransactionId?: string;
  lastTransactionBalance?: string;
  joinedAt?: Date;
  leftAt?: Date;
  invitationStatus?: number;
  isDeleted?: boolean;
}