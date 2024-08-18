import { CommonModule } from '@angular/common';
import { Component, OnChanges, ViewChild, Input } from "@angular/core";

// Importing Ng-Zorro modules
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

// CUSTOM COMPONENT
import { ChartOptions, IBarchartData } from '../../../interfaces';

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
/**
 * Reusable component for bar grapts. Receive a yAxisLabel, xAxisLabel and amount.
 */
export class BarchartComponent implements OnChanges {
    /**
     * Chart context.
     */
    @ViewChild("chart")
    chart!: ChartComponent;

    /**
     * Json structure expected by the chart.
     */
    @Input() data: IBarchartData[] = [];

    /**
     * Variable with the expected order for the x axis labels.
     */
    @Input() xAxisOrder: string[] = [];

    /**
     * Config of the chart data (ex: labels y axis, labels x axis, ₡ amounts).
     */
    public chartOptions: Partial<ChartOptions> = {};

    /**
     * Load chart when data is change.
     */
    ngOnChanges(): void {
        this.loadChart();
    }

    /**
     * Load the chart data.
     */
    loadChart(): void {
        const xAxisLabels = this.getXAxisLabels(this.data);
        const series = this.data.map(item => ({
            name: item.category.toUpperCase(),
            data: xAxisLabels.map(date => {
                const expense = item.data.find(e => e.month.toUpperCase() === date);
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
            xaxis: {
                categories: xAxisLabels
            },
            yaxis: {
                labels: {
                    formatter: (val) => {
                        return val / 1000 + "K";
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return "₡ " + val;
                    }
                }
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
            }
        };
    }

    /**
     * Get array of labels for x axis. Compare values with uppercase.
     * Sort labels if xAxisOrder is set.
     * @param data Data to fill grapt.
     * @returns List of labels in uppercase.
     */
    private getXAxisLabels(data: IBarchartData[]): string[] {
        const datesSet = new Set<string>();

        data.forEach(item => {
            item.data.forEach(
                // This will set how the label is view in grapt
                exp => datesSet.add(exp.month.toUpperCase())
            );
        });

        const axisLabels = Array.from(datesSet);

        if (this.xAxisOrder.length != 0) {
            return axisLabels.sort(
                // Order the xAxis labels
                (a, b) => this.xAxisOrder.indexOf(a.toLowerCase()) - this.xAxisOrder.indexOf(b.toLowerCase())
            );
        } else {
            return axisLabels;
        }
    }
}