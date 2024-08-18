import { Component, inject, OnInit } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzButtonComponent,
    NzSpaceModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    UserListComponent
  ],  
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  public usersService = inject(UserService);

  private nzNotificationService = inject(NzNotificationService);
  private nzModalService = inject(NzModalService);

  ngOnInit(): void {
    this.usersService.getAllSignal();
  }


  changeUserStatus(user: IUser){

    console.log(user);
    user.authorities = [];

    
    this.nzModalService.confirm({
      nzTitle: `¿Estás seguro de que quieres cambiar el estado del usuario: ${user.email}?`,
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        user.enabled = !user.enabled;
        this.usersService.updateUserSignal(user).subscribe({
          next: (response : any) => {
            
            this.nzNotificationService.success('Éxito', user.enabled === true ? "El usuario se activó correctamente": "El usaurio se inactivó correctamente");
          },
          error: (error: any) => {
            console.log(error)
            this.nzNotificationService.error('Lo sentimos', error.error.detail);
          }
        })
      },
      nzCancelText: 'No'
    });

    
  }
}
