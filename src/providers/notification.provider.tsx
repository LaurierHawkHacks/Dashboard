import { createContext, useState, useContext } from "react";
import Notification from "../components/Notification/Notification";
import { createPortal } from "react-dom";

export type NotificationOptions = {
    id?: string;
    title: string;
    message: string;
};

export type NotificationData = {
    id: string;
    title: string;
    message: string;
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
        };
        setVisibleNotifications((prev) => [...prev, notification]);
        return notification.id;
    };

    const closeNotification = (id: string) => {
        setVisibleNotifications((prev) => prev.filter((n) => n.id != id));
    };

    const notifications = visibleNotiications.map((data) => (
        <Notification
            key={data.id}
            title={data.title}
            message={data.message}
            onClose={() => closeNotification(data.id)}
        />
    ));

    return (
        <NotificationProviderContext.Provider value={{ showNotification }}>
            {children}
            {notifications.length > 0 &&
                createPortal(
                    <div className="z-50 fixed bottom-4 md:bottom-auto md:top-4 right-4 w-80">
                        <div className="space-y-4">{notifications}</div>
                    </div>,
                    document.getElementById("notifications")!
                )}
        </NotificationProviderContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationProviderContext);
};
