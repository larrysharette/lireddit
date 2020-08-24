import { PrimaryColumn, Column, Entity, BaseEntity } from "typeorm";

@Entity()
export class Session extends BaseEntity {
  @PrimaryColumn({ type: "varchar" })
  sid!: string;

  @Column({ type: "json" })
  sess!: string;

  @Column({ type: "timestamptz" })
  expire: Date;
}
