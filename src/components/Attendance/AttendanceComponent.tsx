import { useState, useRef } from "react";
import { Client } from "@gradio/client";
import ErrorMessage from "../ui/ErrorMessage";
import LoadingIndicator from "../ui/LoadingIndicator";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceImage from "./AttendanceImage";
import AttendanceResults from "./AttendanceResults";
import EmptyState from "./EmptyState";
import StatusMessage from "./StatusMessage";

function AttendanceComponent() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState("none"); // "none", "uploaded", "processed"
  const [attendanceResults, setAttendanceResults] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
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

    setUploadedImage(file);
    setAttendanceStatus("uploaded"); // Set status to uploaded

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Show success message
    alert("Image has been successfully uploaded!");
  }

  // Handle click on the empty state container
  function handleEmptyStateClick() {
    fileInputRef.current?.click();
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
      alert("Please upload an attendance image first.");
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

      {/* Display uploaded image and results */}
      {uploadedImage && imagePreview && (
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
      {!uploadedImage && !error && (
        <EmptyState onClick={handleEmptyStateClick} />
      )}
    </div>
  );
}

export default AttendanceComponent;
