import json
import boto3
import base64

rekognition = boto3.client('rekognition', region_name='ap-south-1')

def lambda_handler(event, context):
    # Handle OPTIONS preflight request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Accept',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        body = json.loads(event['body'])
        image_data = body.get('image', '')
        language = body.get('language', 'en')
        
        if not image_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Accept',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Image is required'})
            }
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        
        # Use Rekognition to detect text
        response = rekognition.detect_text(
            Image={'Bytes': image_bytes}
        )
        
        # Extract all detected text
        detected_texts = []
        for text_detection in response['TextDetections']:
            if text_detection['Type'] == 'LINE':
                detected_texts.append(text_detection['DetectedText'])
        
        full_text = '\n'.join(detected_texts)
        
        # Simple medicine extraction (look for common patterns)
        medicines = []
        medicine_keywords = ['tab', 'tablet', 'cap', 'capsule', 'syrup', 'mg', 'ml']
        
        for line in detected_texts:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in medicine_keywords):
                medicines.append(line)
        
        result = {
            'text': full_text if full_text else ('कोई टेक्स्ट नहीं मिला' if language == 'hi' else 'No text detected'),
            'medicines': medicines,
            'total_lines': len(detected_texts)
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Accept',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(result)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Accept'
            },
            'body': json.dumps({'error': str(e)})
        }
