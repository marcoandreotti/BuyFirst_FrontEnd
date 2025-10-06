export class SpecialConditionDto {
  id: number | 0;
  restrictType: string;
  restrict: string;
  percentageOnPrice: number;
  startDate: Date;
  expirationDate?: Date | null;
}
