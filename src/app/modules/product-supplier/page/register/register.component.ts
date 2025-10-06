import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/service/auth.service';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { UnitOfMeasureService } from '@app/service/https/unit-of-measure.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { BrandService } from '@app/service/https/brand.service';
import { ProductSupplierService } from '@app/service/https/product-supplier.service';
import { ProductSupplier } from '@data/schema/products/products-supplier/product-supplier';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { CompanyService } from '@app/service/https/company.service';
import { Login } from '@data/schema/login/login';
import { BrandModalComponent } from './component/brand-modal/brand-modal.component';
import { Brand } from '@data/schema/products/brand/brand';
import { Observable } from 'rxjs';
import { ProductSupplierFile } from '@data/schema/products/products-supplier/product-supplier-file';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-product-supplier-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class ProductSupplierRegisterComponent implements OnInit {
	auth: Login;
	modalDialog = new DialogGenericoFuncoes(this.dialog);
	dialogSuccessIsOpen: boolean = false;
	model: ProductSupplier = new ProductSupplier();
	file: File;
	imageFiles: ProductSupplierFile[] = [];

	isLoading: boolean = false;

	editId: number = null;
	productForm: FormGroup;
	form: FormRow[] = [];
	brands: Observable<Brand[]> | [];

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private _auth: AuthService,
		private themeService: ThemeService,
		private _productSupplier: ProductSupplierService,
		private _brandService: BrandService,
		private _unidades: UnitOfMeasureService,
		private _companyService: CompanyService
	) {
		this.auth = this._auth.getState();
	}

	ngOnInit(): void {
		this.themeService.setBackRoute('produtosfornecedor');
		this.GetBrands();

		this.route.paramMap.subscribe((params) => {
			this.editId = +params.get('id');
			if (this.editId > 0) {
				this.themeService.setTitle('Editando Produto');
				this._productSupplier.get(this.editId).subscribe((produto) => {
					this.model = produto.data;
					if (produto.data.files && produto.data.files.length > 0) {
						this.imageFiles = produto.data.files;
					}
					this.createForm();
				});
			} else {
				if (!this.auth.isBuyFirst) {
					this.model.companyId = this.auth.companiesSelected[0].companyId;
				}
				this.themeService.setTitle('Novo Produto');
				this.createForm();
			}
		});
	}

	createForm() {
		this.form = [
			{
				fields: [
					{
						name: 'companyId',
						label: 'Empresa',
						placeholder: 'Empresa',
						size: 100,
						value: 'companyId',
						select: true,
						selectName: 'name',
						useSearch: true,
						required: false,
						useRemove:
							(this.auth.isBuyFirst && this.editId == 0) ||
							(!this.auth.isBuyFirst && this.auth.companiesSelected.length > 1),
						disabled:
							this.editId > 0 ||
							(!this.auth.isBuyFirst &&
								this.auth.companiesSelected.length == 1),
						list: this._companyService.getListCompany(true),
						options: [{ name: 'name', search: true, text: true }],
						onChange: (value: CompanyDto) => { },
					},
				],
				marginTop: '10px',
			},
			{
				fields: [
					{
						name: 'referenceCode',
						label: '* Código de Referência',
						placeholder: '* Código de Referência',
						size: 33,
						value: 'referenceCode',
						required: true,
						maxLength: 50,
					},
					{
						name: 'externalCode',
						label: 'Seu código de ERP',
						placeholder: 'Seu código de ERP',
						size: 33,
						value: 'externalCode',
						required: false,
						maxLength: 50,
					},
				],
				marginTop: '10px',
			},
			{
				fields: [
					{
						name: 'name',
						label: '* Descrição',
						placeholder: '* Descrição',
						size: 100,
						value: 'name',
						required: true,
						maxLength: 180,
					},
				],
				marginTop: '10px',
			},
			{
				fields: [
					{
						name: 'description',
						label: 'Aplicação do Produto',
						placeholder: 'Aplicação do Produto',
						size: 100,
						value: 'description',
						textArea: true,
						textAreaRows: 4,
						required: false,
						maxLength: 500,
					},
				],
				marginTop: '10px',
			},
			{
				fields: [
					{
						name: 'brandId',
						label: '* Marca',
						placeholder: '* Marca',
						size: 50,
						value: 'brandId',
						select: true,
						required: true,
						selectName: 'name',
						useSearch: true,
						list: this.brands,
						options: [{ name: 'name', search: true, text: true }],
						useAddEntity: this.auth.isBuyFirst,
						onAddEntity: (event$: string) => {
							this.showModalBrand();
						},
					},
					{
						name: 'unitOfMeasureId',
						label: '* Unidade de Medida',
						placeholder: '* Unidade de Medida',
						size: 25,
						value: 'unitOfMeasureId',
						select: true,
						required: true,
						selectName: 'name',
						useSearch: true,
						list: this._unidades.getAll(),
						options: [
							{ name: 'acronym', search: true, text: true },
							{ name: 'name', search: true, text: true },
						],
					},
					{
						name: 'barcode',
						label: 'Código de Barras',
						placeholder: 'Código de Barras',
						size: 25,
						value: 'barcode',
						required: false,
						maxLength: 50,
					},
				],
				marginTop: '10px',
			},
			{
				fields: [
					{
						name: 'height',
						label: 'Atura do produto (cm)',
						placeholder: 'Atura do produto em centímetros',
						size: 25,
						value: 'height',
						required: false,
						number: true,
						numberType: 'decimal',
					},
					{
						name: 'width',
						label: 'Largura do produto (cm)',
						placeholder: 'Largura do produto em centímetros',
						size: 25,
						value: 'width',
						required: false,
						number: true,
						numberType: 'decimal',
					},
					{
						name: 'length',
						label: 'Comprimento do produto (cm)',
						placeholder: 'Comprimento do produto em centímetros',
						size: 25,
						value: 'length',
						required: false,
						number: true,
						numberType: 'decimal',
					},
					{
						name: 'weight',
						label: 'Peso do produto (kg)',
						placeholder: 'Peso do produto em quilogramas',
						size: 25,
						value: 'weight',
						required: false,
						number: true,
						numberType: 'decimal',
					},
				],
				marginTop: '50px',
			},
		];
	}

	save() {
		this.isLoading = true;
		if (!this.productForm.valid) {
			this.productForm.markAsPending();
			this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
		} else {
			if (!this.editId) {
				let model: ProductSupplier = Object.assign(
					new ProductSupplier(),
					this.productForm.getRawValue()
				);

				model.files = this.imageFiles;
				this._productSupplier.add(model).subscribe((result) => {
					if (result.succeeded) {
						this.sendImages(result.data);
					}
				});
			} else {
				let model: ProductSupplier = Object.assign(
					this.model,
					this.productForm.getRawValue()
				);

				this.model.productSupplierId = this.editId;
				this._productSupplier.save(model).subscribe((result) => {
					if (result.succeeded) {
						this.sendRemoveImages();
						this.sendImages(result.data);
					}
				});
			}
		}
	}

	sendImages(productSupplierId: number) {
		if (this.imageFiles && this.imageFiles.length > 0) {

			this.imageFiles.forEach(async (element): Promise<void> => {

				if (element.productSupplierId <= 0) {
					let formData: FormData = new FormData();
					formData.append('ProductSupplierId', productSupplierId.toString());
					formData.append('FormFile', element.uploadFile, element.name);

					await this._productSupplier
						.uploadFiles(formData)
						.pipe(
							finalize(() => {
								this.sendRemoveImages();
							})
						)
						.subscribe((event) => { },
							(error) => {
								console.log(error.message);
								this.isLoading = false;
							}
						);
				}
			});
		} else {
			this.sendRemoveImages();
		}
	}

	async sendRemoveImages() {
		this.imageFiles.filter(e => e.deleted).forEach(async (e): Promise<void> => {
			let sub = this._productSupplier.removeFiles(e.productSupplierFileId).subscribe((res) => {
				sub.unsubscribe();
			});
		});
		this.messagemSucesso();
	}

	myForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(3)]),
		file: new FormControl('', [Validators.required]),
		fileSource: new FormControl('', [Validators.required]),
	});

	onFileChange(event) {
		const reader = new FileReader();

		if (event.target.files && event.target.files.length) {
			const [file] = event.target.files;
			reader.readAsDataURL(file);

			reader.onload = () => {
				let uriFile = reader.result as string;

				this.myForm.patchValue({
					fileSource: reader.result,
				});

				const seq: number = !this.imageFiles ? 1 : this.imageFiles.length + 1;
				const fileInput = event.target.files[0];
				this.imageFiles.push({
					productSupplierFileId: 0,
					defaut: seq == 1,
					type: 2, //image
					productSupplierId: 0,
					name: fileInput.name,
					sequence: seq,
					key: '123',
					uri: uriFile,
					uploadFile: fileInput,
					deleted: false
				});

				this.fileChangeEventHeader(fileInput, uriFile);
			};
		}
	}

	onRemoveImage(image: ProductSupplierFile) {
		let imgs = this.imageFiles;

		imgs.forEach((element, index) => {
			if (element.productSupplierFileId > 0 && element == image) element.deleted = true;
			if (element.productSupplierFileId <= 0 && element == image) delete imgs[index];
		});

		if (image.productSupplierFileId > 0) {
			this.imageFiles = imgs;
		} else {
			this.imageFiles = [];
			imgs.forEach((img) => {
				this.imageFiles.push(img);
			});
		}
	}

	fileChangeEventHeader(fileInput, uriFile) {
		const oFReader = new FileReader();
		oFReader.readAsDataURL(fileInput);
		oFReader.onload = (event: any) => {
			var image = new Image();
			image.src = uriFile;
			image.onload = function () {
				console.log(`width : ${image.width} px`, `height: ${image.height} px`);
				console.log(`size : ${fileInput.size}`);
			};
		};
	}

	GetBrands() {
		this.brands = this._brandService.getSelecteddAll();
	}

	showModalBrand(): void {
		const dialogRef = this.dialog.open(BrandModalComponent, {});

		dialogRef.afterClosed().subscribe((result: boolean | any) => {
			if (result > 0) {
				this.model = Object.assign(
					new ProductSupplier(),
					this.productForm.getRawValue()
				);
				this.model.brandId = result;
				this.createForm();
			}
		});
	}

	messagemSucesso() {
		if (!this.dialogSuccessIsOpen) {
			this.dialogSuccessIsOpen = true;
			this.modalDialog.apresentaSucesso(
				'Sucesso',
				'Produto ' + (this.editId ? 'alterado' : 'cadastrado') + ' com sucesso!',
				false,
				true,
				null,
				() => {
					this.modalDialog.dialog.closeAll();
					this.dialogSuccessIsOpen = false;
					// this.router.navigateByUrl('produtosfornecedor');
					this.isLoading = false;
				},
				null,
				'CONTINUAR'
			);
		}
	}
}
