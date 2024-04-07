import React, { useEffect, useState } from "react";

export interface FileBrowserProps {
    allowedFileTypes?: string[];
    description?: string;
    subdescription?: string;
    onChange: (file: File | null) => void;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
    allowedFileTypes = ["image/*", "video/*"],
    description,
    subdescription = "PDF is highly recommended, but all image and document file formats are accepted!",
    onChange,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [randomId] = useState(Math.random().toString(32));

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter((file) =>
            allowedFileTypes.some((type) => file.type.startsWith(type))
        );
        setFile(validFiles[0]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFile(selectedFiles[0] ?? null);
    };

    useEffect(() => {
        onChange(file);
    }, [file]);

    return (
        <>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border ${
                    isDragging
                        ? "bg-tbrand border-charcoalBlack"
                        : "border-charcoalBlack bg-gray-50"
                } p-4 my-2 text-center`}
            >
                <input
                    type="file"
                    accept={allowedFileTypes.join(", ")}
                    onChange={handleFileInput}
                    className="hidden"
                    id={`file-${randomId}`}
                />
                <label htmlFor={`file-${randomId}`} className="cursor-pointer">
                    <span>Click to browse or drag and drop file here</span>
                </label>
                <div>{description}</div>
                <ul>{file && <li>{file.name}</li>}</ul>
            </div>
            {subdescription && (
                <p className="mt-2 text-sageGray">{subdescription}</p>
            )}
        </>
    );
};
