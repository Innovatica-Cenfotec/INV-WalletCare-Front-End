import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { IAccount, IBalance, IBalanceDTO, IIncomeExpenceType, ITransaction, ITransactionType, ITypeForm } from '../../../interfaces';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
    selector: 'app-account-cards',
    standalone: true,
    imports: [
        CommonModule,
        NzGridModule,
        NzStatisticModule,
        NzCardModule,
        NzSpaceModule,
        NzDividerModule
    ],
    templateUrl: './account-cards.component.html',
    styleUrl: './account-cards.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardsComponent implements OnChanges {
    @Input() accountsList: IAccount[] = [];
    @Input() transactions: ITransaction[] = [];
    @Input() balances: IBalanceDTO = {};
    public generalBalance = 0;
    public generalExpenses = 0;
    public generalSavings = 0;
    public recurringExpenses = 0;
    public recurringSavings = 0;

    public generalBalanceColor = '';
    public generalExpensesColor = '';
    public generalSavingsColor = '';
    public recurringExpensesColor = '';
    public recurringSavingsColor = '';



    /**
     * Responds to changes in the input properties of the component.
     * @param changes An object of type {@link SimpleChanges} that contains the current and previous values of the 
     * changed input properties
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['accountsList']) {
            this.calcGeneralBalance();


            //set cards info
            this.generalSavings = 0;
            this.recurringExpenses = 0;
            this.recurringSavings = 0;


            //set colors to cards generalSavings
            if (this.generalSavings > 0) {
                this.generalSavingsColor = IBalance.surplus;
            } else if (this.generalSavings < 0) {
                this.generalSavingsColor = IBalance.deficit;
            } else if (this.generalSavings == 0) {
                this.generalSavingsColor = IBalance.balance;
            }

            //set colors to cards recurringExpenses
            if (this.recurringExpenses > 0) {
                this.recurringExpensesColor = IBalance.surplus;
            } else if (this.recurringExpenses < 0) {
                this.recurringExpensesColor = IBalance.deficit;
            } else if (this.recurringExpenses == 0) {
                this.recurringExpensesColor = IBalance.balance;
            }

            //set colors to cards recurringSavings
            if (this.recurringSavings > 0) {
                this.recurringSavingsColor = IBalance.surplus;
            } else if (this.recurringSavings < 0) {
                this.recurringSavingsColor = IBalance.deficit;
            } else if (this.recurringSavings == 0) {
                this.recurringSavingsColor = IBalance.balance;
            }
        } else if (changes['transactions']) {
            this.calcExpenses();
        } else if (changes['balances']) {

        }
    }

    calcGeneralBalance() {
        //general balance calc
        let balance = 0;
        this.accountsList.forEach(element => {
            if (element.balance !== undefined)
                balance = balance + element.balance;
        });

        //set cards info
        this.generalBalance = balance;

        //set colors to cards generalBalance
        if (this.generalBalance > 0) {
            this.generalBalanceColor = IBalance.surplus;
        } else if (this.generalBalance < 0) {
            this.generalBalanceColor = IBalance.deficit;
        } else if (this.generalBalance == 0) {
            this.generalBalanceColor = IBalance.balance;
        }
    }

    calcExpenses() {
        let generalExpense = 0;
        let recurringExpense = 0
        this.transactions.forEach(element => {
            if (element.type !== undefined && element.amount !== undefined) {
                if (element.type.valueOf() == 'EXPENSE') {
                    generalExpense = generalExpense + element.amount;
                    if (element.expense?.type === IIncomeExpenceType.recurrence) {
                        recurringExpense = recurringExpense + element.amount
                    }
                }
            }
        })
        this.generalExpenses = generalExpense;

        //set colors to cards generalExpenses
        if (this.generalExpenses > 0) {
            this.generalExpensesColor = IBalance.surplus;
        } else if (this.generalExpenses < 0) {
            this.generalExpensesColor = IBalance.deficit;
        } else if (this.generalExpenses == 0) {
            this.generalExpensesColor = IBalance.balance;
        }

    }

    calcRecurringExpenses(){
        
    }
}

