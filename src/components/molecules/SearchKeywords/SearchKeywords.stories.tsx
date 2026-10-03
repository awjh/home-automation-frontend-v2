import type { Meta, StoryObj } from '@storybook/react-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, type Mock, waitFor } from 'storybook/test'
import SearchKeywords from './SearchKeywords'

const meta: Meta<typeof SearchKeywords> = {
    title: 'Molecules/SearchKeywords',
    component: SearchKeywords,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
}

export default meta
type Story = StoryObj<typeof SearchKeywords>

export const Default: Story = {
    play: async ({ canvas }) => {
        const input = canvas.getByRole('textbox', { name: /search keywords/i })
        const button = canvas.getByRole('button', { name: /search/i })

        expect(input).toHaveValue('')
        expect(button).toBeInTheDocument()
    },
}

const initialValuesQueryParams = [
    ['keywords', 'chicken'],
    ['keywords', 'soup'],
]

export const InitialValuesFromSearchParams: Story = {
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/recipes',
                query: initialValuesQueryParams,
            },
        },
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole('textbox', { name: /search keywords/i })

        await waitFor(() => {
            expect(input).toHaveValue('chicken soup')
        })
    },
}

export const SubmitWithNoExistingParams: Story = {
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/recipes',
            },
        },
    },
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()
        const input = canvas.getByRole('textbox', { name: /search keywords/i })

        await userEvent.clear(input)
        await userEvent.type(input, 'quick easy dinner')
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())
        await waitFor(() => expect(router.refresh).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.pathname).toBe('/recipes')
        expect(resolvedUrl.searchParams.getAll('keywords')).toEqual(['quick', 'easy', 'dinner'])
    },
}

const existingParams = [
    ['page', '3'],
    ['sort', 'latest'],
    ['tags', JSON.stringify({ cuisine: 'thai' })],
    ['keywords', 'old'],
    ['keywords', 'keywords'],
]

export const SubmitWithExistingParams: Story = {
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/recipes',
                query: existingParams,
            },
        },
    },
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()
        const input = canvas.getByRole('textbox', { name: /search keywords/i })

        await userEvent.clear(input)
        await userEvent.type(input, 'new keyword set')
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.pathname).toBe('/recipes')
        expect(resolvedUrl.searchParams.getAll('keywords')).toEqual(['new', 'keyword', 'set'])
        expect(resolvedUrl.searchParams.get('page')).toBe('3')
        expect(resolvedUrl.searchParams.get('sort')).toBe('latest')
        expect(resolvedUrl.searchParams.get('tags')).toBe(JSON.stringify({ cuisine: 'thai' }))
    },
}
