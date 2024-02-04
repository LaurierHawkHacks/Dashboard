interface NotificationSchema {
    notificationFor: string;
    title: string;
    message: string;
    isRead: boolean;
    senderId: string;
}

export default NotificationSchema;