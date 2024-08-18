import { CommonModule } from '@angular/common';
import { Component, ViewChild } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { ChartOptions } from '../../../interfaces';

@Component({
    selector: 'app-barchart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './barchart.component.html',
    styleUrl: './barchart.component.scss'
})
export class BarchartComponent {
    @ViewChild("chart")
    chart!: ChartComponent;
    
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        // Example JSON data
        const jsonData = [
            {
                category: 'comida',
                expense: [
                    { amount: 132000.34, date: new Date('2024-01-10') },
                    { amount: 120000.00, date: new Date('2024-05-15') },
                    { amount: 110000.50, date: new Date('2024-10-20') }
                ],
            },
            {
                category: 'transporte',
                expense: [
                    { amount: 15000.00, date: new Date('2024-06-12') },
                    { amount: 102000.00, date: new Date('2024-05-20') },
                    { amount: 70000.00, date: new Date('2024-01-25') }
                ],
            },
            {
                category: 'dibujo',
                expense: [
                    { amount: 50000.00, date: new Date('2024-01-12') },
                    { amount: 60000.00, date: new Date('2024-12-20') },
                    { amount: 70000.00, date: new Date('2024-03-25') }
                ],
            },
            {
                category: 'pintura',
                expense: [
                    { amount: 50000.00, date: new Date('2024-11-12') },
                    { amount: 60000.00, date: new Date('2024-10-20') },
                    { amount: 70000.00, date: new Date('2024-09-25') }
                ],
            }
        ];

        // Process the data
        const categories = ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic"];
        const seriesData = jsonData.map((item) => {
            const monthlyTotals = new Array(12).fill(0);

            item.expense.forEach(expense => {
                const month = new Date(expense.date).getMonth();
                monthlyTotals[month] += expense.amount;
            });

            return {
                name: item.category,
                data: monthlyTotals
            };
        });

        this.chartOptions = {
            series: seriesData,
            chart: {
                type: "bar",
                height: 350
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
            },
            xaxis: {
                categories: categories
            },
            yaxis: {
                title: {
                    text: "$ (amount)"
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return "$ " + val;
                    }
                }
            }
        };
    }
}