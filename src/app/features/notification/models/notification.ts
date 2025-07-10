export interface NotificationModel {
  id: number;
  userId: number;
  type: string;
  message: string;
  isSent: boolean;
  sentAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
