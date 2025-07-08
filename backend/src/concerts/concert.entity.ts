import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  seat: number;

  @Column({ default: 0 })
  remain_seat: number;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
} 