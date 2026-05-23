import MealPlan from '@defs/MealPlan'

type MealPlanSource = MealPlan['source']

type MealPlanOverrides<TSource extends MealPlanSource = MealPlanSource> = Partial<
    Omit<MealPlan, 'duration' | 'source'>
> & {
    duration?: Partial<MealPlan['duration']>
    source?: Partial<TSource>
}

export default function createMealPlanFixture<TSource extends MealPlanSource>(
    baseMealPlan: MealPlan & { source: TSource },
    overrides: MealPlanOverrides<TSource> = {},
): MealPlan {
    const { duration, source, ...restOverrides } = overrides

    return {
        ...baseMealPlan,
        ...restOverrides,
        duration: duration ? { ...baseMealPlan.duration, ...duration } : baseMealPlan.duration,
        source: source ? { ...baseMealPlan.source, ...source } : baseMealPlan.source,
    }
}