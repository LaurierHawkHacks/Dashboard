import { createContext, useState, useContext } from "react";
import {
    Notification,
    type NotificationData,
} from "../components/Notification/Notification";
import { createPortal } from "react-dom";

export interface NotificationOptions
    extends Omit<NotificationData, "id" | "show"> {
    id?: number;
}

/**
 * Shows a notifcation with given options
 * @returns {string} - the notification id
 */
export type ShowNofiticationFn = (options: NotificationOptions) => number;

export type NotificationProviderContextValue = {
    showNotification: ShowNofiticationFn;
};

const NotificationProviderContext =
    createContext<NotificationProviderContextValue>({
        showNotification: () => -1,
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
            id: options.id ?? new Date().getTime(),
            title: options.title,
            message: options.message,
            show: false,
        };
        setVisibleNotifications((prev) => [...prev, notification]);
        setTimeout(
            () =>
                setVisibleNotifications((prev) =>
                    prev.map((n) => {
                        if (n.id === notification.id) n.show = true;
                        return n;
                    })
                ),
            100
        );
        return notification.id;
    };

    const closeNotification = (id: number) => {
        setVisibleNotifications((prev) =>
            prev.map((n) => {
                if (n.id === id) n.show = false;
                return n;
            })
        );
    };

    const notifications = visibleNotiications.map((data) => (
        <Notification key={data.id} onClose={closeNotification} {...data} />
    ));

    return (
        <NotificationProviderContext.Provider value={{ showNotification }}>
            {children}
            {notifications.length > 0 &&
                createPortal(
                    <div className="z-50 fixed bottom-4 md:bottom-auto md:top-4 md:right-4 w-full px-4 md:w-80">
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
