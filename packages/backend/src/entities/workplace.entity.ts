import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// import { User } from './user.entity';

@Entity()
export class Workplace {
  @PrimaryGeneratedColumn("uuid")
  workplaceID: string;

  @Column()
  creationDate: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 4000 })
  text: string;
}
//
//     @OneToMany(() => User, operator => user.workplace)
//     operators: User[];
// }
