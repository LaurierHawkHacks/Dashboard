import { createContext, useState, useContext } from "react";

export type NotificationOptions = {
    id?: string;
    title: string;
    message: string;
};

export type NotificationData = {
    id: string;
    title: string;
    message: string;
    visible: boolean;
};

/**
 * Shows a notifcation with given options
 * @returns {string} - the notification id
 */
export type ShowNofiticationFn = (options: NotificationOptions) => string;

export type NotificationProviderContextValue = {
    showNotification: ShowNofiticationFn;
};

const NotificationProviderContext =
    createContext<NotificationProviderContextValue>({
        showNotification: () => "",
    });

export const NotificationProvider = ({
    children,
}: {
    children?: React.ReactNode;
}) => {
    const [visibleNotiications, setVisibleNotifications] = useState<
        NotificationData[]
    >([]);

    const showNotification = (options: NotificationOptions) => {
        const notification: NotificationData = {
            id: options.id ?? Math.random().toString(32),
            title: options.title,
            message: options.message,
            visible: true,
        };
        setVisibleNotifications((prev) => [...prev, notification]);
        return notification.id;
    };

    return (
        <NotificationProviderContext.Provider value={{ showNotification }}>
            {children}
            {visibleNotiications.map((data) => (
                <div key={data.id}>{data.title}</div>
            ))}
        </NotificationProviderContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationProviderContext);
};
