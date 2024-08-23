import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';

// Importing Ng-Zorro modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { GoalStatusEnum, GoalTypeEnum, IGoal } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { SortByOptions } from '../../../sortBy';

@Component({
    selector: 'app-goals-list',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzButtonModule,
        NzSpaceModule,
        NzTypographyModule
    ],
    providers: [DatePipe, SortByOptions],
    templateUrl: './goals-list.component.html',
    styleUrl: './goals-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsListComponent {
    private datePipe = inject(DatePipe);
    public authService = inject(AuthService);
    GoalStatusEnum = GoalStatusEnum;
    expandSet = new Set<number>();

    /**
     * The list of goals to display.
     */
    @Input() goalsList: IGoal[] = [];

    /**
     * Emits the goal to be deleted.
     */
    @Output() deleteGoal = new EventEmitter<IGoal>();

    /**
     * Emits the goal to be accepted.
     */
    @Output() acceptGoal = new EventEmitter<IGoal>();

    /**
     * Emits the goal to be rejected.
     */
    @Output() rejectGoal = new EventEmitter<IGoal>();

    /**
     * Emits the goal to be edited.
     */
    onExpandChange(id: number | undefined, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id ?? 0);
        } else {
            this.expandSet.delete(id ?? 0);
        }
    }

    /**
     * Returns the corresponding string representation of the given GoalTypeEnum.
     * 
     * @param type - The GoalTypeEnum value.
     * @returns The string representation of the GoalTypeEnum value.
     */
    getType(type: GoalTypeEnum | undefined): string {
        switch (type) {
            case GoalTypeEnum.saving: return 'Ahorro';
            case GoalTypeEnum.expense_reduction: return 'Reducción de Gasto';
            default: return '';
        }
    }


    /**
     * Converts a GoalStatusEnum value to its corresponding string representation.
     * 
     * @param status - The GoalStatusEnum value to convert.
     * @returns The string representation of the GoalStatusEnum value.
     */
    getGoalStatus(status: GoalStatusEnum | undefined): string {
        switch (status) {
            case GoalStatusEnum.goal_pending: return 'Pendiente de aprobación';
            case GoalStatusEnum.goal_rejected: return 'Meta Rechazada';
            case GoalStatusEnum.active: return 'Activa';
            case GoalStatusEnum.completed: return 'Completada';
            case GoalStatusEnum.failed: return 'Fallida';
            default: return '';
        }
    }

    /**
     * Set the date format
     * @param date is the date
     * @returns formated date dd/MM/yyyy HH:mm
     */
    getDate(date: Date | undefined): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }

    /**
     * Sorts the goals based on the account name in a case-insensitive manner.
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns returns number sort by account 
     */
    sortByAccount(a: IGoal, b: IGoal): number {
        return (a.account?.name?.toLowerCase() ?? '').localeCompare(b.account?.name?.toLowerCase() ?? '');
    }

    /**
     * Sorts two goals by their name in a case-insensitive manner.
     * 
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns returns number sort by name
     */
    sortByName(a: IGoal, b: IGoal): number {
        return (a.name?.toLowerCase() ?? '').localeCompare(b.name?.toLowerCase() ?? '');
    }


    /**
     * Sorts the goals based on their description in a case-insensitive manner.
     * 
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns A number indicating the sorting order.
     */
    sortByDescription(a: IGoal, b: IGoal): number {
        return (a.description?.toLowerCase() ?? '').localeCompare(b.description?.toLowerCase() ?? '');
    }

    /**
     * Sorts the goals based on their recommendation.
     * 
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns A number indicating the sorting order.
     */
    sortByRecommendation(a: IGoal, b: IGoal): number {
        return (a.recommendation?.toLowerCase() ?? '').localeCompare(b.recommendation?.toLowerCase() ?? '');
    }

    /**
     * Sorts two goals based on their type.
     * 
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns A number indicating the sorting order.
     */
    sortByType(a: IGoal, b: IGoal): number {
        return this.getType(a.type).localeCompare(this.getType(b.type));
    }

    /**
     * Sorts two goals based on their status.
     * 
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns A number indicating the sorting order.
     */
    sortByStatus(a: IGoal, b: IGoal): number {
        return this.getGoalStatus(a.status).localeCompare(this.getGoalStatus(b.status));
    }

    /**
     * Sorts two goals based on their creation date.
     * 
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns A number indicating the sorting order.
     */
    sortByDateCreated(a: IGoal, b: IGoal): number {
        return (a.createdAt?.toString() ?? '').localeCompare(b.createdAt?.toString() ?? '');
    }

    /**
     * Sorts two goals based on their target date.
     * 
     * @param a - The first goal to compare.
     * @param b - The second goal to compare.
     * @returns A number indicating the sorting order.
     */
    sortByDateTarget(a: IGoal, b: IGoal): number {
        return (a.targetDate?.toString() ?? '').localeCompare(b.targetDate?.toString() ?? '');
    }
}