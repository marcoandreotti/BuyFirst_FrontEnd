
import { Store } from "@ngrx/store";
import { DialogGenericoFuncoes } from "@shared/component/dialog-generico/dialog-generico.funcoes";
import { Subscription, throwError } from "rxjs";

export class Utils {
    static refazObjetoReadOnly(objeto: any): any {
        return JSON.parse(JSON.stringify(objeto));
    }
    static getStringDateHour(d: Date) {
        if (d == null) return '';
        let date = new Date(d);
        if (!date) return '';
        try {
            return `${this.getStringDate(date)} ${this.getStringTime(date)}`
        } catch (ec) {
            return '';
        }
    }
    static getStringDate(d: Date) {
        if (d == null) return '';
        let date = new Date(d);
        if (!date) return '';
        try {
            let day = date.getDate();
            let month = ["JAN", "FEV", "MAR", "ABR", "MAI",
                "JUN", "JUL", "AGO", "SET", "OUT",
                "NOV", "DEZ"][date.getMonth()];
            let year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (ec) {
            return '';
        }
    }
    static getStringTime(d: Date) {
        if (d == null) return '';
        let date = new Date(d);
        if (!date) return '';
        try {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            return `${(hours < 10 ? '0' : '') + hours}:` + (minutes < 10 ? '0' : '') + minutes;
        } catch (ec) {
            return '';
        }
    }
    static unsubscribe(sub: Subscription) {
        try { sub?.unsubscribe(); } catch { (e) => { } };
    }

    static formatarCodigoDigitos(codigo: string, qtdeDigitos: number = 9) {
        for (let i = codigo.length; i < qtdeDigitos; i++) {
            codigo = `0${codigo}`;
        }

        return codigo;
    }
}
