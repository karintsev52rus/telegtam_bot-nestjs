import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({ tableName: "chats" })
export class Chat extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ unique: true, type: DataType.BIGINT })
  chatId: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, type: DataType.BIGINT })
  userId: number;

  @Column
  date: number;
}
