/**
 * SortByOptions class contains all the sorting options.
 */
export class SortByOptions {
    /**
     * Sort by name
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByName(a: any, b: any): number {
        return (a.name?.toLowerCase() ?? '').localeCompare(b.name?.toLowerCase() ?? '');
    }

    /**
     * Sort by description
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByDescription(a: any, b: any): number {
        return (a.description?.toLowerCase() ?? '').localeCompare(b.description?.toLowerCase() ?? '');
    }

    /**
     * Sort by amount
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByAmount(a: any, b: any): number {
        return (a.amount?.toString() ?? '').localeCompare(b.amount?.toString() ?? '');
    }

    /**
     * Sort by amount type
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByAmountType(a: any, b: any): number {
        return (a.amountType ?? '').localeCompare(b.amountType ?? '');
    }

    /**
     * Sort by type
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByType(a: any, b: any): number {
        return (a.type ?? '').localeCompare(b.type ?? '');
    }

    /**
     * Sort by frequency
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByFrequency(a: any, b: any): number {
        return (a.frequency ?? '').localeCompare(b.frequency ?? '');
    }

    /**
     * Sort by scheduled day
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByScheduledDay(a: any, b: any): number {
        return (a.scheduledDay?.toString() ?? '').localeCompare(b.scheduledDay?.toString() ?? '');
    }

    /**
     * Sort by account
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByAccount(a: any, b: any): number {
        return (a.account?.name ?? '').localeCompare(b.account?.name ?? '');
    }

    /**
     * Sort by user
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByUser(a: any, b: any): number {
        return (a.owner?.nickname ?? '').localeCompare(b.owner?.nickname ?? '');
    }

    /**
     * Sort by tax
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByTax(a: any, b: any): number {
        return (a.tax?.name ?? '').localeCompare(b.tax?.name ?? '');
    }

    /**
     * Sort by date
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByDate(a: any, b: any): number {
        return new Date(a.updatedAt ?? new Date).getTime() - new Date(b.updatedAt ?? new Date).getTime();
    }
   
    /**
     * Sort by category
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByCategory(a: any, b: any): number {
        return (a.expenseCategory?.name ?? '').localeCompare(b.expenseCategory?.name ?? '');
    }

    /**
     * Sort by balance
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByBalance(a: any, b: any): number {
        return (a.balance?.toString() ?? '').localeCompare(b.balance?.toString() ?? '');
    }

    /**
     * Sort by status
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByStatus(a: any, b: any): number {
        return (a.status ?? '').localeCompare(b.status ?? '');
    }

    /**
     * Sort by email
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByEmail(a: any, b: any): number {
        return (a.email ?? '').localeCompare(b.email ?? '');
    }

    /**
     * Sort by nickname
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByNickname(a: any, b: any): number {
        return (a.nickname ?? '').localeCompare(b.nickname ?? '');
    }

    /**
     * Sort by id
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortById(a: any, b: any): number {
        return (a.id.toString() ?? '').localeCompare(b.id.toString() ?? '');
    }

    /**
     * Sort by owner
     * @param a is the first element
     * @param b is the second element
     * @returns the comparison
     */
    sortByOwner(a: any, b: any): number {
        return (a.owner?.nickname ?? '').localeCompare(b.owner?.nickname ?? '');
    }
}
