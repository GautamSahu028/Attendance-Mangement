import React from "react";
import Button from "../ui/Button";

interface AttendanceHeaderProps {
  getTodayDate: () => string;
  handleTakeAttendance: () => void;
  isProcessing: boolean;
  uploadedImage: File | null;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  getTodayDate,
  handleTakeAttendance,
  isProcessing,
  uploadedImage,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance System</h1>
        <Button onClick={handleTakeAttendance} disabled={isProcessing}>
          {isProcessing
            ? "Processing..."
            : uploadedImage
            ? "Generate Report"
            : "Take Attendance"}
        </Button>
      </div>
      <p className="text-gray-600 mt-2">{getTodayDate()}</p>
    </div>
  );
};

export default AttendanceHeader;
