/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/FileUpload.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, File, X } from "lucide-react";
import { toastPopup } from "@/lib/toast";

// Define accepted file types
const ACCEPTED_FILE_TYPES = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "text/csv": [".csv"],
};

export default function FileUpload({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: any) => {
    // Add new files to the state
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file: Blob | MediaSource) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: 10485760, // 10MB
    onDropRejected: () => {
      toastPopup("Please upload Excel files under 10MB.", "error");
    },
  });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    // Clean up the preview URL
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toastPopup("Please select at least one file to upload.", "error");
      return;
    }

    setIsUploading(true);

    try {
      // Create a FormData instance
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      // Replace with your actual API endpoint
      const response = await fetch("/api/process-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.blob();

      // Call the callback with the result
      onUploadComplete(result);

      toastPopup("Your files have been uploaded and processed.", "success");

      // Clean up
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      toastPopup(
        error.message || "There was an error uploading your files.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card
        className={`border-2 border-dashed p-6 ${
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
      >
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center space-y-4 text-center cursor-pointer py-8"
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium">
              Drag and drop your Excel files here
            </p>
            <p className="text-sm text-gray-500">or click to browse files</p>
          </div>
          <p className="text-xs text-gray-400">
            Supports .xlsx, .xls, and .csv files (max 10MB each)
          </p>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Selected Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-white rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? (
              <>Processing Files...</>
            ) : (
              <>Upload and Process Files</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
