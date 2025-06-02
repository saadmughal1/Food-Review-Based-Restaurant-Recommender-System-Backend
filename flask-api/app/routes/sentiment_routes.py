from flask import Blueprint, request, jsonify
from app.controllers.sentiment_controller import analyze_sentiment_controller

sentiment_bp = Blueprint('sentiment', __name__)

@sentiment_bp.route('/analyze', methods=['POST'])
def analyze_sentiment_route():
    data = request.get_json()
    text = data.get('text', '')
    
    response, status_code = analyze_sentiment_controller(text)
    return jsonify(response), status_code