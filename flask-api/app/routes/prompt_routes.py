from flask import Blueprint, request, jsonify
from app.controllers.prompt_controller import classify_search

prompt_bp = Blueprint('prompt', __name__)

@prompt_bp.route('/classify-search', methods=['POST'])
def classify_search_route():
    data = request.get_json()
    text = data.get('text', '')
    response, status_code = classify_search(text)
    return jsonify(response), status_code