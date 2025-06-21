import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def get_preferences_recommendations(userPreferences, user_id):
    users = []
    cuisines_set = set()
    
    for user in userPreferences:
        users.append({
            'userId': user['userId'],
            'name': user['name'],
            'cuisines': user['cuisines']
        })
        cuisines_set.update(user['cuisines'])
    
    all_cuisines = sorted(list(cuisines_set))
    
    user_cuisine_matrix = []
    user_ids = []
    
    for user in users:
        user_ids.append(user['userId'])
        cuisine_vector = [1 if cuisine in user['cuisines'] else 0 for cuisine in all_cuisines]
        user_cuisine_matrix.append(cuisine_vector)
    
    similarity_matrix = cosine_similarity(user_cuisine_matrix)
    
    try:
        target_idx = user_ids.index(user_id)
    except ValueError:
        return {
            "user_id": user_id,
            "recommended_cuisines": []
        }, 200
    
    user_similarities = similarity_matrix[target_idx]
    
    similar_users = []
    for i, sim_score in enumerate(user_similarities):
        if i != target_idx and sim_score > 0:
            similar_users.append((user_ids[i], sim_score))
    
    similar_users.sort(key=lambda x: x[1], reverse=True)
    
    target_cuisines = set(users[target_idx]['cuisines'])
    recommended_cuisines = set()
    
    for user_id, _ in similar_users:
        user_idx = user_ids.index(user_id)
        user_cuisines = set(users[user_idx]['cuisines'])
        
        new_cuisines = user_cuisines - target_cuisines
        recommended_cuisines.update(new_cuisines)
        
        if len(recommended_cuisines) >= 5:
            break
    
    return {
        "user_id": user_id,
        "recommended_cuisines": list(recommended_cuisines)
    }, 200