import { FormControl } from '@angular/forms';

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
    personal = "PERSONAL",
    shared = "SHARED"
}

/**
 * Interface for account
 */
export interface IAccount {
    id?: number;
    name?: string;
    description?: string;
    owner?: IUser;
    type?: IAccountType;
    balance?: number;
    createdAt?: Date;
    updatedAt?: Date;
    default?: boolean;
}

/**
 * Interface for balance colors
 */
export enum IBalance {
    surplus = '#3E7422',
    deficit = '#D23537',
    balance = '#B17A0C'
}

export interface IForgotResetPassword {
    otp: string;
    newPassword: string;
    email: string;
}
export interface ISendInvite {
    inviteToEmail: string,
    accountId: number;
}

/**
 * Interface for account user
 */
export interface IAccountUser {
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

export interface IGenericResponse {
    message?: String;
}

export enum ITransactionType {
    INCOME = 'Income',
    EXPENSE = 'Expense',
    SAVING = 'Saving'
}

export interface ITransaction {
    id?: number;
    owner?: IUser;
    account?: IAccount;
    type?: ITransactionType;
    incomeAllocation?: string;
    expense?: IExpense;
    amount?: number;
    previousBalance?: number;
    description?: string;
    createdAt?: Date;
    deletedAt?: Date;
    deleted?: boolean;
}
/*
* Interface for allocation
*/
export interface IAllocation {
    id: number;
    name: string;
    amount: FormControl<number>;
    percentage: FormControl<number>;
    controlInstance: string;
}

/**
 * Enum that represents the type of income or expense.
 */
export enum IIncomeExpenceType {
    unique = "UNIQUE",
    recurrence = "RECURRENCE"
}

/**
 * Enumerates the possible types of frequency.
 */
export enum IFrequencyType {
    daily = "DAILY",
    monthly = "MONTHLY",
    annual = "ANNUAL",
    biweekly = "BIWEEKLY",
    weekly = "WEEKLY",
    other = "OTHER"
}

/**
 * Enumerates the possible types amount.
 */
export enum IAmountType {
    net = "NET",
    gross = "GROSS"
}

/**
 * Interface for tax
 */
export interface Itax {
    id?: number;
    user?: IUser;
    name?: string;
    description?: string;
    percentage?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IIncomeAllocation {
    id?: number;
    user?: IUser;
    income?: IIncome;
    account?: IAccount;
    percentage?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Interface for income
 */
export interface IIncome {
    addTransaction?: boolean;
    id?: number;
    owner?: IUser; // 'user' dont work, the backend send an 'owner' attribute
    name?: string;
    description?: string;
    isTemplate?: boolean;
    type?: IIncomeExpenceType;
    amount?: 0 | string;
    amountType?: IAmountType;
    scheduledDay?: number;
    isTaxRelated?: boolean;
    frequency?: IFrequencyType;
    tax?: Itax;
    createdAt?: Date;
    updatedAt?: Date;
    account?: IAccount;
    listIncomeAllocation?: IIncomeAllocation[];
}

/**
 * Interface for expense
 */
export interface IExpense {
    addTransaction?: boolean;
    id?: number;
    owner?: IUser; // 'user' dont work, the backend send an 'owner' attribute
    name?: string;
    description?: string;
    isTemplate?: boolean;
    type?: IIncomeExpenceType;
    amount?: 0 | string;
    amountType?: IAmountType;
    scheduledDay?: number;
    isTaxRelated?: boolean;
    frequency?: IFrequencyType;
    tax?: Itax;
    createdAt?: Date;
    updatedAt?: Date;
    account?: IAccount;
}


export interface IBalanceDTO {
    monthlyExpenseBalance?: number;
    recurrentExpensesBalance?: number;
    monthlyIncomeBalance?: number;
    recurrentIncomesBalance?: number;
}

export interface IRecurrence {
    id?: number;
    user?: IUser;
    account?: IAccount;
    expense?: IExpense;
    income?: IIncome;
    createdAt?: Date;
}

// NOTIFICATIONS

export interface INotification {
    id?: number;
    owner?: IUser;
    type?: INotificationType;
    title?: string;
    message?: string;
    read?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deleted?: boolean;
}

/**
 * Enumerates the possible types of notification.
 */
export enum INotificationType {
    achievement = "ACHIEVEMENT",
    account_status = "ACCOUNT_STATUS",
    goal = "GOAL",
    tip = "TIP"
}

export interface INotificationOTP {
    receiverEmail?: string;
    type?: string;
    title?: string;
    message?: string;
}

export interface LoanDTO {
    currecy?: ICurrencyType | null,
    ammount?: 0 | number | null,
    paymentDeadline?: 0 | number | null,
    interestRate?: 0 | number | null,
    fee?: 0 | number | null
}

export enum ICurrencyType {
    colones = "COLONES",
    dollars = "DOLLARS"
}