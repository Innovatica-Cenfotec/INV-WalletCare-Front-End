import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SortByOptions } from '../../../sortBy';


@Component({
  selector: 'app-user-list',
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
    NzToolTipModule,
    NzButtonModule
  ],
  providers: [DatePipe, SortByOptions],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public sortby = inject(SortByOptions);
  @Input() userList: IUser[] = [];
  @Output() changeUserStatus = new EventEmitter<IUser>();

  public search: String = '';
  private datePipe = inject(DatePipe);
  private service = inject(UserService);


  deleteUser(user: IUser) {
    this.service.deleteUserSignal(user).subscribe({
      next: () => {

      },
      error: (error: any) => {

      }
    })
  }

  setStatus(enabled: boolean | undefined) {
    if (enabled) {
      return "Activo"
    }
    return "Inactivo"

  }

  /**
 * Set the date format
 * @param date is the date
 * @returns formated date dd/MM/yyyy HH:mm
 */
  getDate(date: Date | undefined): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy hh:ss') || '';
  }

  setDisabled(user: IUser){
    if(user.email === "admin@walletcare.com"){
      return true
    }
    return false
  }

  showNotification(){
    
  }
}