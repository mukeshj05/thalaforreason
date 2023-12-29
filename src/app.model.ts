import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'inputs',
})
export class Input extends Model {
  @Column
  input: string;

  @Column
  status: boolean;

  @Column
  message: string;
}
