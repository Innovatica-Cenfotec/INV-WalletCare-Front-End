import { CommonModule } from '@angular/common';
import { Component, OnChanges, ViewChild, Input } from "@angular/core";

// Importing Ng-Zorro modules
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

// CUSTOM COMPONENT
import { ChartOptions, IBarchartData, IBarcharItem } from '../../../interfaces';

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
export class BarchartComponent implements OnChanges {
    @ViewChild("chart")
    chart!: ChartComponent;

    // Json structure expected by the chart
    @Input() data: IBarchartData[] = [];
    
    public chartOptions: Partial<ChartOptions> = {};

    ngOnChanges(): void {
        this.loadChart();
    }

    // Fill chart with data receivet
    loadChart(): void {
        const categories = this.getUniqueDates(this.data);
        const series = this.data.map(item => ({
            name: item.category,
            data: categories.map(date => {
                const expense = item.data.find(e => e.month === date);
                return expense ? expense.amount : 0;
            })
        }));

        this.chartOptions = {
            series: series,
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

    /**
     * 
     * @param data 
     * @returns 
     */
    private getUniqueDates(data: IBarchartData[]): string[] {
        const datesSet = new Set<string>();
        data.forEach(item => {
            item.data.forEach(
                exp => {
                    datesSet.add(exp.month);
                }
            );
        });
        return Array.from(datesSet);
    }
}



        // Example JSON data
        /*
        const jsonData = [
            {
                category: 'comida',
                expense: [
                    { amount: 132000.34, date: 'Ene' },
                    { amount: 120000.00, date: 'Feb' },
                    { amount: 110000.50, date: 'Mar' }
                ],
            },
            {
                category: 'transporte',
                expense: [
                    { amount: 15000.00, date: 'Dic' },
                    { amount: 102000.00, date: 'Ene' },
                    { amount: 70000.00, date: 'Feb' }
                ],
            },
            {
                category: 'dibujo',
                expense: [
                    { amount: 15000.00, date: 'Jul' },
                    { amount: 102000.00, date: 'Aug' },
                    { amount: 70000.00, date: 'Jun' }
                ],
            },
            {
                category: 'pintura',
                expense: [
                    { amount: 15000.00, date: 'Dic' },
                    { amount: 102000.00, date: 'Ene' },
                    { amount: 70000.00, date: 'Feb' }
                ],
            },
            {
                category: 'dibujo',
                expense: [
                    { amount: 15000.00, date: 'Apr' },
                    { amount: 102000.00, date: 'Mar' },
                    { amount: 70000.00, date: 'Sep' }
                ],
            },
            {
                category: 'pintura',
                expense: [
                    { amount: 15000.00, date: 'Jul' },
                    { amount: 102000.00, date: 'Aug' },
                    { amount: 70000.00, date: 'Jun' }
                ],
            }
        ];
        */

        // Process the data
        /*
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
        */