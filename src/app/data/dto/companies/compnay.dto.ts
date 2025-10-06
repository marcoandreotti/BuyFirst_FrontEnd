import { PersonDto } from "../persons/person.dto";

export class CompanyDto {
   companyId: number;
   name: string;
   CompanyType: number | any;

   //Aux
   quantityRegisterNoMatch: number | 0;

   person: PersonDto;
}