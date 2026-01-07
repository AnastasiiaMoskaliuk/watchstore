"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@mantine/core";

const mainVideo =
  "https://res.cloudinary.com/dwf5hcia5/video/upload/v1736872044/odajfuwpvcq64v2rdysq.mp4";
const videos = [
  "https://res.cloudinary.com/dwf5hcia5/video/upload/v1736872044/odajfuwpvcq64v2rdysq.mp4",
  "https://res.cloudinary.com/dwf5hcia5/video/upload/v1736872044/wmstnw2l9v4gne8fyjdx.mp4",
  "https://res.cloudinary.com/dwf5hcia5/video/upload/v1736872044/ybmitbxzc4klic2sjilq.mp4",
  "https://res.cloudinary.com/dwf5hcia5/video/upload/v1736872044/bkmeu6an9m6eankt2vmn.mp4",
  "https://res.cloudinary.com/dwf5hcia5/video/upload/v1736872044/fon3r2xsozep9won7vxy.mp4",
];

const VideoModalComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<string>(mainVideo);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimeout = 10 * 60 * 1000;

  const startInactivityTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsModalVisible(true);
    }, inactivityTimeout);
  };

  useEffect(() => {
    startInactivityTimer();

    const resetTimer = () => {
      startInactivityTimer();
    };

    window.addEventListener("add_to_backet", resetTimer);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("add_to_backet", resetTimer);
    };
  }, []);

  const handleVideoEnd = () => {
    setIsModalVisible(false);
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setCurrentVideo(randomVideo);
    startInactivityTimer();
  };

  return (
    <>
      {isModalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm z-50"
          onClick={() => handleVideoEnd()}
        />
      )}
      {isModalVisible && (
        <Modal
          opened={true}
          onClose={() => setIsModalVisible(false)}
          withCloseButton={false}
          classNames={{
            root: "z-[1000] fixed top-[15%] left-0 right-0 mx-auto w-[90%] max-w-[600px] flex flex-col items-center bg-white rounded-[32px] p-[20px]",
            body: "p-0",
          }}
        >
          <p className="text-center font-frontrunner md:text-[28px] mt-4">
            Саме час зробити покупку!
          </p>

          {currentVideo && (
            <video
              title="Why are you waiting?"
              className="rounded-[20px] outline-none"
              playsInline
              src={currentVideo}
              width="100%"
              muted={false}
              tabIndex={-1}
              height="auto"
              style={{ aspectRatio: "16/9", objectFit: "contain" }}
              controls={false}
              autoPlay
              onEnded={handleVideoEnd}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default VideoModalComponent;
