import { useState, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams } from "react-router-dom";
import { Loader } from "../components/Loader";

const Meet = () => {
  const { receiverId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Smooth transition after component mounts
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const roomName = `guidenaHQ-${
    receiverId || Math.random().toString(36).substring(7)
  }`;

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Loading Overlay */}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm transition-all duration-700 ease-in-out ${
          isLoading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <Loader />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Connecting to GuidenaHQ Meet
            </h2>
            <p className="text-sm text-gray-600 max-w-sm">
              Setting up your secure meeting room...
            </p>
          </div>
        </div>
      </div>

      {/* Meeting Container */}
      <div
        className={`h-full w-full transition-all duration-500 ease-out ${
          isReady ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="h-full w-full  overflow-hidden shadow-2xl bg-white ">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: true,
              disableModeratorIndicator: false,
              startScreenSharing: false,
              enableEmailInStats: false,
              prejoinPageEnabled: true,
              defaultRemoteDisplayName: "GuidenaHQ User",
              disableDeepLinking: true,
              enableNoAudioDetection: true,
              enableNoisyMicDetection: true,
              hideLobbyButton: true,
            }}
            interfaceConfigOverwrite={{
              TOOLBAR_BUTTONS: [
                "microphone",
                "camera",
                "desktop",
                "chat",
                "raisehand",
                "videoquality",
                "fullscreen",
                "fodeviceselection",
                "hangup",
                "settings",
                "security",
              ],
              SETTINGS_SECTIONS: [
                "devices",
                "language",
                "moderator",
                "security",
              ],
              SHOW_JITSI_WATERMARK: false,
              APP_NAME: "GuidenaHQ Meet",
              MOBILE_APP_PROMO: false,
              PROVIDER_NAME: "GuidenaHQ",
            }}
            getIFrameRef={(iframeRef) => {
              if (iframeRef) {
                iframeRef.style.height = "100%";
                iframeRef.style.width = "100%";
                iframeRef.style.border = "none";
                iframeRef.style.borderRadius = "0.5rem";
              }
            }}
            onApiReady={() => {
              setIsLoading(false);
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-deep-teal rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">
              Powered by GuidenaHQ
            </span>
          </div>
          <div className="text-xs text-gray-500">Room: {roomName}</div>
        </div>
      </div>
    </div>
  );
};

export default Meet;
