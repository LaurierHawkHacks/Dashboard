import { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { ComponentProps } from "./types";

export interface ModalProps extends ComponentProps {
    title: string;
    subTitle: string;
    open: boolean;
    onClose: () => void;
}

export const Modal: FC<ModalProps> = ({
    title,
    subTitle,
    children,
    onClose,
    open,
}) => {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            {/* bird */}
                            <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded">
                                <div className="bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-end">
                                        <button onClick={onClose}>
                                            <XCircleIcon className="w-8 h-8" />
                                        </button>
                                    </div>
                                    <Dialog.Title
                                        as="h2"
                                        className="text-lg font-bold text-center leading-6 text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-sm text-center leading-6 text-gray-900"
                                    >
                                        {subTitle}
                                    </Dialog.Title>
                                    <div className="mt-4">{children}</div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
