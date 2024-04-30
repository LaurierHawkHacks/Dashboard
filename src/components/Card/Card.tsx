import { FC, ReactNode } from "react";

interface CardProps {
    title: string;
    className?: string;
    children?: ReactNode;
}

export const Card: FC<CardProps> = ({ title, className, children }) => {
    return (
        <article
            className={`card px-[1.375rem] py-[1.125rem] shadow-[0_0_9px_2px_#E6E6E6] rounded-lg ${className}`}
        >
            <div className="card__header mb-[1.125rem]">
                <h2 className="font-sans text-xl font-bold">{title}</h2>
            </div>
            {children}
        </article>
    );
};
