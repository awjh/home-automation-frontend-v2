import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { useMemo } from 'react'
import UpcomingMeal from './defs/UpcomingMeal'
import MealPlanResult from './MealPlanResult/MealPlanResult'
import sortUpcomingMeals from './utils/sortUpcomingMeals'

export interface UpcomingMealsProps {
    meals: UpcomingMeal[]
}

export default function UpcomingMeals({ meals }: UpcomingMealsProps) {
    const { keyColors } = useColorMode()
    const sortedMeals = useMemo(() => sortUpcomingMeals(meals), [meals])

    return (
        <VStack w={'full'} alignItems={'stretch'} gap={4} px={4}>
            <Box w={'full'} borderBottomWidth={2} borderColor={keyColors.primary}>
                <Heading
                    as={'h2'}
                    size={{ base: 'lg', xl: 'xl' }}
                    fontWeight={'normal'}
                    textAlign={'left'}
                    color={keyColors.primary}
                    pt={6}
                    pb={2}
                >
                    Upcoming meals
                </Heading>
            </Box>
            {sortedMeals.length === 0 ? (
                <Text color={keyColors.primary} px={{ base: 2, sm: 3, md: 4 }}>
                    No upcoming meals planned.
                </Text>
            ) : (
                // Mobile: a single row that scrolls horizontally inside its own box so the page
                // never widens. Desktop: a grid that wraps across the screen.
                <Box
                    data-testid={'upcoming-meals-list'}
                    w={'full'}
                    minW={0}
                    scrollPaddingInline={4}
                    pb={4}
                    display={{ base: 'flex', md: 'grid' }}
                    flexWrap={'nowrap'}
                    overflowX={{ base: 'auto', md: 'visible' }}
                    scrollSnapType={{ base: 'x mandatory', md: 'none' }}
                    gridTemplateColumns={'repeat(auto-fill, minmax(240px, 1fr))'}
                    gap={{ base: 4, md: 6 }}
                >
                    {sortedMeals.map((mealPlan) => (
                        <Box
                            key={`${mealPlan.date}-${mealPlan.mealTime}-${mealPlan.course}`}
                            flex={{ base: '0 0 42%', sm: '0 0 26%' }}
                            w={{ md: '90%' }}
                            scrollSnapAlign={'start'}
                            minW={0}
                        >
                            <MealPlanResult mealPlan={mealPlan} />
                        </Box>
                    ))}
                </Box>
            )}
        </VStack>
    )
}
