import React, { useState } from "react";

export interface FileBrowserProps {
    allowedFileTypes?: string[];
    description?: string;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
    allowedFileTypes = ["image/*", "video/*"],
    description,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

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
        setFiles([...files, ...validFiles]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter((file) =>
            allowedFileTypes.some((type) => file.type.startsWith(type))
        );
        setFiles([...files, ...validFiles]);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border hover:cursor-pointer ${
                isDragging
                    ? "bg-tbrand border-charcoalBlack"
                    : "border-charcoalBlack bg-gray-50"
            } p-4 my-2 text-center hover:brightness-95 transition duration-300 ease-in-out`}
        >
            <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
                <span>Click to browse or drag and drop files here (.pdf)</span>
            </label>
            <div>{description}</div>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};
