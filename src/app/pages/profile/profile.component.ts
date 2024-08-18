import { Component, inject, OnInit } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { IUser } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ForgotPasswordResetComponent } from '../forgot-password-reset/forgot-password-reset.component';
import { error } from '@ant-design/icons-angular';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    FormsModule,
    NzPageHeaderModule,
    NzModalModule,
    ForgotPasswordResetComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public user: IUser = {
    nickname: '',
    name: '',
    lastname: '',
    email: '',
    password: ''
  };
  constructor(private modal: NzModalService,private message: NzMessageService) {}
  public profileService = inject(ProfileService);
  public changePasswordService=inject(PasswordRecoveryService)
  public confirmPassword: string = '';
  public isEditing: boolean = false;
  public isVisible=false;
  /**
   * Initializes the component and loads the user profile.
   */
  ngOnInit(): void {
      this.loadUserProfile();
  }

  /**
   * Loads the user profile from the profile service.
   */
  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (data: IUser) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Error loading user profile', error)
      }
    });
  }

  /**
   * Saves changes to the user profile and disables editing mode.
   */
  saveChanges(): void {
    this.isEditing = false;
    this.user.authorities = undefined;
    this.profileService.updateUserProfile(this.user);
  }

  /**
   * Placeholder method for changing the user's password.
   */
  changePasswordConfirmation(): void {
    this.modal.confirm({
      nzTitle: '¿Seguro que desea cambiar su contraseña?',
      nzContent: '<b style="color: red;">Cambiar su contraseña cerrará la sesión actúal.</b>',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.isVisible=true,
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancelado')
    });
  }
  closeModal():void{
    this.isVisible=false;
  }

  /**
   * Enables editing mode for the user profile.
   */
  editProfile(): void {
    this.isEditing = true;
  }
}
