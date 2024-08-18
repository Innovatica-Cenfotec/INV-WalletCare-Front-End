import { CommonModule } from '@angular/common';
import { Component } from "@angular/core";

// CUSTOM COMPONENT
import { BarchartComponent } from '../../components/chart/barchart/barchart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BarchartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
