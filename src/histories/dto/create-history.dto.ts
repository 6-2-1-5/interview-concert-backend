export class CreateHistoryDto {
  userId: number;
  concertId: number;
  action: 'reserve' | 'cancel';
}
