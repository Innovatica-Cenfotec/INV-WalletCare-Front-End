import { CommonModule } from '@angular/common';
import { Component, ViewChild } from "@angular/core";

// Importing Ng-Zorro modules
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";

// CUSTOM COMPONENT
import { ChartOptions, IBarchartData, IGoal } from '../../../../interfaces';

interface IPieData {
    category: string;
    data: {
        pending: number;
        rejected: number;
        completed: number;
        active: number;
        failed: number;
    };
}

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
export class PiechartComponent {
    /**
     * Chart context.
     */
    @ViewChild("chart")
    chart: ChartComponent | undefined;

    labelsOrder = ["Ahorro", "Reducir gastos", "Otro", "En proceso"];

    public chartOptions: Partial<ChartOptions>;

    constructor() {
        
        const jsonData = [
            {
                category: 'NONE',
                data: {
                    pending: 4,
                    rejected: 10,
                    completed: 24,
                    active: 10,
                    failed: 2
                }
            },
            {
                category: 'SAVING',
                data: {
                    pending: 20,
                    rejected: 4,
                    completed: 14,
                    active: 20,
                    failed: 2
                }
            },
            {
                category: 'EXPENSE_REDUCTION',
                data: {
                    pending: 10,
                    rejected: 20,
                    completed: 50,
                    active: 6,
                    failed: 2
                }
            }
        ];

        const labels = this.getPieLabels(jsonData);
        const series = this.getPieData(jsonData);

        this.chartOptions = {
            series: series,
            chart: {
                width: 420,
                type: "pie"
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
        switch (data) {
            case "SAVING":
                return "Ahorro";
            case "EXPENSE_REDUCTION":
                return "Reducir gastos";
            case "UNCOMPLETE":
                return "En proceso";
            default:
                return "Otro";
        }
    }

    /**
     * Get array of labels for x axis. Compare values with uppercase.
     * Sort labels if xAxisOrder is set.
     * @param data Data to fill grapt.
     * @returns List of labels in uppercase.
     */
    private getPieLabels(data: IPieData[]): string[] {
        const labelsSet = new Set<string>();

        data.forEach(item => {
            labelsSet.add(this.getGoalType(item.category.toUpperCase()))
        });

        labelsSet.add(this.getGoalType("UNCOMPLETE"));

        const labels = Array.from(labelsSet);

        if (this.labelsOrder.length != 0) {
            return labels.sort(
                // Order the labels
                (a, b) => this.labelsOrder.indexOf(a.toUpperCase()) - this.labelsOrder.indexOf(b.toUpperCase())
            );
        } else {
            return labels;
        }
    }

    private getPieData(data: IPieData[]): number[] {
        const pieAmount: number[] = [];
        let uncompleteSum = 0;

        // Initialize the data for SAVING, EXPENSE_REDUCTION, and NONE categories
        const categoryData: { [key: string]: number } = {
            "SAVING": 0,
            "EXPENSE_REDUCTION": 0,
            "NONE": 0
        };

        // Loop through each category in the jsonData
        data.forEach(item => {
            const { category, data } = item;
            if (category in categoryData) {
                categoryData[category] = data.completed;
                uncompleteSum += data.active;
            }
        });

        // Add the completed values for each category to the pieData array
        pieAmount.push(categoryData["SAVING"]);
        pieAmount.push(categoryData["EXPENSE_REDUCTION"]);
        pieAmount.push(categoryData["NONE"]);

        // Finally, add the sum of active values as "UNCOMPLETE"
        pieAmount.push(uncompleteSum);

        return pieAmount;
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
