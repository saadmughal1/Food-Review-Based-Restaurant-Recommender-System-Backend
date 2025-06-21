from flask import Blueprint, request, jsonify
from app.controllers.recomendation_controller import get_preferences_recommendations

recomendation_bp = Blueprint('recomendation', __name__)

@recomendation_bp.route('/recommend-preferences', methods=['POST'])
def recomendation_preferences():
    data = request.get_json()
    userPreferences = data.get('userPreferences', '')
    user_id = data.get('user_id', '')
    response, status_code = get_preferences_recommendations(userPreferences,user_id)
    return jsonify(response), status_code