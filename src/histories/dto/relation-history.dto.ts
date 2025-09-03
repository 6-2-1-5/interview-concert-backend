export interface RelationHistoryDto {
  id: number;
  user: {
    name: string;
  };
  concert: {
    name: string;
  };
  action: string;
  createdAt: Date;
}
