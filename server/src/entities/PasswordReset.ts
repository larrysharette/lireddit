import { PrimaryColumn, Column, Entity, BaseEntity } from "typeorm";

@Entity()
export class PasswordReset extends BaseEntity {
  @PrimaryColumn({ type: "uuid" })
  token!: string;

  @Column({ type: "bigint" })
  userId!: number;
}
