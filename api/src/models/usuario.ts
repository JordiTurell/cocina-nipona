import { UUID } from "node:crypto";
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: 'usuarios',
    timestamps: true
})
export class Usuario extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nickname!: string;
    
    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    rol!: UUID;  

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    imageProfile?: string;
}