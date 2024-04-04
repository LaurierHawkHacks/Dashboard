import { FC } from "react";

export type StepStatus = "complete" | "current" | "upcoming" | "inprogress";

export interface Step {
    position: number;
    name: string;
    status: StepStatus;
}

export interface StepProps {
    steps: Step[];
    onClick: (step: number) => void;
}

export const Steps: FC<StepProps> = ({ steps, onClick }) => {
    return (
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {steps.map((step) => (
                <li key={step.position} className="md:flex-1">
                    {step.status === "complete" ||
                    step.status === "current" ||
                    step.status === "inprogress" ? (
                        <button
                            className="w-full flex flex-col border-l-4 border-tbrand py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                            aria-current="step"
                            onClick={() => onClick(step.position)}
                        >
                            <span className="text-left text-sm font-medium text-tbrand">
                                {`Step ${step.position + 1}`}
                            </span>
                            <span className="text-left text-sm font-medium">
                                {step.name}
                            </span>
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                        >
                            <span className="text-left text-sm font-medium text-gray-500">
                                {`Step ${step.position + 1}`}
                            </span>
                            <span className="text-left text-sm font-medium">
                                {step.name}
                            </span>
                        </button>
                    )}
                </li>
            ))}
        </ol>
    );
};
