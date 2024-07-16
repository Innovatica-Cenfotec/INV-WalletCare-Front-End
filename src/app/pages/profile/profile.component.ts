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

  ngOnInit(): void {
      this.loadUserProfile();
  }

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

  get fullName(): string {
    return `${this.user.name} ${this.user.lastname}`
  }

  saveChanges(): void {
    // Implement save changes logic
  }

  changePassword(): void {
    // Implement change password logic
  }

  deleteAccount(): void {
    // Implement delete account logic
  }
}
