import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IAccount, IAccountType, IBalance } from '../../../interfaces';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SortByOptions } from '../../../sortBy';

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
    NzGridModule,
    NzSpaceModule,
    NzToolTipModule
  ],
  providers: [SortByOptions],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent {
  public sortby = inject(SortByOptions);

  /**
   * Input property to accept an array of accounts to be displayed.
   */
  @Input() accountsList: IAccount[] = [];

  /**
   * Output event emitter to notify when an account needs to be deleted.
   * Emits the account object that was selected.
   */
  @Output() deleteAccount = new EventEmitter<IAccount>();

  /**
   * Output event emitter to notify when an account needs to be edited.
   * Emits the account object that was selected.
   */
  @Output() editAccount = new EventEmitter<IAccount>();

  /**
   * Output event emitter to notify when details of a specific account need to be viewed.
   * Emits the account object that was selected.
   */
  @Output() viewAccountDetails = new EventEmitter<IAccount>();


  /**
 * Gets the account type
 * @param account The account
 * @returns The account type
 */
  getAccountType(account: IAccount): string {
    if (!account) {
      return '';
    }

    switch (account.type) {
      case IAccountType.personal:
        return 'Personal';
      case IAccountType.shared:
        return 'Compartida';
      default:
        return '';
    }
  }


  /**
 * Set the color for amounts
 * @param amount is the amount
 * @returns the ammount whith the feedback color
 */
  formatAmount(amount: number | undefined) {
    let style = '';
    if (amount != undefined) {
      if (amount > 0) {
        style = 'color: ' + IBalance.surplus; ';'
      } else if (amount < 0) {
        style = 'color: ' + IBalance.deficit; ';'
      } else {
        style = 'color: ' + IBalance.balance; ';'
      }
    }
    return style;
  }
}