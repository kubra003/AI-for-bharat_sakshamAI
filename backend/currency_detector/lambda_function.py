import json
import boto3
import base64
import re
from datetime import datetime

# Initialize AWS clients
rekognition = boto3.client('rekognition', region_name='ap-south-1')

# Indian currency denominations
INDIAN_DENOMINATIONS = [10, 20, 50, 100, 200, 500, 2000]

def lambda_handler(event, context):
    """
    Currency Detector Lambda Function
    - Detects Indian currency notes using Rekognition detect_text API
    - Identifies denomination and returns confidence score
    """
    
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        image_base64 = body.get('image')
        language = body.get('language', 'en')
        
        if not image_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No image provided'})
            }
        
        # Remove data URL prefix if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_base64)
        
        # Use Rekognition to detect text
        rekognition_response = rekognition.detect_text(
            Image={'Bytes': image_bytes}
        )
        
        # Extract all detected text
        detected_texts = []
        for text_detection in rekognition_response.get('TextDetections', []):
            detected_text = text_detection['DetectedText']
            confidence = text_detection['Confidence']
            detected_texts.append({
                'text': detected_text,
                'confidence': confidence
            })
        
        # Detect currency denomination
        denomination_result = detect_currency_denomination(detected_texts)
        
        if denomination_result['denomination']:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'denomination': denomination_result['denomination'],
                    'confidence': denomination_result['confidence'],
                    'currency': 'INR',
                    'symbol': '₹',
                    'detected': True,
                    'message': get_message(denomination_result['denomination'], language),
                    'timestamp': datetime.utcnow().isoformat()
                })
            }
        else:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'denomination': None,
                    'confidence': 0,
                    'detected': False,
                    'message': get_no_currency_message(language),
                    'timestamp': datetime.utcnow().isoformat()
                })
            }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'denomination': None,
                'confidence': 0,
                'detected': False,
                'error': 'Failed to detect currency',
                'message': get_no_currency_message(language),
                'timestamp': datetime.utcnow().isoformat()
            })
        }


def detect_currency_denomination(detected_texts):
    """
    Analyze detected text to identify Indian currency denomination
    """
    denomination = None
    max_confidence = 0
    
    for text_obj in detected_texts:
        text = text_obj['text']
        confidence = text_obj['confidence']
        
        # Look for numeric values that match Indian denominations
        # Check for patterns like "10", "20", "50", "100", "200", "500", "2000"
        numbers = re.findall(r'\b\d+\b', text)
        
        for num_str in numbers:
            try:
                num = int(num_str)
                if num in INDIAN_DENOMINATIONS:
                    # Found a valid denomination
                    if confidence > max_confidence:
                        denomination = num
                        max_confidence = confidence
            except ValueError:
                continue
        
        # Also check for rupee symbol patterns
        if '₹' in text or 'Rs' in text or 'INR' in text:
            # Extract number after currency symbol
            rupee_numbers = re.findall(r'[₹Rs]\s*(\d+)', text)
            for num_str in rupee_numbers:
                try:
                    num = int(num_str)
                    if num in INDIAN_DENOMINATIONS:
                        if confidence > max_confidence:
                            denomination = num
                            max_confidence = confidence
                except ValueError:
                    continue
    
    return {
        'denomination': denomination,
        'confidence': round(max_confidence, 2)
    }


def get_message(denomination, language):
    """
    Get announcement message in specified language
    """
    messages = {
        'en': f'This is a {denomination} rupees note',
        'hi': f'यह {denomination} रुपये का नोट है'
    }
    return messages.get(language, messages['en'])


def get_no_currency_message(language):
    """
    Get message when no currency is detected
    """
    messages = {
        'en': 'No currency note detected. Please ensure the note is clear and well-lit.',
        'hi': 'कोई करेंसी नोट नहीं मिला। कृपया सुनिश्चित करें कि नोट स्पष्ट और अच्छी तरह से रोशन है।'
    }
    return messages.get(language, messages['en'])
