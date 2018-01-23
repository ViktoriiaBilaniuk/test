import { Http, Response } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from './../../environments/environment';
import { USER } from './../models/user';
import { AuthService } from './auth.service';
import { FinancialProps } from '../models/finances';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class FinancesService {

    constructor(private http: Http, private auth: AuthService) { }

    downloadCSV(formData: FormData) {
      return this.http.post(`${API_ENDPOINT}/financial-reports/generate-csv`, formData, this.auth.generateHttpHeaders());
    }

    uploadCSV(formData: FormData) {
        return this.http.post(`${API_ENDPOINT}/financial-reports`, formData, this.auth.generateHttpHeaders())
            .map((data: Response) => data.json());
    }

    sendEmail(userFinance: FinancialProps) {
        return this.http.post(`${API_ENDPOINT}/financial-reports/send-report`, userFinance, this.auth.generateHttpHeaders())
            .map((data: Response) => data.json());
    }

    sendEmailToAll(userFinance: FinancialProps) {
        return this.http.post(`${API_ENDPOINT}/financial-reports/send-reports-to-all`, userFinance, this.auth.generateHttpHeaders())
            .map((data: Response) => data.json());
    }

    getConstants() {
        return this.http.get(`${API_ENDPOINT}/companies/my-company`, this.auth.generateHttpHeaders())
            .map((data: Response) => data.json());
    }

    updateConstants(financialProps: FinancialProps) {
        return this.http.patch(`${API_ENDPOINT}/companies/my-company`, { financialProps }, this.auth.generateHttpHeaders())
            .map((data: Response) => data.json());
    }


}
