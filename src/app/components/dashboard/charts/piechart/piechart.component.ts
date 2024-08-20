import { CommonModule } from '@angular/common';
import { Component, ViewChild, Input, OnChanges, SimpleChanges } from "@angular/core";

// Importing Ng-Zorro modules
import { ChartComponent, NgApexchartsModule, ChartType } from "ng-apexcharts";

// CUSTOM COMPONENT
import { ChartOptions, IPiechartData } from '../../../../interfaces';

@Component({
    selector: 'app-piechart',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './piechart.component.html',
    styleUrl: './piechart.component.scss'
})
/**
 * Reusable component for pie grapts. Receive a ChartType ('pie', 'donut').
 */
export class PiechartComponent implements OnChanges {
    /**
     * Chart context.
     */
    @ViewChild("chart")
    chart: ChartComponent | undefined;

    /**
     * Json structure expected by the chart.
     */
    @Input() data: IPiechartData[] = [
        {
            category: 'COMPLETED',
            data: 23
        },
        {
            category: 'ACTIVE',
            data: 40
        },
        {
            category: 'FAILED',
            data: 2
        }
    ];;

    /**
     * Variable with the expected order for the labels.
     */
    @Input() labelsOrder: string[] = [];

    /**
     * Json structure expected by the chart.
     */
    @Input() type: ChartType = "pie";

    /**
     * Config of the chart data (ex: labels and amounts).
     */
    public chartOptions: Partial<ChartOptions> = {};

    /**
     * Load chart when data is change.
     */
    ngOnChanges(changes: SimpleChanges): void {
        this.loadData();
        if (changes['data']) {
            this.loadData();
        }
    }

    /**
     * Load the chart data.
     */
    loadData(): void{
        const labels = this.getPieLabels(this.data);
        const series = labels.map(label => {
            const item = this.data.find(item => this.toCapitalCase(this.getGoalType(item.category)) === label);
            return item ? item.data : 0;
        });

        this.chartOptions = {
            series: series,
            chart: {
                width: 380,
                type: this.type
            },
            labels: labels,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }

    getGoalType(data: string): string {
        switch (data.toUpperCase()) {
            case "GOAL_PENDING":
                return "recomendados";
            case "GOAL_REJECTED":
                return "denegados";
            case "ACTIVE":
                return "en proceso";
            case "COMPLETED":
                return "completados";
            case "FAILED":
                return "fallados";
            default:
                return "sin estado";
        }
    }

    /**
     * Get array of labels. Compare values with uppercase.
     * Filter and sort labels if labelsOrder is set.
     * @param data Data to fill grapt.
     * @returns List of labels capitalized.
     */
    private getPieLabels(data: IPiechartData[]): string[] {
        const labelsSet = new Set<string>();
        
        if (this.labelsOrder.length > 0) {
            data.forEach(item => {
                const label = this.getGoalType(item.category);
                if (this.labelsOrder.includes(this.toCapitalCase(label))) {
                    labelsSet.add(this.toCapitalCase(label));
                }
            });
            
            return Array.from(labelsSet).sort(
                (a, b) => this.labelsOrder.indexOf(a) - this.labelsOrder.indexOf(b)
            );
        } else {
            data.forEach(item => {
                const label = this.getGoalType(item.category);
                labelsSet.add(this.toCapitalCase(label));
            });

            return Array.from(labelsSet);
        }
    }

    /**
     * Capitalize a string.
     * @param msj message to capitalize.
     * @returns capitalized messaje.
     */
    private toCapitalCase(msj: string) {
        return msj ? msj.charAt(0).toUpperCase() + msj.substr(1).toLowerCase() : '';
    }
}
