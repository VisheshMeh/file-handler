// src/app/page.tsx
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUpload from "@/components/file-upload";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const [processedFile, setProcessedFile] = useState(null);

  const handleUploadComplete = (result) => {
    // Create a download URL for the processed file
    const url = URL.createObjectURL(result);
    setProcessedFile(url);
  };

  const handleDownload = () => {
    if (processedFile) {
      // Create an anchor element and trigger download
      const a = document.createElement("a");
      a.href = processedFile;
      a.download = "processed-data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-white border-b shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-blue-600">Excel Processor</h1>
          <p className="text-gray-600">
            Upload your Excel files for instant processing
          </p>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <FileUpload onUploadComplete={handleUploadComplete} />
          </div>

          {processedFile && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">
                    Processing Complete!
                  </h3>
                  <p className="text-green-600 text-sm">
                    Your file is ready for download
                  </p>
                </div>
              </div>
              <Button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700"
              >
                Download Result
              </Button>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-50 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Excel Processor. All rights reserved.
        </div>
      </footer>

      {/* React-Toastify Container */}
      <ToastContainer />
    </main>
  );
}
