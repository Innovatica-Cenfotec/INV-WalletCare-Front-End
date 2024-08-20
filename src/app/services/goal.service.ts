import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGoal } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class GoalService extends BaseService<IGoal> {
    protected override source: string = 'goals';
    private goalListSignal = signal<IGoal[]>([]);
    private isProposingGoalSignal = signal(false);

    get goals$() {
        return this.goalListSignal;
    }

    get isProposingGoal$() {
        return this.isProposingGoalSignal;
    }

    /**
    * Get all goals
    * @returns An Observable that emits an array of goals.
    */
    findAllSignal() {
        return this.findAll().subscribe({
            next: (response: any) => {
                this.goalListSignal.set(response);
                this.SortListByDate();
            }, error: (error: any) => {
                console.error('Error fetching goals', error);
                throw error;
            }
        });
    }

    /**
     * Accepts or rejects a goal.
     * 
     * @param id - The ID of the goal.
     * @param status - The status of the goal (true for accepted, false for rejected).
     * @returns An Observable that emits the updated goal.
     * @throws If there is an error updating the goal.
     */
    acceptOrRejectGoal(goal: IGoal, accept: boolean) {
        if (!goal || !goal.id) {
            throw new Error('Invalid goal ID');
        }

        return this.http.put(`${this.source}/accept-or-reject/${goal.id}`, accept).subscribe({
            next: (response: any) => {
                this.goalListSignal.update(goals => goals.map(g => g.id === goal.id ? response : g));
            },
            error: (error: any) => {
                console.error('Error accepting or rejecting goal', error);
                throw error;
            }
        });
    }

    /**
     * Deletes a goal signal.
     *
     * @param id - The ID of the goal to delete.
     * @returns An Observable that emits the response from the server.
     * @throws Error if the provided goal ID is invalid.
     */
    deleteGoal(goal: IGoal) {
        if (!goal || !goal.id) {
            throw new Error('Invalid goal ID');
        }

        return this.del(goal.id).subscribe({
            next: (response: any) => {
                this.goalListSignal.update(goals => goals.filter(g => g.id !== goal.id));
            },
            error: (error: any) => {
                console.error('Error deleting goal', error);
                throw error;
            }
        });
    }

    /**
     * Proposes a goal.
     * 
     * @returns An Observable that emits the proposed goal.
     * @throws If there is an error proposing the goal.
     */
    proposeGoal() {
        this.isProposingGoalSignal.set(true);
        this.http.post<IGoal>(`${this.source}/propose`, null).subscribe({
            next: (response: any) => {
                this.goalListSignal.update(goals => [...goals, response]);
                this.SortListByDate();
                this.isProposingGoalSignal.set(false);
            },
            error: (error: any) => {
                this.isProposingGoalSignal.set(false);
                console.error('Error proposing goal', error);
                throw error;
            }
        });
    }

    /**
     * Sorts the goals by date in descending order.
     */
    private SortListByDate() {
        this.goalListSignal.update(goals => goals.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : null;
            const dateB = b.createdAt ? new Date(b.createdAt) : null;
            return dateB && dateA ? dateB.getTime() - dateA.getTime() : 0;
        }));
    }
}