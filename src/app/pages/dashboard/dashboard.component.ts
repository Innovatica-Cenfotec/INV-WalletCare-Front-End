import { CommonModule } from '@angular/common';
import { Component } from "@angular/core";

// Importing Ng-Zorro modules
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

// CUSTOM COMPONENT
import { BarchartComponent } from '../../components/chart/barchart/barchart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    BarchartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
