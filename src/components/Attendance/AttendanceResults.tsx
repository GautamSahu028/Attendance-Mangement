import React from "react";

interface AttendanceResultsProps {
  results: string[];
}

const AttendanceResults: React.FC<AttendanceResultsProps> = ({ results }) => {
  // Parse face data from the format "face_X: name (Similarity: score)"
  function parseFaceData(faceString: string) {
    // Example: "face_1: tyrion (Similarity: 0.712)"
    const regex = /face_(\d+): ([^(]+) \(Similarity: ([0-9.]+)\)/;
    const match = faceString.match(regex);

    if (match) {
      return {
        id: match[1],
        name: match[2].trim(),
        similarity: parseFloat(match[3]),
      };
    }

    return {
      id: "?",
      name: "Unknown",
      similarity: 0,
    };
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Recognized Attendees</h3>
      <div className="bg-gray-50 border rounded p-4">
        <ul className="space-y-2">
          {results.map((faceData, index) => {
            if (!faceData.trim()) return null; // Skip empty entries

            const { id, name, similarity } = parseFaceData(faceData);
            const confidenceClass =
              similarity > 0.75
                ? "text-green-600"
                : similarity > 0.6
                ? "text-yellow-600"
                : "text-red-600";

            return (
              <li
                key={id}
                className="flex items-center py-2 border-b last:border-b-0"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium mr-3">
                  {id}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{name}</span>
                  <span className={`ml-3 text-sm ${confidenceClass}`}>
                    Similarity: {similarity.toFixed(3)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm">
          <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span>
          <span className="mr-3">High confidence</span>
          <span className="inline-block w-3 h-3 bg-yellow-600 rounded-full mr-1"></span>
          <span className="mr-3">Medium confidence</span>
          <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-1"></span>
          <span>Low confidence</span>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          Total Attendees: {results.filter((r) => r.trim()).length}
        </p>
      </div>
    </div>
  );
};

export default AttendanceResults;
