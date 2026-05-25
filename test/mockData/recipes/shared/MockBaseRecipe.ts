import { Cuisine, MealType, Meat, Recipe } from '@awjh/home-automation-v2-api-models/recipes'

const MockBaseRecipe: Omit<Recipe, 'id' | 'originalSource'> = {
    title: 'Spaghetti Bolognese',
    authors: ['John Doe', 'Jane Smith'],
    calories: 600,
    duration: {
        prepDuration: 15,
        cookingDuration: 45,
        standingTime: 0,
    },
    ingredients: [
        {
            section: 'For the bolognese',
            ingredients: [
                {
                    quantity: 2,
                    item: 'onions',
                    preparation: 'finely diced',
                },
                {
                    quantity: 2,
                    measure: 'tbsp',
                    item: 'olive oil',
                },
                {
                    quantity: 500,
                    measure: 'g',
                    item: 'beef mince',
                },
                {
                    quantity: 3,
                    item: 'garlic cloves',
                    preparation: 'crushed',
                },
                {
                    quantity: 2,
                    measure: 'tbsp',
                    item: 'tomato puree',
                },
                {
                    quantity: 400,
                    measure: 'g',
                    item: 'chopped tomatoes',
                },
                {
                    quantity: 250,
                    measure: 'ml',
                    item: 'beef stock',
                },
                {
                    quantity: 1,
                    measure: 'tsp',
                    item: 'dried oregano',
                    internalRecipe: {
                        recipeId: '03fed5d4-2636-45aa-8e4a-fae4a0d14cb4',
                    },
                },
            ],
        },
        {
            ingredients: [
                {
                    quantity: 400,
                    measure: 'g',
                    item: 'spaghetti',
                },
                {
                    quantity: 30,
                    measure: 'g',
                    item: 'parmesan',
                    preparation: 'finely grated',
                },
                {
                    quantity: 1,
                    measure: 'small handful',
                    item: 'basil leaves',
                    preparation: 'torn',
                },
            ],
        },
    ],
    method: [
        {
            text: 'Heat the olive oil in a large saucepan, then soften the onions for 6 to 8 minutes before stirring in the garlic.',
            ingredients: [
                {
                    quantity: 2,
                    item: 'onions',
                    preparation: 'finely diced',
                },
                {
                    quantity: 2,
                    measure: 'tbsp',
                    item: 'olive oil',
                },
                {
                    quantity: 3,
                    item: 'garlic cloves',
                    preparation: 'crushed',
                },
            ],
        },
        {
            text: 'Add the beef mince and cook until browned, then stir through the tomato puree, chopped tomatoes, stock and oregano. Simmer gently for 35 to 40 minutes until rich and reduced.',
            ingredients: [
                {
                    quantity: 500,
                    measure: 'g',
                    item: 'beef mince',
                },
                {
                    quantity: 2,
                    measure: 'tbsp',
                    item: 'tomato puree',
                },
                {
                    quantity: 400,
                    measure: 'g',
                    item: 'chopped tomatoes',
                },
                {
                    quantity: 250,
                    measure: 'ml',
                    item: 'beef stock',
                },
                {
                    quantity: 1,
                    measure: 'tsp',
                    item: 'dried oregano',
                },
            ],
        },
        {
            text: 'Cook the spaghetti in well-salted boiling water until al dente, then serve with the sauce, parmesan and basil over the top.',
            ingredients: [
                {
                    quantity: 400,
                    measure: 'g',
                    item: 'spaghetti',
                },
                {
                    quantity: 30,
                    measure: 'g',
                    item: 'parmesan',
                    preparation: 'finely grated',
                },
                {
                    quantity: 1,
                    measure: 'small handful',
                    item: 'basil leaves',
                    preparation: 'torn',
                },
            ],
        },
    ],
    produces: {
        serves: 4,
    },
    tags: {
        cuisine: [Cuisine.ITALIAN],
        mealType: [MealType.LUNCH],
        meat: [Meat.BEEF],
        dietary: [],
        occasion: [],
        equipment: [],
    },
}

export default MockBaseRecipe
