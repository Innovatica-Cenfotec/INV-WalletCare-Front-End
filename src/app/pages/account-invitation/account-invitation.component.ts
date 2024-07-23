import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormItemComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AccountService } from '../../services/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IAccountUser } from '../../interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError } from 'rxjs';
import { error } from '@ant-design/icons-angular';


@Component({
    selector: 'app-account-invitation',
    standalone: true,
    imports: [
        CommonModule,
        NzCardModule,
        NzInputModule,
        NzButtonModule,
        NzDividerModule,
        NzFormModule,
        NzFormItemComponent,
        NzModalModule,
        NzIconModule
    ],
    templateUrl: './account-invitation.component.html',
    styleUrl: './account-invitation.component.scss',
})
export class AccountInvitationComponent implements OnInit {
    public host: string = 'jscruzgz@gmail.com';
    public accountName: string = 'Main';
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private accountService: AccountService = inject(AccountService);
    private notificationService = inject(NzNotificationService);
    private accountId: number = 0;
    private userId: number = 0;

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.host = params['host'];
            this.accountName = params['accountName'];
            this.accountId = params['accountId'];
            this.userId = params['userId'];
        });
    }

    /**
     * Set the invitation status to accepted
     */
    acceptInvitation(): void {
        this.responsenInvitation(true);
    }

    /**
     * Set the invitation status to declined
     */
    cancelInvitation() {
        this.responsenInvitation(false);
    }

    /**
     * saves the invitation status 
     * @param value is the invitation status
     */
    responsenInvitation(value: boolean): void {
        const payload: IAccountUser = {
            invitationStatus: value ? 2 : 3,
            user: {
                id: this.userId
            },
            account: {
                id: this.accountId
            }
        }

        this.accountService.manageSharedAccounInvitationtStatus(payload).subscribe({
            next: (response: any) => {
                this.router.navigateByUrl('/app');
                this.notificationService.success('Éxito', response.message);
            },
            error: (error => {
                this.notificationService.error('Error', error.error.detail)
                throw error;
            })
        });
    }
}
