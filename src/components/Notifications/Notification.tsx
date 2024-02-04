
import React, { useState, useEffect } from "react";
import NotificationSchema from "./NotificationSchema";

interface NotificationProps {
  notification: NotificationSchema;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
    const [showNotification, setShowNotification] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowNotification(false);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div
            className={`fixed top-0 right-0 m-4 p-4 bg-green-500 text-white shadow-md rounded-md transition-transform ${
                showNotification ? "transform translate-x-0" : "transform translate-x-full"
            }`}
        >
            <h3 className="text-lg font-bold">{notification.title}</h3>
            <p className="text-white">{notification.message}</p>
            <button
                className="mt-2 px-4 py-2 bg-white text-green-500 rounded-md focus:outline-none"
                onClick={onClose}
            >
        Close
            </button>
        </div>
    );
};

export default Notification;
