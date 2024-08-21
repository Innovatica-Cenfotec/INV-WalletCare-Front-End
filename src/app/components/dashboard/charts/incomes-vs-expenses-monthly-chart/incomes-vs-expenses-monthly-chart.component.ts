import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTitleSubtitle,
    ApexStroke,
    ApexGrid,
    NgApexchartsModule
} from "ng-apexcharts";
import { ChartOptions, IBalance } from '../../../../interfaces';

@Component({
    selector: 'app-incomes-vs-expenses-monthly-chart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './incomes-vs-expenses-monthly-chart.component.html',
    styleUrl: './incomes-vs-expenses-monthly-chart.component.scss'
})
export class IncomesVsExpensesMonthlyChartComponent implements OnChanges {

    @ViewChild("chart") chart: ChartComponent | undefined;
    @Input() IncomesData: number[] = [];
    @Input() ExpensesData: number[] = [];
    @Input() DaysOfTheMonth: number[] = [];
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        this.chartOptions = {
            series: [],
            chart: {
                height: 350,
                type: "line",
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: true
            },
            stroke: {
                curve: "straight"
            },
            title: {
                text: "",
                align: "left"
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                }
            },
            xaxis: {
                categories: [
                ]
            }
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['IncomesData'] || changes['ExpensesData'] || changes['DaysOfTheMonth']) {

            let DaysOfTheMonthIntegers: number[] = [];
            for (let  i = 0;  i < this.DaysOfTheMonth.length;  i++) {
                DaysOfTheMonthIntegers[i] = Math.floor(this.DaysOfTheMonth[i]);
            }

            this.chartOptions.xaxis!.categories = DaysOfTheMonthIntegers;
            this.chartOptions.series = [
                {
                    name: "Ingresos",
                    data: this.IncomesData,
                    color: IBalance.surplus
                },
                {
                    name: "Gastos",
                    data: this.ExpensesData,
                    color: IBalance.deficit
                }
            ]
        }
    }

}
