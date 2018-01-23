import { Component, OnInit } from '@angular/core';
import { FinancesService, SpinnerService } from '../../services';
import { FinancialProps, IterableFinanceProps } from '../../models';
import { translates } from './finance-constants-translates';

@Component({
    selector: 'hr-constant-page',
    templateUrl: './finance-constants.component.html'
})

export class ConstantPageComponent implements OnInit {
    public financeConstants: IterableFinanceProps[];
    public model: FinancialProps;
    public financeConstantsKeys: string[];

    constructor(
        private financesService: FinancesService,
        private spinnerService: SpinnerService) { }

    ngOnInit() {
        this.spinnerService.showSpinner();
        this.financesService.getConstants().subscribe(
            data => {
                this.financeConstantsKeys = Object.keys(data.financialProps);
                this.financeConstants = data.financialProps;
                this.model = data.financialProps;
                this.spinnerService.hideSpinner();
            }, error => {
                console.log('error: ', error);
            });
    }

    updateConstants(e: Event) {
        e.preventDefault();
        this.spinnerService.showSpinner();
        this.financesService.updateConstants(this.model).subscribe(
            data => {
                console.log('data: ', data);
                this.spinnerService.hideSpinner();
            }, err => {
                console.log('err: ', err);
            });
    }

    convertToText(key: string): string {
      return translates[key] || key;
    }

}

