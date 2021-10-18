import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Birthday extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 64,
        unique: true
    })
    snowflake: string;

    @Column({
        type: "date"
    })
    birthday: Date;

    setSnowflake(snowflake: string) {
        this.snowflake = snowflake;
        return this;
    }

    setBirthday(date: Date) {
        this.birthday = date;
        return this;
    }
}
