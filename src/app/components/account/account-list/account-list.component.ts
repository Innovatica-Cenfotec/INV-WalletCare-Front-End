import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IAccount } from '../../../interfaces';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
    selector: 'app-account-list',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzButtonModule,
        NzCardModule,
        NzStatisticModule,
        NzGridModule
    ],
    templateUrl: './account-list.component.html',
    styleUrl: './account-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent {
    @Input() accountsList: IAccount[] = [];
    public selectedAccount: IAccount = {};

}
