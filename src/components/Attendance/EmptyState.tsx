import React from "react";

interface EmptyStateProps {
  onClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="mt-16 text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
    >
      <div className="mx-auto w-20 h-20 mb-6 text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Begin Attendance Tracking
      </h3>
      <p className="text-gray-600 mb-6">
        Click to upload an image to identify and record attendees
      </p>

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-3">
          <span className="text-blue-600 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          <h4 className="font-medium text-gray-800">
            Recognition Model Information
          </h4>
        </div>

        <div className="text-sm text-left">
          <div className="mb-3">
            <p className="font-medium text-gray-700 mb-1">GOT Characters:</p>
            <p className="text-gray-600 ml-4">
              Arya Stark, Cersei Lannister, Daenerys Targareyn , Jamie
              Lannister, Jon Snow, Ned Stark, Tyrion Lannister
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-1">MARVEL Characters:</p>
            <p className="text-gray-600 ml-4">
              Antman, Black Panther, Black Widow, Captain America, Captain
              Marvel, Doctor Strange, Hulk, Iron Man, Loki, Nick Fury,
              Spider-Man, Thor, Wasp
            </p>
          </div>

          <p className="mt-4 text-gray-500 text-xs italic">
            Note: Processing time may vary as the model runs on a free
            HuggingFace instance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
