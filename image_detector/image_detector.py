import torch
import sys
import os 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'yolov5m_best.pt') 

# confidance interval (%70)
CONFIDENCE_THRESHOLD = 0.70

# model classes
HUMAN_CLASS_NAME = 'human'
ANIMAL_CLASS_NAME = 'animal'

def analyze_image(image_path):
    try:
        model = torch.hub.load('ultralytics/yolov5', 'custom', path=MODEL_PATH)
        
        model.conf = CONFIDENCE_THRESHOLD
        
        results = model(image_path)
        
        detections = results.pandas().xyxy[0]
        
        found_human = False
        found_animal = False

        for _, row in detections.iterrows(): 
            class_name = row['name']
            
            if class_name == HUMAN_CLASS_NAME:
                found_human = True
                break  
            
            if class_name == ANIMAL_CLASS_NAME:
                found_animal = True

        if found_human:
            return -1 # Uygunsuz: invalid photo
        elif found_animal:
            return 1  # Uygun: animal found
        else:
            return 0  # Nötr: do not found any object

    except Exception as e:
        print(f"Python Error: {e}", file=sys.stderr)
        return 0

if __name__ == "__main__":

    if len(sys.argv) > 1:
        image_path_from_nodejs = sys.argv[1]
        
        result_code = analyze_image(image_path_from_nodejs)
        
        print(result_code)
    else:
        print("Python Error: No image path provided from Node.js.", file=sys.stderr)
        print(0) r