import React, { useState, useRef, useEffect } from "react";

interface CameraComponentProps {
  onCapture: (imageFile: File, imagePreview: string) => void;
  onClose: () => void;
}

function CameraComponent({ onCapture, onClose }: CameraComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true); // Track if component is mounted

  // Initialize camera on component mount
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    // Start camera with a small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      if (isMountedRef.current) {
        initializeCamera();
      }
    }, 100);

    // Clean up function
    return () => {
      // Set mounted flag to false
      isMountedRef.current = false;

      // Clear initialization timer
      clearTimeout(initTimer);

      // Stop camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  async function initializeCamera() {
    try {
      setError(null);

      // Clean up any existing stream first
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Check if component is still mounted
      if (!isMountedRef.current) {
        // Clean up if component unmounted during async operation
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      setCameraStream(stream);

      // Set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Set up event listeners before calling play()
        videoRef.current.onloadedmetadata = () => {
          if (!isMountedRef.current || !videoRef.current) return;

          // Try playing the video after metadata is loaded
          const playPromise = videoRef.current.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                if (isMountedRef.current) {
                  setIsReady(true);
                }
              })
              .catch((err) => {
                if (isMountedRef.current) {
                  console.error("Error playing video:", err);
                  setError(`Failed to play video: ${err.message}`);
                }
              });
          }
        };
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Camera access error:", err);
        setError(`Camera access failed: ${(err as Error).message}`);
      }
    }
  }

  function handleCapture() {
    try {
      if (!videoRef.current || !canvasRef.current) {
        setError("Camera or canvas reference not available");
        return;
      }

      if (!isReady) {
        setError("Video stream not ready yet. Please wait a moment.");
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw the current video frame to the canvas
      const context = canvas.getContext("2d");
      if (!context) {
        setError("Could not get canvas context");
        return;
      }

      // Clear the canvas and draw video frame
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image as data URL
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

      // Convert to blob and create File
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Failed to create image blob");
            return;
          }

          // Create a File object from the blob
          const capturedFile = new File([blob], "captured-image.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          // Send captured image back to parent component
          onCapture(capturedFile, imageDataUrl);
        },
        "image/jpeg",
        0.9
      );
    } catch (err) {
      console.error("Capture error:", err);
      setError(`Failed to capture image: ${(err as Error).message}`);
    }
  }

  function handleClose() {
    // Clean up camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    onClose();
  }

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Camera</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCapture}
            disabled={!isReady}
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReady
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
          >
            {isReady ? "Capture" : "Initializing..."}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="max-w-full max-h-[500px]"
        />
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {!isReady && !error && (
        <div className="mt-4 text-center text-gray-600">
          <div className="inline-block animate-spin mr-2">⟳</div>
          Initializing camera...
        </div>
      )}
    </div>
  );
}

export default CameraComponent;
