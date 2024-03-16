import React, { useState, useEffect, useRef } from 'react';
import {
  IonCard,
  IonCardContent,
  IonPage,
  IonContent,
} from "@ionic/react";

const CameraComponent: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStream(stream);
        setIsCameraActive(true);
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
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
      <IonContent>
        <IonCard className="card camera">
          <IonCardContent>
            {isCameraActive ? (
              <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
            ) : (
              <p>Camera is not available</p>
            )}
            <button onClick={() => setIsCameraActive(active => !active)}>
              {isCameraActive ? 'Stop Camera' : 'Start Camera'}
            </button>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CameraComponent;
