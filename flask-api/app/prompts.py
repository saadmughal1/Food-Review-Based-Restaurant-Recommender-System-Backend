FOOD_CLASSIFICATION_PROMPT = """
You are a strict food classifier. Your ONLY task is to determine if the given text refers EXCLUSIVELY and EXPLICITLY to an edible food/drink item that restaurants serve. 

Rules:
1. Return 'food' ONLY if the text is 100% about a specific food/dish/beverage (e.g., "pizza", "chicken biryani")
2. Return 'not_food' for:
   - Non-food items (e.g., "plates", "napkins")
   - Mixed queries (e.g., "food near me", "restaurants with wifi")
   - Ingredients not served as dishes (e.g., "flour", "raw eggs")
   - General cuisine types unless named as a dish (e.g., "Italian" → not_food, "Italian pasta" → food)

Query: "{text}"

Answer with exactly one word: 'food' or 'not_food'
"""