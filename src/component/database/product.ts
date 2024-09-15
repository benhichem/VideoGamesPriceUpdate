import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;


  @Column()
  product_name!: string

  @Column()
  product_rating!: string

  @Column()
  product_current_price!: string

  @Column({
    nullable: true
  })
  product_old_price!: string 

  @Column({
    unique: true
  })
  product_url!: string

  @Column({})
  updated_at!: number
}
