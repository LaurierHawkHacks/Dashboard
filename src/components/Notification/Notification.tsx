import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface NotificationData {
    id: number;
    title: string;
    message: string;
    show: boolean;
}

interface NotificationProps extends NotificationData {
    onClose: (id: number) => void;
}

export const Notification: React.FC<NotificationProps> = ({
    id,
    title,
    message,
    show,
    onClose,
}) => {
    return (
        <Transition
            show={show}
            as={Fragment}
            enter="transition-notification duration-200"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="transition-notification duration-200"
            leaveFrom="opacity-100 max-h-32 translate-x-0"
            leaveTo="opacity-0 max-h-0 translate-x-full"
        >
            <div
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
        </Transition>
    );
};
