import cv2
import numpy as np
from ultralytics import YOLO
import cvzone

# Mouse callback function for RGB window
def RGB(event, x, y, flags, param):
    if event == cv2.EVENT_MOUSEMOVE:
        point = [x, y]
        print(point)

cv2.namedWindow('RGB')
cv2.setMouseCallback('RGB', RGB)

# Load YOLOv8 model
model = YOLO("yolo11n.pt")
names = model.names

# Video input
cap = cv2.VideoCapture('peoplecount1.mp4')

# Area definitions
area1 = [(250, 444), (211, 444), (473, 575), (514, 566)]
area2 = [(201, 449), (177, 453), (420, 581), (457, 577)]

count = 0
enter = {}
exit = {}
entered_ids = []
exited_ids = []

# Flag to pause detection
pause_detection = False

while True:
    if not pause_detection:
        ret, frame = cap.read()
        count += 1
        if count % 2 != 0:
            continue
        if not ret:
            break

        frame = cv2.resize(frame, (1020, 600))
        results = model.track(frame, persist=True)

        if results[0].boxes is not None and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.int().cpu().tolist()
            class_ids = results[0].boxes.cls.int().cpu().tolist()
            track_ids = results[0].boxes.id.int().cpu().tolist()
            confidences = results[0].boxes.conf.cpu().tolist()

            for box, class_id, track_id, conf in zip(boxes, class_ids, track_ids, confidences):
                label = names[class_id]
                if 'person' in label:
                    x1, y1, x2, y2 = box

                    # Enter check
                    if cv2.pointPolygonTest(np.array(area2, np.int32), (x1, y2), False) >= 0:
                        enter[track_id] = (x1, y2)

                    if track_id in enter:
                        if cv2.pointPolygonTest(np.array(area1, np.int32), (x1, y2), False) >= 0:
                            if track_id not in entered_ids:
                                entered_ids.append(track_id)
                                pause_detection = True  # Pause here
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                            cvzone.putTextRect(frame, f'{track_id}', (x1, y1), 1, 1)
                            cv2.circle(frame, (x1, y2), 5, (255, 0, 0), -1)

                    # Exit check
                    if cv2.pointPolygonTest(np.array(area1, np.int32), (x1, y2), False) >= 0:
                        exit[track_id] = (x1, y2)

                    if track_id in exit:
                        if cv2.pointPolygonTest(np.array(area2, np.int32), (x1, y2), False) >= 0:
                            if track_id not in exited_ids:
                                exited_ids.append(track_id)
                                pause_detection = True  # Pause here too
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cvzone.putTextRect(frame, f'{track_id}', (x1, y1), 1, 1)
                            cv2.circle(frame, (x1, y2), 5, (0, 255, 255), -1)
    print(enter)
    print(entered_ids)
    print(exit)
    print(exited_ids)
    # Draw zones
    cv2.polylines(frame, [np.array(area1, np.int32)], True, (255, 0, 255), 4)
    cv2.polylines(frame, [np.array(area2, np.int32)], True, (255, 0, 255), 4)

    # Pause screen
    if pause_detection:
        cv2.putText(frame, "Detection Paused! Press 'g' to continue...", (200, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)

    # Display the frame
    cv2.imshow("RGB", frame)
    key = cv2.waitKey(1) & 0xFF

    # Resume if 'g' is pressed
    if key == ord('g'):
        pause_detection = False

    # Quit
    if key == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

