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
import "./Tab2.css";
import React, { useState, useEffect, useRef } from "react";
const Tab2: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStream(stream);
        setIsCameraActive(true);
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setIsCameraActive(false);
      }
    };

    if (isCameraActive) {
      startCamera();
    }

    return () => {
      stopCamera(); // Clean up when component unmounts
    };
  }, [isCameraActive]); // Run when isCameraActive changes
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
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <p>Camera is not available</p>
              )}
              <IonButton onClick={() => setIsCameraActive((active) => !active)}>
                {isCameraActive ? "Stop Camera" : "Start Camera"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
