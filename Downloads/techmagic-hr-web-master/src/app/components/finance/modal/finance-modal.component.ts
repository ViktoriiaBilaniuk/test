import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { FinancialProps } from '../../../models/finances';

@Component({
    selector: 'hr-finance-modal',
    templateUrl: './finance-modal.component.html',
    styleUrls: ['./finance-modal.component.sass']
})

export class FinanceModalComponent implements OnChanges {
    public arrayOfKeys;
    @Input() info: FinancialProps;
    @Input() show: boolean;
    @Output() closed =  new EventEmitter();

    ngOnChanges(obj) {
        this.handleData();
    }

    close() {
        this.closed.emit();
        this.show = false;
    }

    private handleData() {
        if (this.info) {
            this.arrayOfKeys = Object.keys(this.info)
                                      .filter(el => el !== 'additionalCalculations');
        }
    }
}
