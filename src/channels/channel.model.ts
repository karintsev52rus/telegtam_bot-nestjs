import { DataTypes, INTEGER } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "channels" })
export class Channel extends Model {
  @Column({
    type: INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataTypes.BIGINT, unique: true })
  channelId: number;

  @Column
  title: string;

  @Column
  username: string;
}
