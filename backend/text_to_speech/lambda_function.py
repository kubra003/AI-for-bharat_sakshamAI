"""
Amazon Polly Text-to-Speech Lambda Function
Converts text to speech using Amazon Polly with support for Hindi and English
"""

import json
import boto3
import base64
from botocore.exceptions import ClientError

# Initialize AWS clients
polly_client = boto3.client('polly')

# Voice mapping for different languages
VOICE_MAP = {
    'hi': {
        'female': 'Aditi',  # Hindi female voice
        'male': 'Aditi'     # Polly doesn't have Hindi male, use Aditi
    },
    'en': {
        'female': 'Joanna',  # English (US) female voice
        'male': 'Matthew'    # English (US) male voice
    }
}

def lambda_handler(event, context):
    """
    Lambda handler for text-to-speech conversion using Amazon Polly
    
    Expected input:
    {
        "text": "Text to convert to speech",
        "language": "hi" or "en" (default: "en"),
        "voiceGender": "female" or "male" (default: "female"),
        "engine": "neural" or "standard" (default: "neural")
    }
    
    Returns:
    {
        "success": true,
        "audioContent": "base64-encoded audio data",
        "contentType": "audio/mpeg",
        "text": "original text",
        "voiceId": "voice used"
    }
    """
    
    # Enable CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Content-Type': 'application/json'
    }
    
    # Handle OPTIONS request for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS preflight successful'})
        }
    
    try:
        # Parse request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        # Extract parameters
        text = body.get('text', '')
        language = body.get('language', 'en').lower()
        voice_gender = body.get('voiceGender', 'female').lower()
        engine = body.get('engine', 'neural').lower()
        
        # Validate input
        if not text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'error': 'Text is required'
                })
            }
        
        # Validate language
        if language not in ['hi', 'en']:
            language = 'en'
        
        # Validate voice gender
        if voice_gender not in ['female', 'male']:
            voice_gender = 'female'
        
        # Get voice ID
        voice_id = VOICE_MAP.get(language, {}).get(voice_gender, 'Joanna')
        
        # Validate engine (neural voices may not be available for all voices)
        if engine not in ['neural', 'standard']:
            engine = 'neural'
        
        # For Hindi, use standard engine as neural may not be available
        if language == 'hi':
            engine = 'standard'
        
        print(f"Converting text to speech: language={language}, voice={voice_id}, engine={engine}")
        
        # Call Amazon Polly
        try:
            response = polly_client.synthesize_speech(
                Text=text,
                OutputFormat='mp3',
                VoiceId=voice_id,
                Engine=engine,
                LanguageCode='hi-IN' if language == 'hi' else 'en-US'
            )
        except ClientError as e:
            # If neural engine fails, fallback to standard
            if 'neural' in str(e).lower() and engine == 'neural':
                print(f"Neural engine not available, falling back to standard")
                response = polly_client.synthesize_speech(
                    Text=text,
                    OutputFormat='mp3',
                    VoiceId=voice_id,
                    Engine='standard',
                    LanguageCode='hi-IN' if language == 'hi' else 'en-US'
                )
            else:
                raise e
        
        # Read audio stream
        audio_stream = response['AudioStream'].read()
        
        # Encode audio to base64
        audio_base64 = base64.b64encode(audio_stream).decode('utf-8')
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'audioContent': audio_base64,
                'contentType': 'audio/mpeg',
                'text': text,
                'voiceId': voice_id,
                'engine': engine,
                'language': language
            })
        }
        
    except ClientError as e:
        print(f"AWS Polly error: {str(e)}")
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': f'Polly service error: {str(e)}'
            })
        }
    
    except Exception as e:
        print(f"Error in text-to-speech conversion: {str(e)}")
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': f'Internal server error: {str(e)}'
            })
        }
