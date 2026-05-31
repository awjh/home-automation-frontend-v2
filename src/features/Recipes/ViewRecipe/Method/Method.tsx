import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { Grid, GridItem } from '@chakra-ui/react'
import { Fragment } from 'react/jsx-runtime'
import MethodStep from '../MethodStep/MethodStep'
import useColorMode from '@hooks/useColorMode'

export interface MethodProps {
    steps: {
        method: string
        ingredients: Ingredient[]
    }[]
}

export default function Method({ steps }: MethodProps) {
    const { keyColors } = useColorMode()

    return (
        <Grid w={'full'} gap={4} templateColumns={'max-content 1fr'}>
            {steps.map((step, index) => (
                <Fragment key={`step-${index}`}>
                    <GridItem color={keyColors.primary}>{`${index + 1}`.padStart(2, '0')}</GridItem>
                    <GridItem>
                        <MethodStep method={step.method} ingredients={step.ingredients} />
                    </GridItem>
                </Fragment>
            ))}
        </Grid>
    )
}
