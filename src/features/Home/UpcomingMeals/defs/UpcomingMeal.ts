import MealPlan from '@defs/MealPlan'

// Meal plans don't store an image, so internal recipe meals are enriched with their recipe's image
type UpcomingMeal = MealPlan & {
    image?: string
}

export default UpcomingMeal
