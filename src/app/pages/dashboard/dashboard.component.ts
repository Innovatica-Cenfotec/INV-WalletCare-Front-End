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
    chartExpense = [
      {
          category: 'comida',
          data: [
              { amount: 132000.34, month: 'Ene' },
              { amount: 120000.00, month: 'Dic' },
              { amount: 110000.50, month: 'Mar' }
          ],
      },
      {
          category: 'juegos',
          data: [
              { amount: 132000.34, month: 'Ene' },
              { amount: 120000.00, month: 'Feb' },
              { amount: 110000.50, month: 'Mar' }
          ],
      },
      {
          category: 'mascota',
          data: [
              { amount: 132000.34, month: 'Ene' },
              { amount: 120000.00, month: 'Jul' },
              { amount: 110000.50, month: 'Jun' }
          ],
      },
      {
          category: 'deporte',
          data: [
              { amount: 132000.34, month: 'Ene' },
              { amount: 120000.00, month: 'Feb' },
              { amount: 110000.50, month: 'Mar' }
          ],
      }
  ];

  
  chartIncome = [
    {
        category: 'salario',
        data: [
            { amount: 132000.34, month: 'Ene' },
            { amount: 120000.00, month: 'Dic' },
            { amount: 110000.50, month: 'Mar' }
        ],
    },
    {
        category: 'reposteria',
        data: [
          { amount: 132000.34, month: 'Ene' },
          { amount: 120000.00, month: 'Dic' },
          { amount: 110000.50, month: 'Mar' }
        ],
    },
    {
        category: 'teletrabajo',
        data: [
            { amount: 132000.34, month: 'Ene' },
            { amount: 120000.00, month: 'Jul' },
            { amount: 110000.50, month: 'Jun' }
        ],
    },
    {
        category: 'regalos',
        data: [
            { amount: 132000.34, month: 'Ene' },
            { amount: 120000.00, month: 'Feb' },
            { amount: 110000.50, month: 'Mar' }
        ],
    }
];
}
