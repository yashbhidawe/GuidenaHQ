import { useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams } from "react-router-dom";
import { Loader } from "../components/Loader";

const Meet = () => {
  const { receiverId } = useParams();

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="h-screen w-full">
      {!isLoading && (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      )}{" "}
      <>
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={`guidenaHQ-${
            receiverId || Math.random().toString(36).substring(7)
          }`}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: false,
            startScreenSharing: false,
            enableEmailInStats: false,
            prejoinPageEnabled: true,
            defaultRemoteDisplayName: "GuidenaHQ User",
            disableDeepLinking: true,
            enableNoAudioDetection: false,
            enableNoisyMicDetection: false,
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
            SETTINGS_SECTIONS: ["devices", "language", "moderator", "security"],
            SHOW_JITSI_WATERMARK: false,
            APP_NAME: "GuidenaHQ Meet",
            MOBILE_APP_PROMO: false,
            PROVIDER_NAME: "GuidenaHQ",
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
          }}
          onApiReady={() => setIsLoading(false)}
        />
      </>
      )
    </div>
  );
};

export default Meet;
