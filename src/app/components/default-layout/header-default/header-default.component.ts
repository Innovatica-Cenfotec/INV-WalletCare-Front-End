import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges, } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Importing Ng-Zorro modules
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzIconModule,
    NzFlexModule,
    NzDropDownModule
  ],
  templateUrl: './header-default.component.html',
  styleUrl: './header-default.component.scss'
})
export class HeaderComponent {
}
