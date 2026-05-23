import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import MealPlan from '@defs/MealPlan'
import createMealPlanFixture from './createMealPlanFixture'

type MealPlanSource = MealPlan['source']

type MealPlanOverrides<TSource extends MealPlanSource = MealPlanSource> = Partial<
    Omit<MealPlan, 'duration' | 'source'>
> & {
    duration?: Partial<MealPlan['duration']>
    source?: Partial<TSource>
}

export default function createPostMealPlanFixture<TSource extends MealPlanSource>(
    baseMealPlan: MealPlan & { source: TSource },
    overrides: MealPlanOverrides<TSource> = {},
): PostMealPlanBody {
    return createMealPlanFixture(baseMealPlan, overrides)
}