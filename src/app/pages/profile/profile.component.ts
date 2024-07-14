import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user = {
    alias: '',
    fullName: '',
    emailUsername: '',
    emailDomain: 'innova.com',
    password: '',
    confirmPassword: ''
  };

  changePassword() {
    // Lógica para cambiar la contraseña
  }

  saveChanges() {
    // Lógica para guardar los cambios
  }

  deleteAccount() {
    // Lógica para eliminar la cuenta
  }

}
