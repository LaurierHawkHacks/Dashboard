import { FC } from "react";
import type { ComponentProps } from "../common";

export const PageWrapper: FC<ComponentProps> = ({ children }) => {
    return <div>{children}</div>;
};
