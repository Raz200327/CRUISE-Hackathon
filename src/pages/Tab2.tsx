import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import axios from "axios";
import "./Tab2.css";
import React, { useState, useEffect, useRef } from "react";
const Tab2: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideoStream = async () => {
      try {
        const response = await fetch("/video_feed");
        if (!response.ok) {
          throw new Error("Failed to fetch video stream");
        }
        const mediaStream = new MediaStream();
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        const reader = response.body?.getReader(); // Null check for response.body

        if (reader) {
          // Ensure reader is not null before proceeding
          const processStream = async () => {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const uint8Array = new Uint8Array(value);
              const blob = new Blob([uint8Array], { type: "video/webm" }); // Assuming the video type is 'video/webm'
              const videoURL = URL.createObjectURL(blob);
              if (videoRef.current) {
                videoRef.current.src = videoURL;
              }
            }
          };

          processStream();
        } else {
          throw new Error("Response body is null");
        }
      } catch (error) {
        console.error("Error fetching video stream:", error);
      }
    };

    fetchVideoStream();

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signify</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="container">
          <div className="card-container">
            <IonCard className="card chat-box">
              <IonCardContent>
                <IonInput label="Sign input"></IonInput>
                <IonButton>Submit</IonButton>
                <IonButton color="danger">Backspace</IonButton>
              </IonCardContent>
            </IonCard>

            <IonCard className="card result">
              <IonCardContent>
                {/* Display correct answer here */}
                ANSWER
              </IonCardContent>
            </IonCard>
          </div>
          <IonCard className="card camera">
            <IonCardContent>
              <video ref={videoRef} autoPlay controls></video>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
