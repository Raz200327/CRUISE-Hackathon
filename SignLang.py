from flask import Flask, render_template, Response
import cv2
import numpy as np
import mediapipe as mp

app = Flask(__name__)

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2)
# Function to capture frames from the camera
def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            # Convert the frame to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # Detect landmarks
            results = hands.process(frame_rgb)
            # Draw landmarks on the frame
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # Convert landmarks to pixel coordinates
                    landmarks_px = [(int(landmark.x * frame.shape[1]), int(landmark.y * frame.shape[0])) for landmark in hand_landmarks.landmark]
        
                    # Calculate bounding box coordinates with padding
                    padding = 100
                    x_min = min(landmarks_px, key=lambda x: x[0])[0] - padding
                    x_max = max(landmarks_px, key=lambda x: x[0])[0] + padding
                    y_min = min(landmarks_px, key=lambda x: x[1])[1] - padding
                    y_max = max(landmarks_px, key=lambda x: x[1])[1] + padding
        
                    # Draw bounding box
                    cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (255, 0, 0), 2)
            
            # Encode the frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)