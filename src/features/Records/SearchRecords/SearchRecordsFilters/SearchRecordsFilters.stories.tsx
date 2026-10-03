import {
    Colour,
    Genre,
    RecordFormat,
    ReleaseType,
} from '@awjh/home-automation-v2-api-models/records'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    MockRecordSearchFilters,
    MockRecordSearchTags,
} from '@test/mockData/records/MockRecordSearchOptions'
import { expect, fn, type Mock, waitFor } from 'storybook/test'
import SearchRecordsFilters from './SearchRecordsFilters'

const meta: Meta<typeof SearchRecordsFilters> = {
    title: 'Features/Records/SearchRecords/SearchRecordsFilters',
    component: SearchRecordsFilters,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        tags: MockRecordSearchTags,
        filters: MockRecordSearchFilters,
        onApply: fn(),
        onCancel: fn(),
    },
}

export default meta
type Story = StoryObj<typeof SearchRecordsFilters>

function getPushedSearchParams() {
    const pushedUrl = (getRouter().push as unknown as Mock).mock.calls.at(-1)?.[0] as string

    return new URL(pushedUrl, 'http://localhost').searchParams
}

export const Default: Story = {
    play: async ({ canvas }) => {
        expect(canvas.getByText('Format')).toBeInTheDocument()
        expect(canvas.getByText('Release Type')).toBeInTheDocument()
    },
}

export const LoadsValuesFromQueryParams: Story = {
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                query: [
                    ['tags', JSON.stringify({ genres: [Genre.ROCK] })],
                    ['filters', JSON.stringify({ formats: [RecordFormat.SEVEN_INCH] })],
                ],
            },
        },
    },
    play: async ({ canvas }) => {
        expect(canvas.getByRole('button', { name: /^rock$/i })).toHaveAttribute(
            'data-status',
            'highlighted',
        )
        expect(canvas.getByRole('button', { name: /^7"$/ })).toHaveAttribute(
            'data-status',
            'highlighted',
        )
        expect(canvas.getByRole('button', { name: /^12"$/ })).toHaveAttribute(
            'data-status',
            'default',
        )
    },
}

export const AppliesOnlySelectedGroups: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /^red$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /^single$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => expect(getRouter().push).toHaveBeenCalled())

        const searchParams = getPushedSearchParams()
        expect(searchParams.get('tags')).toBe(JSON.stringify({ colours: [Colour.RED] }))
        expect(searchParams.get('filters')).toBe(JSON.stringify({ types: [ReleaseType.SINGLE] }))
    },
}

export const ClearingAllFiltersRemovesThemFromTheSearch: Story = {
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                query: [
                    ['keywords', 'rumours'],
                    ['tags', JSON.stringify({ genres: [Genre.ROCK] })],
                ],
            },
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /^rock$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => expect(getRouter().push).toHaveBeenCalled())

        const searchParams = getPushedSearchParams()
        expect(searchParams.get('keywords')).toBe('rumours')
        expect(searchParams.has('tags')).toBe(false)
        expect(searchParams.has('filters')).toBe(false)
    },
}

export const CancelResetsSelection: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const rock = canvas.getByRole('button', { name: /^rock$/i })

        await userEvent.click(rock)
        expect(rock).toHaveAttribute('data-status', 'highlighted')

        await userEvent.click(canvas.getByRole('button', { name: /^cancel$/i }))

        expect(args.onCancel).toHaveBeenCalled()
        expect(rock).toHaveAttribute('data-status', 'default')
    },
}
