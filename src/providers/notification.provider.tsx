import { createContext, useState, useContext } from "react";
import { Notification } from "@components";
import type { NotificationData } from "@/components/types";
import { createPortal } from "react-dom";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

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
            show: true,
        };
        setVisibleNotifications((prev) => [...prev, notification]);
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

    const removeNotification = (id: number) => {
        setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const notifications = visibleNotiications.map((data) => (
        <Transition
            key={data.id}
            show={data.show}
            appear
            as={Fragment}
            afterLeave={() => removeNotification(data.id)}
            enter="transition-notification duration-200"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="transition-notification duration-200"
            leaveFrom="opacity-100 max-h-32 translate-x-0"
            leaveTo="opacity-0 max-h-0 translate-x-full"
        >
            <Notification onClose={closeNotification} {...data} />
        </Transition>
    ));

    return (
        <NotificationProviderContext.Provider value={{ showNotification }}>
            {children}
            {createPortal(
                <div className="z-50 fixed bottom-4 md:bottom-auto md:top-4 md:right-4 w-full px-4 md:w-96">
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
