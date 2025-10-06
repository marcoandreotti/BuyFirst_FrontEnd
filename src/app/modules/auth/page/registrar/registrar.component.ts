import { Component, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogGenericoFuncoes } from '../../../../shared/component/dialog-generico/dialog-generico.funcoes';
import { AuthService } from '@app/service/auth.service';
import { SelectOption } from '@shared/component/mat-select/mat-select.component';
import { Usuario } from '@data/schema/usuarios/usuarios';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})

export class RegistrarComponent {

  modalDialog = new DialogGenericoFuncoes(this.dialog);
  titulo = "Cadastrar Usuários";
  tabs = [{ icone: "people", descricao: "Usuario" }];
  model: Usuario = new Usuario();
  editId: number = null;
  userForm: FormGroup;
  filialOptions: SelectOption[] = [{ name: 'codigo', search: true, text: true }, { name: 'nome', search: true, text: true }];
  situacao: number = 1;
  subValueChangesUsuario: Subscription;

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private el: ElementRef) {
  }

  ngOnInit(): void {

    this.model = new Usuario();


    this.route.paramMap.subscribe(params => {
      this.editId = +params.get('id');
      if (this.editId > 0) {
        this.titulo = "Editar Usuário";

      } else {
        this.model = new Usuario();

        this.createForm();
      }
    });
  }

  createForm() {

  }

  f = (key: string): AbstractControl => { return this.userForm.get(key) }


  usuarioFocus() {
    for (const key of Object.keys(this.userForm.controls)) {
      if (this.f(key).invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  firstFocus() {
    for (const key of Object.keys(this.userForm.controls)) {
      if (this.f(key).invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  ngAfterViewInit(): void {
    this.firstFocus();
  }

}
