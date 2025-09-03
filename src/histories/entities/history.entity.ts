export class History {
  id: number;
  userId: number;
  concertId: number;
  action: 'reserve' | 'cancel';
  createdAt: Date;
}
