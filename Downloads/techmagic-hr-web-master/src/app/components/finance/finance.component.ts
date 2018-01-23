import { Component } from '@angular/core';
import { FinancesService, SpinnerService } from '../../services';
import { FinancialProps } from '../../models/finances';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'hr-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['finance.styles.sass']
})

export class FinanceComponent {
    public tableData: any;
    public dataEmpty: boolean;
    public errorMessage: string;
    public exchangeRate: string;
    public fileName: string;
    public additionalfileName: string;
    public isMainFileUploaded: boolean;
    public modalShow: boolean;
    public additionalModalShow: boolean;
    private formData: FormData;
    public onlyUsd = false;

    constructor(
        private financeService: FinancesService,
        private spinnerService: SpinnerService,
        private messageService: MessageService) {

    }

    modalClose() {
        this.modalShow = false;
    }

    additionalModalClose() {
        this.additionalModalShow = false;
    }

    upload(event) {
        this.spinnerService.showSpinner();
        this.formData.set('exchange-rate', String(this.exchangeRate));
        this.formData.set('only-usd', String(this.onlyUsd));

        this.financeService.uploadCSV(this.formData).subscribe(
            data => {
                this.tableData = data;
                this.dataEmpty = !this.tableData.length;
                this.spinnerService.hideSpinner();
            },
            error => {
                console.log('error: ', error);
                this.messageService.openModal({customMessage: JSON.parse(error['_body']).message, customType: 'danger'});
                this.spinnerService.hideSpinner();
            }
        );
    }

    download() {
      this.spinnerService.showSpinner();
      console.log(this.formData);
      this.financeService.downloadCSV(this.formData).subscribe(data => {
        const blob = new Blob([data['_body']], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        // window.open(url);
        this.spinnerService.hideSpinner();
        window.location.assign(url);
      });
    }

    sendEmailToAll() {
        this.spinnerService.showSpinner();
        this.financeService.sendEmailToAll(this.tableData).subscribe(data => {
            console.log('data: ', data);
            this.spinnerService.hideSpinner();
        }, error => {
            console.log('error: ', error);
        });
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        let csv = 'text/csv';
        let csvWindows = 'application/vnd.ms-excel';
        this.fileName = event.target.files[0].name;

        if (fileList.length > 0 && (fileList[0].type === csv || fileList[0].type === csvWindows)) {
            this.errorMessage = '';
            let file: File = fileList[0];
            this.formData = new FormData();

            this.formData.set('foo', file);
            this.isMainFileUploaded = true;
        } else {
            this.errorMessage = 'File upload error';
        }
    }

    additionalFileChanges(event) {
      let fileList: FileList = event.target.files;
      let csv = 'text/csv';
      let csvWindows = 'application/vnd.ms-excel';
      this.additionalfileName = event.target.files[0].name;

      if (fileList.length > 0 && (fileList[0].type === csv || fileList[0].type === csvWindows)) {
        this.errorMessage = '';
        let file: File = fileList[0];

        this.formData.set('additional', file);
      } else {
        this.messageService.openModal({paramsString: 'finance_danger_0'});
        this.errorMessage = 'File upload error';
      }
    }

    sendEmail(userProp: FinancialProps) {
        this.spinnerService.showSpinner();
        this.financeService.sendEmail(userProp).subscribe(data => {
            console.log('data: ', data);
            this.spinnerService.hideSpinner();
        }, error => {
            console.log('error: ', error);
        });
    }

}
