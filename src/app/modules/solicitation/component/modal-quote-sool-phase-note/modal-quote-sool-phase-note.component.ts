import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuoteSolOrderDto } from '@data/dto/quote/quote-sol/quote-sol-order/quote-sol-order.dto';
import { QuoteSolicitationService } from '@app/service/https/quote-solicitation.service';
import { FormRow } from '@shared/component/form/form';
import { NoteDto } from '@data/dto/note.dto';

@Component({
    selector: 'app-modal-quote-sool-phase-note',
    templateUrl: './modal-quote-sool-phase-note.component.html',
    styleUrls: ['./modal-quote-sool-phase-note.component.scss'],
})
export class ModalQuoteSolPhaseComponent implements OnInit {
    modelNote: NoteDto = new NoteDto();
    noteForm: FormGroup;
    formNote: FormRow[] = [];

    constructor(
        public fb: FormBuilder,
        public httpClient: HttpClient,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ModalQuoteSolPhaseComponent>,
        private _service: QuoteSolicitationService,
        @Inject(MAT_DIALOG_DATA) public data: number
    ) { }

    ngOnInit() {
        this.createForm();
    }

    cancel(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        this.modelNote = Object.assign(
            new NoteDto(),
            this.noteForm.getRawValue()
        );
        this.dialogRef.close(this.modelNote.text);
    }

    createForm() {
        this.formNote = [
            {
                fields: [
                    {
                        name: 'text',
                        label: 'Motivo *',
                        placeholder: 'Motivo *',
                        size: 255,
                        textArea: true,
                        textAreaRows: 4,
                        value: 'text',
                        required: false,
                    },
                ],
                marginTop: '10px',
            }
        ];
    }

}