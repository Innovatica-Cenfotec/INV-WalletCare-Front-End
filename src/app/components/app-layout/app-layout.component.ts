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
import { HeaderComponent } from './header/header.component';
import { ILayout } from '../../interfaces';
import { LayoutService } from '../../services/layout.service';
import { filter } from 'rxjs';

// Interface for the menu items
interface IMenuItems {
  icon: string;
  name: string;
  path: string;
  isActive: boolean;
}

@Component({
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
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  public authService = inject(AuthService);
  public breakpointObserver = inject(BreakpointObserver);
  public layoutService = inject(LayoutService);
  public breadcrumb: string[] = [];
  private router = inject(Router);
  public isCollapsed: boolean = false;
  public menuItems: IMenuItems[] = [];

  ngOnInit() {
    this.observerBreakpointChanges();
    this.loadMenuItems();

    // Subscribe to the breadcrumb observable
    this.layoutService.getBreadcrumbObservable().subscribe(breadcrumb => {
      this.breadcrumb = breadcrumb;
    });

    // Subscribe to the router events
    // This is used to update the breadcrumb based on the current route
    this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(e => {
      const appRoutes = routes.filter(route => route.path == 'app')[0] as any;
      this.authService.getPermittedRoutes(appRoutes.children).reverse().forEach(item => {
        const isActive = this.isActiveRoute(item.path);
        if (isActive) {
          this.layoutService.setBreadcrumb(item?.data?.['layout']?.breadcrumb);
        }
      });
    });
  }

  /**
   * Load menu items based on the user's role
   * @returns void
   */
  loadMenuItems(): void {
    const appRoutes = routes.filter(route => route.path == 'app')[0] as any;
    this.authService.getPermittedRoutes(appRoutes.children).reverse().forEach(item => {
      // check if showInSidebar is false
      if (item?.data?.['showInSidebar'] == false) {
        return;
      }

      const isActive = this.isActiveRoute(item.path);
      if (isActive) {
        this.layoutService.setBreadcrumb(item?.data?.['layout']?.breadcrumb);
      }

      const layout = item?.data?.['layout'] as ILayout;
      const menu: IMenuItems = {
        path: item.path || '',
        icon: layout?.icon || '',
        name: layout?.name || '',
        isActive: isActive,
      };

      this.menuItems.push(menu);
    });
  }

  /**
   * Observer breakpoint changes and update isCollapsed
   * @returns void
   */
  observerBreakpointChanges(): void {
    Breakpoints.Medium = '(min-width: 768px)';
    this.breakpointObserver.observe(Breakpoints.Medium).subscribe(result => {
      this.isCollapsed = !result.matches;
    });
  }

  /**
   * Toggles the collapsed state of the sidebar
   * @returns void
   */
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * Checks if the current route is active
   * @param path string
   * @returns boolean
   */
  isActiveRoute(path: string): boolean {
    // check home route
    if (path == '' && this.router.url == '/app') {
      return true;
    }

    // check is active route
    if (this.router.url == '/app/' + path) {
      return true;
    }

    return false;
  }
}