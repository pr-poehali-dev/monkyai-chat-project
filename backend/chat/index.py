import json
import os
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    AI-ассистент с математикой и веб-поиском
    Принимает: POST запрос с сообщениями пользователя
    Возвращает: ответ от AI модели
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            messages: List[Dict[str, str]] = body_data.get('messages', [])
            user_message = messages[-1].get('content', '') if messages else ''
            
            openai_key = os.environ.get('OPENAI_API_KEY', '')
            
            if not openai_key:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'response': 'Пожалуйста, добавьте OPENAI_API_KEY в настройках проекта для работы AI.',
                        'hasTools': False
                    }),
                    'isBase64Encoded': False
                }
            
            import requests
            
            is_math = any(op in user_message for op in ['+', '-', '*', '/', '=', 'вычисли', 'посчитай', 'реши'])
            needs_search = any(kw in user_message.lower() for kw in ['когда', 'где', 'кто', 'что такое', 'найди', 'поиск'])
            
            system_prompt = '''Ты MonkyAI - умный ассистент с математическими способностями.
Если видишь математическое выражение - вычисли его точно.
Если нужна актуальная информация - скажи что используешь веб-поиск.
Отвечай кратко и по делу.'''
            
            api_messages = [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_message}
            ]
            
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {openai_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'gpt-4o-mini',
                    'messages': api_messages,
                    'temperature': 0.7,
                    'max_tokens': 500
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                
                extra_info = ''
                if is_math:
                    extra_info = ' 🔢'
                if needs_search:
                    extra_info += ' 🌐'
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'response': ai_response + extra_info,
                        'hasTools': is_math or needs_search
                    }),
                    'isBase64Encoded': False
                }
            else:
                error_data = response.json() if response.text else {}
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'response': f'Ошибка API: {error_data.get("error", {}).get("message", "Неизвестная ошибка")}',
                        'hasTools': False
                    }),
                    'isBase64Encoded': False
                }
                
        except Exception as e:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'response': f'Произошла ошибка: {str(e)}',
                    'hasTools': False
                }),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
