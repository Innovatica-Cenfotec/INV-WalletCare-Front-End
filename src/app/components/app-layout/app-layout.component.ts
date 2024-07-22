import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { routes } from '../../app.routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs';

// Importing Ng-Zorro modules
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

// Importing components
import { HeaderComponent } from './header/header.component';
import { ILayout } from '../../interfaces';

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
  public breadcrumb: string[] = [];
  private router = inject(Router);
  public isCollapsed: boolean = false;
  public menuSignal: IMenuItems[] = [];
  
  ngOnInit() {
    this.observerBreakpointChanges();
    this.loadMenuItems();
   
    this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(e => {
      const routeConfig = (e as ActivationEnd).snapshot.routeConfig;
      if (routeConfig == undefined || routeConfig.data == undefined){
        return;
      }
      
      // Update breadcrumb
      if (routeConfig.data?.['layout']?.breadcrumb){
        this.breadcrumb = routeConfig.data?.['layout']?.breadcrumb;
      }

      if (routeConfig.data?.['layout']?.showInSidebar == false){
        this.menuSignal.forEach(item => item.isActive = false);
        return;
      }

      // Update menu items
      const parent = routeConfig.data?.['parent'];
      if (parent){
        this.menuSignal.forEach(item => item.isActive = item.path == parent);
      }
      else {
        this.menuSignal.forEach(item => item.isActive = item.path == routeConfig.path);
      }
    });
  }

  /**
   * Load menu items based on the user's role
   * @returns void
   */
  loadMenuItems(): void {
    const appRoutes = routes.filter(route => route.path == 'app')[0] as any;
    this.authService.getPermittedRoutes(appRoutes.children).reverse().forEach(item => {
        
      const routeConfig = this.router.routerState.snapshot.root.children[0].children[0].routeConfig;
      const parent = routeConfig?.data?.['parent'];
           
      if (routeConfig?.data?.['layout']?.breadcrumb){
        this.breadcrumb = routeConfig.data?.['layout']?.breadcrumb;
      }
 
      // check if showInSidebar is false
      if (item?.data?.['showInSidebar'] == false) {
        return;
      }

      const layout = item?.data?.['layout'] as ILayout;
      this.menuSignal.push({
        path: item.path || '',
        icon: layout?.icon || '',
        name: layout?.name || '',
        isActive: parent ? parent == item.path : routeConfig?.path == item.path
      });
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
}