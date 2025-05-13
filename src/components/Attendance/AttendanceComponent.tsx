import { useState, useRef } from "react";
import { Client } from "@gradio/client";
import ErrorMessage from "../ui/ErrorMessage";
import LoadingIndicator from "../ui/LoadingIndicator";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceImage from "./AttendanceImage";
import AttendanceResults from "./AttendanceResults";
import EmptyState from "./EmptyState";
import StatusMessage from "./StatusMessage";
import CameraComponent from "./CameraComponent";

function AttendanceComponent() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState("none"); // "none", "uploaded", "processed"
  const [attendanceResults, setAttendanceResults] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Get today's date in a readable format
  function getTodayDate() {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Handle file selection
  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  function handleFileChange(event: FileChangeEvent) {
    const file = event.target.files[0];
    setError(null);
    setAttendanceResults([]);

    if (!file) return;

    // Validate that the file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    handleImageSelected(file);
  }

  // Common function to handle image from file input or camera
  function handleImageSelected(file: File, preview?: string) {
    setUploadedImage(file);
    setAttendanceStatus("uploaded");

    // Create image preview if not provided
    if (preview) {
      setImagePreview(preview);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Show success message
    alert(
      preview
        ? "Image has been successfully captured!"
        : "Image has been successfully uploaded!"
    );
  }

  // Handle click on the empty state container
  function handleEmptyStateClick() {
    fileInputRef.current?.click();
  }

  // Open camera
  function openCamera() {
    setIsCameraOpen(true);
    setError(null);
  }

  // Handle camera capture
  function handleCameraCapture(capturedFile: File, preview: string) {
    setIsCameraOpen(false);
    handleImageSelected(capturedFile, preview);
  }

  // Handle camera close
  function handleCameraClose() {
    setIsCameraOpen(false);
  }

  // Process attendance report
  async function handleTakeAttendance() {
    if (uploadedImage) {
      try {
        setIsProcessing(true);

        // Actual API implementation with Gradio client
        const client = await Client.connect("turing5577/face-recognition");
        const result = await client.predict("/predict", {
          image: uploadedImage, // Pass the uploaded image blob directly
        });

        // The API returns a single string with all faces, so we need to split it
        const facesData = (result.data as string[])[0].split("\\n");
        const split_faces = facesData[0].split("\n");

        setAttendanceResults(split_faces);
        setAttendanceStatus("processed");
        alert(`Attendance recorded for ${split_faces.length} people!`);
      } catch (err) {
        console.error("API Error:", err);
        setError(`Failed to process attendance: ${(err as Error).message}`);
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert("Please upload or capture an attendance image first.");
    }
  }

  return (
    <div className="p-6">
      <AttendanceHeader
        getTodayDate={getTodayDate}
        handleTakeAttendance={handleTakeAttendance}
        isProcessing={isProcessing}
        uploadedImage={uploadedImage}
      />

      {/* Hidden file input triggered by clicking the empty state */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Error message */}
      {error && <ErrorMessage message={error} />}

      {/* Camera component */}
      {isCameraOpen && (
        <div className="mt-8">
          <CameraComponent
            onCapture={handleCameraCapture}
            onClose={handleCameraClose}
          />
        </div>
      )}

      {/* Display uploaded image and results */}
      {uploadedImage && imagePreview && !isCameraOpen && (
        <div className="mt-8 border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Attendance Image</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <AttendanceImage
              imagePreview={imagePreview}
              uploadedImage={uploadedImage}
            />

            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Status</h3>
                <StatusMessage
                  status={attendanceStatus}
                  getTodayDate={getTodayDate}
                />
              </div>

              {/* Attendance Results Section */}
              {attendanceResults.length > 0 && (
                <AttendanceResults results={attendanceResults} />
              )}

              {/* Loading indicator during processing */}
              {isProcessing && <LoadingIndicator />}
            </div>
          </div>
        </div>
      )}

      {/* Empty state when no image is uploaded */}
      {!uploadedImage && !isCameraOpen && !error && (
        <div className="mt-8 relative border border-dashed border-gray-300 rounded-lg p-6">
          {/* Camera button positioned at top right */}
          <div className="absolute top-4 right-4">
            <button
              onClick={openCamera}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Open Camera
            </button>
          </div>

          {/* Main empty state content */}
          <EmptyState onClick={handleEmptyStateClick} />
        </div>
      )}

      {/* Future Scope Section */}
      <div className="mt-12 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Coming Soon: Automated Attendance
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-blue-600 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">
              IP Camera Integration
            </h3>
            <p className="text-gray-600 text-sm">
              Classroom IP cameras will automatically capture attendance images
              without manual uploads.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-blue-600 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">
              Real-Time Processing
            </h3>
            <p className="text-gray-600 text-sm">
              One-click attendance taking with instant image capture and
              recognition processing.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-blue-600 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">
              Automated Reports
            </h3>
            <p className="text-gray-600 text-sm">
              Comprehensive attendance reports generated automatically and ready
              for export.
            </p>
          </div>
        </div>

        <div className="mt-5 text-gray-600 text-sm bg-white p-4 rounded border border-gray-200">
          <p className="flex items-start">
            <span className="text-blue-500 mr-2 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            In the next update, teachers will simply click "Generate Report" and
            the system will automatically capture classroom images via installed
            IP cameras. The images will be instantly processed through our
            recognition model and attendance results will be displayed without
            any manual image uploads. This streamlined process will save time
            and increase accuracy in daily attendance tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AttendanceComponent;
