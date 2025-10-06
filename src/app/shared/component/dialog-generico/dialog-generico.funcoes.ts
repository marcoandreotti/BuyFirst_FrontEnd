import { MatDialog } from '@Angular/material/dialog';
import { DialogGenericoComponent } from '@shared/component/dialog-generico/dialog-generico.component';

export class DialogGenericoFuncoes {
    constructor(public dialog: MatDialog) { }

    apresentaAviso(titulo: string, texto: string, possuiBotaoCancelar?: boolean, possuiBotaoContinuar?: boolean, botaoCancelarCallback?: any, botaoContinuarCallback?: any, botaoCancelarTexto?: string, botaoContinuarTexto?: string) {
        const dialogRef = this.geraDialogGenerico(titulo, texto, '', possuiBotaoCancelar, possuiBotaoContinuar, botaoCancelarCallback, botaoContinuarCallback, botaoCancelarTexto, botaoContinuarTexto);
        dialogRef.componentInstance.tipo = "A";
        return dialogRef;
    }

    apresentaAvisoObs(titulo: string, texto: string, obsTexto: string = '', possuiBotaoCancelar?: boolean, possuiBotaoContinuar?: boolean, botaoCancelarCallback?: any, botaoContinuarCallback?: any, botaoCancelarTexto?: string, botaoContinuarTexto?: string) {
        const dialogRef = this.geraDialogGenerico(titulo, texto, obsTexto, possuiBotaoCancelar, possuiBotaoContinuar, botaoCancelarCallback, botaoContinuarCallback, botaoCancelarTexto, botaoContinuarTexto);
        dialogRef.componentInstance.tipo = "A";
        return dialogRef;
    }

    apresentaSucesso(titulo: string, texto: string, possuiBotaoCancelar?: boolean, possuiBotaoContinuar?: boolean, botaoCancelarCallback?: any, botaoContinuarCallback?: any, botaoCancelarTexto?: string, botaoContinuarTexto?: string) {
        const dialogRef = this.geraDialogGenerico(titulo, texto, '', possuiBotaoCancelar, possuiBotaoContinuar, botaoCancelarCallback, botaoContinuarCallback, botaoCancelarTexto, botaoContinuarTexto);
        dialogRef.componentInstance.tipo = "S";
        return dialogRef;
    }

    apresentaErro(titulo: string, texto: string, possuiBotaoCancelar?: boolean, possuiBotaoContinuar?: boolean, botaoCancelarCallback?: any, botaoContinuarCallback?: any, botaoCancelarTexto?: string, botaoContinuarTexto?: string) {
        const dialogRef = this.geraDialogGenerico(titulo, texto, '', possuiBotaoCancelar, possuiBotaoContinuar, botaoCancelarCallback, botaoContinuarCallback, botaoCancelarTexto, botaoContinuarTexto);
        dialogRef.componentInstance.tipo = "E";
        return dialogRef;
    }

    apresentaInfo(titulo: string, texto: string, possuiBotaoCancelar?: boolean, possuiBotaoContinuar?: boolean, botaoCancelarCallback?: any, botaoContinuarCallback?: any, botaoCancelarTexto?: string, botaoContinuarTexto?: string) {
        const dialogRef = this.geraDialogGenerico(titulo, texto, '', possuiBotaoCancelar, possuiBotaoContinuar, botaoCancelarCallback, botaoContinuarCallback, botaoCancelarTexto, botaoContinuarTexto);
        dialogRef.componentInstance.tipo = "I";
        return dialogRef;
    }

    apresentaGenerico(titulo: string, texto: string, possuiBotaoCancelar?: boolean, possuiBotaoContinuar?: boolean, botaoCancelarCallback?: any, botaoContinuarCallback?: any, botaoCancelarTexto?: string, botaoContinuarTexto?: string) {
        const dialogRef = this.geraDialogGenerico(titulo, texto, '', possuiBotaoCancelar, possuiBotaoContinuar, botaoCancelarCallback, botaoContinuarCallback, botaoCancelarTexto, botaoContinuarTexto);
        return dialogRef;
    }

    geraDialogGenerico(titulo: string, texto: string, obsTexto: string = '', possuiBotaoCancelar: boolean = false, possuiBotaoContinuar: boolean = true, 
        botaoCancelarCallback: any, botaoContinuarCallback: any, botaoCancelarTexto: string, botaoContinuarTexto: string) {

        const dialogRef = this.dialog.open(DialogGenericoComponent,
            { panelClass: 'custom-dialog-container',  disableClose: true  });
        dialogRef.componentInstance.titulo = titulo;
        dialogRef.componentInstance.texto = texto;
        dialogRef.componentInstance.obsTexto = obsTexto;
        dialogRef.componentInstance.possuiBotaoCancelar = possuiBotaoCancelar;
        dialogRef.componentInstance.possuiBotaoContinuar = possuiBotaoContinuar;
        if (botaoCancelarTexto) dialogRef.componentInstance.botaoCancelarTexto = botaoCancelarTexto;
        if (botaoContinuarTexto) dialogRef.componentInstance.botaoContinuarTexto = botaoContinuarTexto;
        if (botaoCancelarCallback) dialogRef.componentInstance.botaoCancelarCallback = botaoCancelarCallback;
        if (botaoContinuarCallback) dialogRef.componentInstance.botaoContinuarCallback = botaoContinuarCallback;
        dialogRef.componentInstance.modal = dialogRef;

        return dialogRef;
    }
    
}