import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

// Define the icons
const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

/**
 * Provides the Ng-Zorro icons
 * @returns EnvironmentProviders The providers for the icons
 */
export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}