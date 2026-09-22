import Button from '@atoms/Button/Button'
import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormProvider, useForm } from 'react-hook-form'
import { expect, fn } from 'storybook/test'
import SlidingFilters from './SlidingFilters'

type MinMaxRange = {
    min: number
    max: number
}

type FilterShape = {
    [s: string]: MinMaxRange | FilterShape
}

const flatFilters = {
    calories: { min: 0, max: 2000 },
    protein: { min: 0, max: 300 },
}

const nestedFilters = {
    nutrition: {
        calories: { min: 0, max: 2000 },
        protein: { min: 0, max: 300 },
    },
    time: {
        prepTime: { min: 0, max: 120 },
    },
}

const submitSpy = fn()

function StoryWrapper<T extends FilterShape>({ filters }: { filters: T }) {
    const methods = useForm()

    return (
        <Flex p={4} maxW={'500px'}>
            <FormProvider {...methods}>
                <form
                    noValidate
                    style={{ width: '100%' }}
                    onSubmit={(event) => {
                        event.preventDefault()
                        void methods.handleSubmit((values) => submitSpy(values))()
                    }}
                >
                    <VStack alignItems={'stretch'} gap={4}>
                        <SlidingFilters filters={filters} />
                        <Button type={'submit'}>Apply Filters</Button>
                    </VStack>
                </form>
            </FormProvider>
        </Flex>
    )
}

async function moveSlider(
    userEvent: { keyboard: (input: string) => Promise<void> },
    thumb: HTMLElement,
    key: 'ArrowRight' | 'ArrowLeft',
    times: number,
) {
    thumb.focus()

    for (let i = 0; i < times; i++) {
        await userEvent.keyboard(`{${key}}`)
    }
}

const meta: Meta<typeof SlidingFilters> = {
    title: 'Molecules/SlidingFilters',
    component: SlidingFilters,
}

export default meta
type Story = StoryObj<typeof SlidingFilters>

export const Flat: Story = {
    render: () => <StoryWrapper filters={flatFilters} />,
    play: async ({ canvas, userEvent }) => {
        submitSpy.mockClear()

        const [caloriesMin, caloriesMax, , proteinMax] = canvas.getAllByRole('slider')

        // calories step is 5 (range > 1000): 10 presses raises min by 50, 5 presses lowers max by 25
        await moveSlider(userEvent, caloriesMin, 'ArrowRight', 10)
        await moveSlider(userEvent, caloriesMax, 'ArrowLeft', 5)
        // protein step is 1 (range <= 1000): 20 presses lowers max by 20
        await moveSlider(userEvent, proteinMax, 'ArrowLeft', 20)

        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await expect(submitSpy).toHaveBeenCalledWith({
            calories: { min: 50, max: 1975 },
            protein: { min: 0, max: 280 },
        })
    },
}

export const Nested: Story = {
    render: () => <StoryWrapper filters={nestedFilters} />,
    play: async ({ canvas, userEvent }) => {
        submitSpy.mockClear()

        const [caloriesMin, , , , , prepTimeMax] = canvas.getAllByRole('slider')

        // nutrition.calories step is 5 (range > 1000): 20 presses raises min by 100
        await moveSlider(userEvent, caloriesMin, 'ArrowRight', 20)
        // time.prepTime step is 1 (range <= 1000): 30 presses lowers max by 30
        await moveSlider(userEvent, prepTimeMax, 'ArrowLeft', 30)

        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await expect(submitSpy).toHaveBeenCalledWith({
            nutrition: {
                calories: { min: 100, max: 2000 },
                protein: { min: 0, max: 300 },
            },
            time: {
                prepTime: { min: 0, max: 90 },
            },
        })
    },
}
