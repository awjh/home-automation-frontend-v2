import { Genre } from '@awjh/home-automation-v2-api-models/records'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecordSearchResult from '@test/mockData/records/MockRecordSearchResult'
import {
    MockRecordSearchFilters,
    MockRecordSearchTags,
} from '@test/mockData/records/MockRecordSearchOptions'
import { expect, fn, type Mock, waitFor } from 'storybook/test'
import SearchRecords from './SearchRecords'

const recordList = [
    MockRecordSearchResult,
    { ...MockRecordSearchResult, id: 'record-2', title: 'Tusk', image: undefined },
    { ...MockRecordSearchResult, id: 'record-3', title: 'Mirage' },
]

const meta: Meta<typeof SearchRecords> = {
    title: 'Features/Records/SearchRecords',
    component: SearchRecords,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        tags: MockRecordSearchTags,
        filters: MockRecordSearchFilters,
        records: recordList,
        loadNextRecordsPage: fn(),
    },
}

export default meta
type Story = StoryObj<typeof SearchRecords>

export const Default: Story = {}

const fullFirstPage = Array.from({ length: 15 }, (_, index) => ({
    ...MockRecordSearchResult,
    id: `record-page-1-${index}`,
    title: `First Page Record ${index + 1}`,
}))

const lastPage = Array.from({ length: 3 }, (_, index) => ({
    ...MockRecordSearchResult,
    id: `record-page-2-${index}`,
    title: `Last Page Record ${index + 1}`,
}))

export const LoadsNextPage: Story = {
    args: {
        records: fullFirstPage,
        loadNextRecordsPage: fn(async () => lastPage),
    },
    play: async ({ args, canvas, userEvent }) => {
        expect(canvas.getByRole('heading', { name: 'Search Results (15+)' })).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^load more$/i }))

        expect(args.loadNextRecordsPage).toHaveBeenCalledWith('record-page-1-14')
        await waitFor(() =>
            expect(
                canvas.getByRole('heading', { name: 'Search Results (18)' }),
            ).toBeInTheDocument(),
        )
        expect(canvas.getByRole('heading', { name: /^Last Page Record 3 - / })).toBeInTheDocument()
        // A short page means there is nothing left to load
        expect(canvas.queryByRole('button', { name: /^load more$/i })).not.toBeInTheDocument()
    },
}

export const HidesLoadMoreWhenFirstPageIsNotFull: Story = {
    play: async ({ canvas }) => {
        expect(canvas.getByRole('heading', { name: 'Search Results (3)' })).toBeInTheDocument()
        expect(canvas.queryByRole('button', { name: /^load more$/i })).not.toBeInTheDocument()
    },
}

export const TogglesFiltersAndAppliesThem: Story = {
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()

        await userEvent.click(canvas.getByRole('button', { name: 'toggle-record-filters' }))
        await userEvent.click(canvas.getByRole('button', { name: /^rock$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.searchParams.get('tags')).toBe(JSON.stringify({ genres: [Genre.ROCK] }))
        expect(canvas.getByRole('button', { name: 'close-record-filters' })).toBeInTheDocument()
    },
}

export const TogglesFiltersAndHidesWithArrow: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'toggle-record-filters' }))

        expect(canvas.getByRole('button', { name: /apply filters/i })).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: 'close-record-filters' }))

        expect(canvas.queryByRole('button', { name: /apply filters/i })).not.toBeInTheDocument()
        expect(canvas.getByRole('button', { name: 'toggle-record-filters' })).toBeInTheDocument()
    },
}

export const TogglesFiltersAndHidesWithCancel: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'toggle-record-filters' }))
        await userEvent.click(canvas.getByRole('button', { name: /^cancel$/i }))

        expect(canvas.queryByRole('button', { name: /apply filters/i })).not.toBeInTheDocument()
        expect(canvas.getByRole('button', { name: 'toggle-record-filters' })).toBeInTheDocument()
    },
}

export const SearchesUsingKeywords: Story = {
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()

        await userEvent.type(canvas.getByRole('textbox', { name: /search keywords/i }), 'rumours')
        await userEvent.click(canvas.getByRole('button', { name: /^search$/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.searchParams.get('keywords')).toBe('rumours')
    },
}

const mobileViewport = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    globals: {
        viewport: {
            value: 'mobile1',
            isRotated: false,
        },
    },
}

export const SwitchesBetweenFiltersAndResultsTabsOnSmallScreens: Story = {
    ...mobileViewport,
    play: async ({ canvas, canvasElement, userEvent }) => {
        expect(canvasElement.querySelector('[data-active-tab="Results"]')).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^filters$/i }))

        expect(canvasElement.querySelector('[data-active-tab="Filters"]')).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^results/i }))

        expect(canvasElement.querySelector('[data-active-tab="Results"]')).toBeInTheDocument()
    },
}

export const CancellingFiltersOnSmallScreensReturnsToResultsTab: Story = {
    ...mobileViewport,
    play: async ({ canvas, canvasElement, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /^filters$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /^cancel$/i }))

        await waitFor(() => {
            expect(canvasElement.querySelector('[data-active-tab="Results"]')).toBeInTheDocument()
        })
    },
}

export const ApplyingFiltersOnSmallScreensReturnsToResultsTab: Story = {
    ...mobileViewport,
    play: async ({ canvas, canvasElement, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /^filters$/i }))

        expect(canvasElement.querySelector('[data-active-tab="Filters"]')).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => {
            expect(canvasElement.querySelector('[data-active-tab="Results"]')).toBeInTheDocument()
        })
        expect(getRouter().push).toHaveBeenCalled()
    },
}
