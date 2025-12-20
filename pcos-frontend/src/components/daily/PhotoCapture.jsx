import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const PhotoCapture = ({ onPhotoCapture, initialPhoto = null }) => {
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(initialPhoto);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);
  const [cameraMode, setCameraMode] = useState("user"); // 'user' for front camera, 'environment' for back

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Unable to access camera. Please ensure you have granted camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const switchCamera = async () => {
    stopCamera();
    setCameraMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => startCamera(), 100);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const photoData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedPhoto(photoData);
      onPhotoCapture(photoData);

      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    onPhotoCapture(null);
    startCamera();
  };

  const removePhoto = () => {
    setCapturedPhoto(null);
    onPhotoCapture(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Daily Photo (Track Acne & Facial Hair)
        </label>
        {capturedPhoto && (
          <button
            type="button"
            onClick={removePhoto}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Remove Photo
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {!showCamera && !capturedPhoto && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="space-y-4">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
            <p className="text-sm text-gray-600">
              Take a daily photo to track skin changes and facial hair growth
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        </div>
      )}

      {showCamera && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                type="button"
                onClick={switchCamera}
                className="p-3 bg-gray-800 bg-opacity-75 text-white rounded-full hover:bg-opacity-90 transition-all"
                title="Switch Camera"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-lg"
                title="Capture Photo"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="p-3 bg-gray-800 bg-opacity-75 text-white rounded-full hover:bg-opacity-90 transition-all"
                title="Close Camera"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {capturedPhoto && !showCamera && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border-2 border-purple-200">
            <img
              src={capturedPhoto}
              alt="Captured photo"
              className="w-full h-auto"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={retakePhoto}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Retake Photo
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Photo will be saved with your daily log
          </p>
        </div>
      )}
    </div>
  );
};

PhotoCapture.propTypes = {
  onPhotoCapture: PropTypes.func.isRequired,
  initialPhoto: PropTypes.string,
};

export default PhotoCapture;
