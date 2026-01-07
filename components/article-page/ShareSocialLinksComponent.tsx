"use client";
import { Alert } from "flowbite-react";
import React, { useState } from "react";
import { TfiAlert } from "react-icons/tfi";
import { usePathname } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import {
  FacebookShareButton,
  TelegramShareButton,
  ViberShareButton,
} from "react-share";

import { CLIENT_URL } from "@/config/config";

const ShareSocialLinks = () => {
  const [copied, setCopied] = useState(false);

  const [infoMessage, setMessage] = useState<{
    type: string;
    text: string;
  } | null>(null);

  const currentPath = usePathname();
  const fullUrl = `${CLIENT_URL}${currentPath}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        setMessage({
          text: "Скопійовано",
          type: "success",
        });
      });
    } else {
      setTimeout(() => {
        setCopied(false);
        setMessage({ text: "Failed to copy", type: "error" });
      }, 2000);
    }

    setTimeout(() => {
      setCopied(false);
      setMessage(null);
    }, 2000);
  };

  const buttonStyles =
    "flex items-center justify-center bg-[#E5E6E9] group w-[32px] h-[32px] rounded hover:bg-opacity-[12%] hover:bg-darkBlack duration-300 ease-in-out transform hover:scale-125";
  const iconStyles =
    "fill-[#787A80] group-hover:fill-darkBlack duration-300 ease-in-out transform";

  return (
    <div className="flex flex-wrap items-center gap-[12px]">
      <span className="text-[16px] font-bold">Share: </span>
      <div className="flex flex-wrap items-center gap-[12px]">
        <FacebookShareButton
          url={fullUrl}
          resetButtonStyle={false}
          className={buttonStyles}
        >
          <svg
            className={iconStyles}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5628 1.00458L14.7856 1C11.6654 1 9.64903 3.12509 9.64903 6.41423V8.91055H6.85662C6.61532 8.91055 6.41992 9.1115 6.41992 9.35937V12.9763C6.41992 13.2241 6.61554 13.4249 6.85662 13.4249H9.64903V22.5514C9.64903 22.7993 9.84443 23 10.0857 23H13.729C13.9703 23 14.1657 22.799 14.1657 22.5514V13.4249H17.4307C17.672 13.4249 17.8674 13.2241 17.8674 12.9763L17.8688 9.35937C17.8688 9.24036 17.8226 9.12638 17.7409 9.04215C17.6591 8.95793 17.5477 8.91055 17.4318 8.91055H14.1657V6.79439C14.1657 5.77727 14.4017 5.26094 15.6915 5.26094L17.5624 5.26025C17.8035 5.26025 17.9989 5.0593 17.9989 4.81166V1.45317C17.9989 1.20576 17.8037 1.00504 17.5628 1.00458Z"
              fill=""
            />
          </svg>
        </FacebookShareButton>
        <ViberShareButton
          url={fullUrl}
          resetButtonStyle={false}
          className={buttonStyles}
        >
          <svg
            className={iconStyles}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21.7957 13.7361C22.4466 8.21624 21.483 4.7314 19.7448 3.15521L19.7457 3.15429C16.9402 0.462582 7.46565 0.0641828 4.10928 3.27518C2.602 4.84588 2.07109 7.1511 2.01291 10.0049C1.95472 12.8596 1.88563 18.2073 6.83201 19.6581H6.83656L6.83201 21.8735C6.83201 21.8735 6.79838 22.7711 7.36747 22.9515C8.01838 23.164 8.31293 22.7473 10.3375 20.3111C13.7229 20.6069 16.323 19.9292 16.6184 19.8302C17.302 19.5995 21.1702 19.0838 21.7957 13.7361ZM10.6711 18.7523C10.6711 18.7523 8.52838 21.444 7.86202 22.1428C7.64383 22.3699 7.40474 22.3489 7.40838 21.8983C7.40838 21.6024 7.42474 18.2202 7.42474 18.2202C3.23109 17.0094 3.47837 12.4558 3.52382 10.0736C3.56927 7.69054 4.002 5.73884 5.27837 4.42459C8.22293 1.64312 16.5293 2.26499 18.6457 4.26889C21.233 6.5796 20.3121 13.1078 20.3175 13.3304C19.7857 17.7943 16.6511 18.0773 16.0748 18.2705C15.8284 18.353 13.542 18.9455 10.6711 18.7523Z" />
            <path d="M11.8566 4.94749C11.5066 4.94749 11.5066 5.497 11.8566 5.50158C14.5721 5.52265 16.8085 7.42946 16.833 10.9271C16.833 11.2962 17.3694 11.2916 17.3648 10.9226C17.3357 7.15379 14.893 4.96855 11.8566 4.94749Z" />
            <path d="M15.4286 10.3472C15.4204 10.7117 15.9559 10.7292 15.9604 10.3601C16.005 8.28198 14.7332 6.57024 12.3431 6.38981C11.9931 6.36417 11.9568 6.91826 12.3059 6.94391C14.3786 7.10235 15.4704 8.52743 15.4286 10.3472Z" />
            <path d="M14.856 12.7109C14.4069 12.449 13.9496 12.612 13.7605 12.8694L13.3651 13.385C13.1642 13.6469 12.7887 13.6121 12.7887 13.6121C10.0487 12.8822 9.31599 9.99358 9.31599 9.99358C9.31599 9.99358 9.28236 9.60251 9.53327 9.39278L10.0278 8.98064C10.2751 8.78282 10.4314 8.30657 10.1796 7.83857C9.5069 6.61406 9.05508 6.19185 8.82508 5.86764C8.58326 5.56266 8.21963 5.49397 7.84144 5.70004H7.83326C7.0469 6.16346 6.18599 7.03078 6.46144 7.92374C6.93144 8.86524 7.79508 11.8665 10.5478 14.1342C11.8415 15.2067 13.8887 16.3057 14.7578 16.5594L14.766 16.5722C15.6224 16.8598 16.4551 15.9586 16.8996 15.1425V15.1361C17.0969 14.7414 17.0315 14.3677 16.7433 14.1232C16.2324 13.6213 15.4615 13.0672 14.856 12.7109Z" />
            <path d="M12.7176 8.43399C13.5913 8.48528 14.0149 8.94504 14.0604 9.88929C14.0767 10.2584 14.6085 10.2327 14.5922 9.86365C14.534 8.6309 13.8958 7.944 12.7467 7.87989C12.3967 7.85883 12.364 8.41293 12.7176 8.43399Z" />
          </svg>
        </ViberShareButton>
        <TelegramShareButton
          url={fullUrl}
          resetButtonStyle={false}
          className={buttonStyles}
        >
          <svg
            className={iconStyles}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.63262 15.1813L9.2687 20.7653C9.78938 20.7653 10.0149 20.5213 10.2853 20.2283L12.7264 17.6833L17.7847 21.7243C18.7124 22.2883 19.366 21.9913 19.6163 20.7933L22.9365 3.8214L22.9374 3.8204C23.2317 2.3244 22.4415 1.73941 21.5377 2.1064L2.02135 10.2574C0.689406 10.8214 0.709573 11.6314 1.79493 11.9984L6.78447 13.6913L18.3742 5.78039C18.9196 5.38639 19.4155 5.60439 19.0076 5.99839L9.63262 15.1813Z" />
          </svg>
        </TelegramShareButton>
        <>
          <button
            onClick={handleCopy}
            className={`${buttonStyles} 
            }`}
          >
            <svg
              className={iconStyles}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.7285 3.88396C17.1629 2.44407 19.2609 2.41383 20.4224 3.57981C21.586 4.74798 21.5547 6.85922 20.1194 8.30009L17.6956 10.7333C17.4033 11.0268 17.4042 11.5017 17.6976 11.794C17.9911 12.0863 18.466 12.0854 18.7583 11.7919L21.1821 9.35869C23.0934 7.43998 23.3334 4.37665 21.4851 2.5212C19.6346 0.663551 16.5781 0.905664 14.6658 2.82536L9.81817 7.69182C7.90688 9.61053 7.66692 12.6739 9.51519 14.5293C9.80751 14.8228 10.2824 14.8237 10.5758 14.5314C10.8693 14.2391 10.8702 13.7642 10.5779 13.4707C9.41425 12.3026 9.44559 10.1913 10.8809 8.75042L15.7285 3.88396Z" />
              <path d="M14.4851 9.47074C14.1928 9.17728 13.7179 9.17636 13.4244 9.46868C13.131 9.76101 13.1301 10.2359 13.4224 10.5293C14.586 11.6975 14.5547 13.8087 13.1194 15.2496L8.27178 20.1161C6.83745 21.556 4.73937 21.5863 3.57791 20.4203C2.41424 19.2521 2.44559 17.1408 3.88089 15.6999L6.30473 13.2667C6.59706 12.9732 6.59614 12.4984 6.30268 12.206C6.00922 11.9137 5.53434 11.9146 5.24202 12.2081L2.81818 14.6413C0.906876 16.5601 0.666916 19.6234 2.51519 21.4789C4.36567 23.3365 7.42221 23.0944 9.33449 21.1747L14.1821 16.3082C16.0934 14.3895 16.3334 11.3262 14.4851 9.47074Z" />
            </svg>
          </button>
          {infoMessage && (
            <Alert
              color={infoMessage.type === "success" ? "bg-[#787A80]" : "red"}
              className={`bg-[#E5E6E9] fixed bottom-0 left-0 m-4 p-4 z-10 text-[16px] lg:text-[18px] ${
                infoMessage.type === "success" ? "text-[grey]" : "text-[red]"
              }`}
            >
              <div className="flex items-center space-x-2">
                {infoMessage.type === "success" ? (
                  <FiCheckCircle />
                ) : (
                  <TfiAlert />
                )}
                <span>{infoMessage.text}</span>
              </div>
            </Alert>
          )}
        </>
      </div>
    </div>
  );
};
export default ShareSocialLinks;
