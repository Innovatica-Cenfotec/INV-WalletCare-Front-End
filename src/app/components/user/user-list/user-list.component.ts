import { Component, effect, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-from/user-form.component';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UserFormComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public search: String = '';
  public userList: IUser[] = [];
  private service = inject(UserService);
  public currentUser: IUser = {
    email: '',
    lastname: '',
    password: '',
    name: ''
  };
  
  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.userList = this.service.users$();
    });
  }

  showDetail(user: IUser, modal: any) {
    this.currentUser = {...user}; 
    modal.show();
  }

  deleteUser(user: IUser) {
    this.service.deleteUserSignal(user).subscribe({
      next: () => {
       
      },
      error: (error: any) => {
        
      }
    })
  }

}
