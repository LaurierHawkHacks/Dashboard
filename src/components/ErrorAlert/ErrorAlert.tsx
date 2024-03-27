import { XCircleIcon } from "@heroicons/react/20/solid";

export interface ErrorAlertProps {
    errors: string[];
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ errors }) => {
    const multiple = errors.length > 1;
    return (
        <div className="rounded-md bg-red-50 border-2 border-red-400 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                        {`There ${multiple ? "were" : "was"} ${
                            errors.length
                        } error${multiple ? "s" : ""} with your submission`}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc space-y-1 pl-5">
                            {errors.map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
