import { Component } from '@angular/core';

// Import the NzResultModule
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [
    NzResultModule
  ],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {

}
