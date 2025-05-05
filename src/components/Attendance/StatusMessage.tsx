import React from "react";

interface StatusMessageProps {
  status: string;
  getTodayDate: () => string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  status,
  getTodayDate,
}) => {
  switch (status) {
    case "uploaded":
      return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            Image successfully uploaded. Click "Generate Report" to process
            attendance.
          </p>
        </div>
      );
    case "processed":
      return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700">
            Attendance successfully recorded for {getTodayDate()}
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default StatusMessage;
