import { GoalService } from './../../services/goal.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { GoalsListComponent } from '../../components/goal/goals-list/goals-list.component';

// Importing Ng-Zorro modules
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { AuthService } from '../../services/auth.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { catchError, tap } from 'rxjs';
import { IGoal } from '../../interfaces';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
    selector: 'app-goals',
    standalone: true,
    imports: [
        CommonModule,
        GoalsListComponent,
        NzPageHeaderModule,
        NzButtonComponent,
        NzIconModule,
        NzPopoverModule
    ],
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsComponent implements OnInit {
    public goalService = inject(GoalService);
    public authService = inject(AuthService);

    ngOnInit(): void {
        this.goalService.findAllSignal();
    }

    /**
     * Propose a goal.
     */
    proposeGoal() {
      this.goalService.proposeGoal()
    }

    /**
     * Accept a goal.
     * @param goal - The goal to accept.
     */
    acceptGoal(goal: IGoal) {
        this.goalService.acceptOrRejectGoal(goal, true)
    }

    /**
     * Reject a goal.
     * @param goal - The goal to reject.
     */
    rejectGoal(goal: IGoal) {
        this.goalService.acceptOrRejectGoal(goal, false)
    }

    /**
     * Delete a goal.
     * @param goal - The goal to delete.
     */
    deleteGoal(goal: IGoal) {
        this.goalService.deleteGoal(goal)
    }
 }
