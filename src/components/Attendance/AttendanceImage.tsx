import React from "react";

interface AttendanceImageProps {
  imagePreview: string;
  uploadedImage: File;
}

const AttendanceImage: React.FC<AttendanceImageProps> = ({
  imagePreview,
  uploadedImage,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Image Preview</h3>
      <div className="border rounded p-2 bg-gray-50">
        <img
          src={imagePreview}
          alt="Attendance"
          className="max-w-full h-auto rounded"
        />
      </div>

      <div className="space-y-2 mt-4 bg-gray-50 p-4 rounded">
        <p>
          <span className="font-medium">File name:</span> {uploadedImage.name}
        </p>
        <p>
          <span className="font-medium">Image type:</span> {uploadedImage.type}
        </p>
        <p>
          <span className="font-medium">Size:</span>{" "}
          {(uploadedImage.size / 1024).toFixed(2)} KB
        </p>
        <p>
          <span className="font-medium">Taken on:</span>{" "}
          {new Date(uploadedImage.lastModified).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Upload time:</span>{" "}
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AttendanceImage;
