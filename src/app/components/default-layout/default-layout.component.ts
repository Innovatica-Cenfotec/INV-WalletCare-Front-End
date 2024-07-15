import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivationEnd, NavigationStart, Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { routes } from '../../app.routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Importing Ng-Zorro modules
import { NzLayoutModule, NzSiderComponent } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

// Importing components
import { HeaderComponent } from './header-default/header-default.component';
import { ILayout } from '../../interfaces';
import { LayoutService } from '../../services/layout.service';
import { filter } from 'rxjs'

@Component({
    selector: 'app-default-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule,
        NzBreadCrumbModule,
        HeaderComponent,
        NzToolTipModule
      ],
    templateUrl: './default-layout.component.html',
    styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent { 
    public isCollapsed: boolean = false;

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
      }
}
