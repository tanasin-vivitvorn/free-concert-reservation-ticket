import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Concert } from '../concerts/concert.entity';
import { User } from '../users/user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  concertId: number;

  @Column({ default: false })
  canceled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  datetime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Concert)
  @JoinColumn({ name: 'concertId' })
  concert: Concert;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
} 