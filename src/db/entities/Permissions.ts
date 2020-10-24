import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Permissions extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 64,
        unique: true
    })
    snowflake: string;

    @Column({
        type: "int",
        default: 0
    })
    permLevel: number;
}