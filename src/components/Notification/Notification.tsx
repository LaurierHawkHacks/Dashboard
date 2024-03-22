import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { forwardRef } from "react";

export interface NotificationData {
    id: number;
    title: string;
    message: string;
    show: boolean;
}

export interface NotificationProps extends NotificationData {
    onClose: (id: number) => void;
}

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
    ({ id, title, message, onClose }, ref) => {
        return (
            <div
                ref={ref}
                aria-live="assertive"
                className="pointer-events-none flex items-end sm:items-start"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    <div className="pointer-events-auto max-h-32 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <InformationCircleIcon
                                        className="h-6 w-6 text-blue-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">
                                        {title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {message}
                                    </p>
                                </div>
                                <div className="ml-4 flex flex-shrink-0">
                                    <button
                                        type="button"
                                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500"
                                        onClick={() => onClose(id)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
Notification.displayName = "Notification";
