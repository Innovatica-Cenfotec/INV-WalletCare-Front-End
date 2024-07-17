import { Component, inject, OnInit } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { IUser } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    FormsModule
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
  public profileService = inject(ProfileService);
  public confirmPassword: string = '';
  public isEditing: boolean = false;

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
  changePassword(): void {}

  /**
   * Enables editing mode for the user profile.
   */
  editProfile(): void {
    this.isEditing = true;
  }

  /**
   * Placeholder method for deleting the user's account.
   */
  deleteAccount(): void {}
}
