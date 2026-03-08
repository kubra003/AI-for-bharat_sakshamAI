import json

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        question = body.get('question', '').lower()
        language = body.get('language', 'en')
        
        if not question:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Question is required'})
            }
        
        # Simple keyword-based responses for common health questions
        health_info = {
            'en': {
                'diabetes': 'Diabetes is a condition where blood sugar levels are too high. Manage it with diet, exercise, and medication as prescribed. Always consult your doctor.',
                'blood pressure': 'High blood pressure can lead to heart problems. Reduce salt intake, exercise regularly, and take prescribed medications. Monitor regularly.',
                'fever': 'Fever is body temperature above normal. Rest, drink fluids, and take paracetamol if needed. See a doctor if fever persists over 3 days.',
                'cold': 'Common cold causes runny nose and cough. Rest, drink warm fluids, and take steam. Usually resolves in 7-10 days.',
                'headache': 'Headaches can be due to stress, dehydration, or other causes. Rest in a quiet room, drink water, and take paracetamol if needed.',
                'default': 'For medical advice, please consult a qualified healthcare professional. This is educational information only.'
            },
            'hi': {
                'diabetes': 'मधुमेह में रक्त शर्करा का स्तर बढ़ जाता है। आहार, व्यायाम और दवा से नियंत्रित करें। डॉक्टर से परामर्श लें।',
                'blood pressure': 'उच्च रक्तचाप हृदय रोग का कारण बन सकता है। नमक कम करें, व्यायाम करें और दवा लें। नियमित जांच करें।',
                'fever': 'बुखार सामान्य से अधिक शरीर का तापमान है। आराम करें, तरल पदार्थ पिएं। 3 दिन से अधिक रहे तो डॉक्टर से मिलें।',
                'cold': 'सर्दी-जुकाम में नाक बहती है और खांसी होती है। आराम करें, गर्म पानी पिएं। 7-10 दिन में ठीक हो जाता है।',
                'headache': 'सिरदर्द तनाव या अन्य कारणों से हो सकता है। शांत कमरे में आराम करें, पानी पिएं।',
                'default': 'चिकित्सा सलाह के लिए योग्य डॉक्टर से परामर्श लें। यह केवल शैक्षिक जानकारी है।'
            }
        }
        
        # Find matching response
        responses = health_info.get(language, health_info['en'])
        answer = responses['default']
        
        for keyword, response in responses.items():
            if keyword in question and keyword != 'default':
                answer = response
                break
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'answer': answer,
                'language': language,
                'disclaimer': 'This is educational information only. Not medical advice. Consult a doctor.'
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }