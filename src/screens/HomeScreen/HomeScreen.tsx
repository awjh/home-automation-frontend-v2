'use client'

import { VStack } from '@chakra-ui/react'
import UpcomingMeal from '@features/Home/UpcomingMeals/defs/UpcomingMeal'
import UpcomingMeals from '@features/Home/UpcomingMeals/UpcomingMeals'
import NavBar from '@features/NavBar/NavBar'

export interface HomeScreenProps {
    upcomingMeals: UpcomingMeal[]
}

export default function HomeScreen({ upcomingMeals }: HomeScreenProps) {
    return (
        <VStack w={'full'} gap={0} overflowX={'hidden'}>
            <NavBar />
            <UpcomingMeals meals={upcomingMeals} />
        </VStack>
    )
}
