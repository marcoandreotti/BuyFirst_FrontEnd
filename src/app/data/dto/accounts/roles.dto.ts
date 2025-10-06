export class RoleDto {
  id?: string | null;
  role: string;

  constructor() {
    this.id = this.role;

  }
}
