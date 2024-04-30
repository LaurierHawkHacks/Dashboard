import { FC } from "react";

interface AccordionItem {
    question: string;
    answer: string;
}

interface AccordionProps {
    faqs: AccordionItem[];
}

// Extend the global JSX.IntrinsicElements interface to include the 'details' element
declare module "react" {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // Add the 'name' attribute to HTMLDetailsElement attributes
        name?: string;
    }
}

const parseAnswer = (answer: string) => {
    const lines = answer.split("\\n");

    return lines.map((line, index) => {
        if (line.includes("<a ")) {
            const parts = line.split(/<a |<\/a>/g);
            return (
                <p key={index} className="px-4 py-2 text-sm text-black">
                    {parts.map((part, partIndex) => {
                        const match = part.match(/href="([^"]+)"/);
                        if (match) {
                            const href = match[1];
                            return (
                                <a
                                    key={partIndex}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: "0.875rem",
                                        textDecoration: "underline",
                                    }}
                                >
                                    {part.split(">")[1]}
                                </a>
                            );
                        }
                        return part;
                    })}
                </p>
            );
        }

        return (
            <p key={index} className="px-4 py-2 text-sm text-black">
                {line}
            </p>
        );
    });
};

const Accordion: FC<AccordionProps> = ({ faqs }) => {
    const accordionPanelList = faqs.map((faq, i) => {
        return (
            <details
                className="accordion__panel [&>*]:px-3 [&>*]:py-4 rounded-lg overflow-hidden h-full"
                name="faq"
                key={i}
            >
                <summary className="accordion__header bg-[#FFEEE4] w-full text-left cursor-pointer">
                    {faq.question}
                </summary>
                <div className="accordion__content bg-slate-200">
                    {parseAnswer(faq.answer)}
                </div>
            </details>
        );
    });

    return (
        // sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2
        // grid grid-cols-2 gap-3 auto-cols-[1fr]
        <div className="accordion grid grid-flow-row gap-2">
            {accordionPanelList}
        </div>
    );
};

export { Accordion };
