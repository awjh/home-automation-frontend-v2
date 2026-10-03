import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockExternalRecords from '@test/mockData/records/MockExternalRecords'
import { expect, fn, screen, waitFor, within } from 'storybook/test'
import CatalogueNumberForm from './CatalogueNumberForm'

const meta: Meta<typeof CatalogueNumberForm> = {
    title: 'Features/Records/AddRecord/steps/CatalogueNumberForm',
    component: CatalogueNumberForm,
    decorators: [
        (Story) => (
            <Box p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        searchByCatalogueNumber: fn(async () => MockExternalRecords),
        selectExternalRecord: fn(async () => {}),
        isLookupLoading: fn(),
        onSubmitStep: fn(),
    },
}

export default meta
type Story = StoryObj<typeof CatalogueNumberForm>

export const Default: Story = {}

export const RequiresCatalogueNumberToSearch: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const searchButton = canvas.getByRole('button', { name: /search/i })
        const input = canvas.getByLabelText(/catalogue number/i, { selector: 'input' })
        const buttonTopBeforeError = searchButton.getBoundingClientRect().top

        await userEvent.click(searchButton)

        await waitFor(() => {
            expect(canvas.getByText('Catalogue number is required')).toBeInTheDocument()
        })
        expect(args.searchByCatalogueNumber).not.toHaveBeenCalled()

        // The button stays level with the input rather than moving down with the error text
        expect(searchButton.getBoundingClientRect().top).toBe(buttonTopBeforeError)
        expect(searchButton.getBoundingClientRect().top).toBeCloseTo(
            input.getBoundingClientRect().top,
            0,
        )
    },
}

export const SearchesTrimmedCatalogueNumber: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(
            canvas.getByLabelText(/catalogue number/i, { selector: 'input' }),
            '  K 56344 {Enter}',
        )

        await waitFor(() => {
            expect(args.searchByCatalogueNumber).toHaveBeenCalledWith('K 56344')
            expect(args.onSubmitStep).toHaveBeenCalledWith({ catNo: 'K 56344' })
        })
    },
}

export const ListsMatchingReleases: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(
            canvas.getByLabelText(/catalogue number/i, { selector: 'input' }),
            'K 56344{Enter}',
        )

        const original = await canvas.findByTestId(
            `external-record-${MockExternalRecords[0].musicBrainzId}`,
        )
        expect(within(original).getByText('Rumours - Fleetwood Mac')).toBeInTheDocument()
        expect(
            within(original).getByText('Warner Bros. Records · K 56344 · 1977-02-04 · GB'),
        ).toBeInTheDocument()

        const reissue = canvas.getByTestId(
            `external-record-${MockExternalRecords[1].musicBrainzId}`,
        )
        expect(within(reissue).getByText('12" · 11 tracks · red vinyl')).toBeInTheDocument()
        expect(within(reissue).getByText('red')).toBeInTheDocument()
    },
}

export const SelectsRelease: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(
            canvas.getByLabelText(/catalogue number/i, { selector: 'input' }),
            'K 56344{Enter}',
        )

        const reissue = await canvas.findByTestId(
            `external-record-${MockExternalRecords[1].musicBrainzId}`,
        )
        await userEvent.click(within(reissue).getByRole('button', { name: /^select$/i }))

        await waitFor(() => {
            expect(args.selectExternalRecord).toHaveBeenCalledWith(
                MockExternalRecords[1].musicBrainzId,
            )
            expect(within(reissue).getByRole('button', { name: /^selected$/i })).toBeInTheDocument()
            expect(screen.getByText('Record details filled in')).toBeInTheDocument()
        })
    },
}

export const ShowsWhenSelectingFails: Story = {
    args: {
        selectExternalRecord: fn(async () => {
            throw new Error('Failed to fetch record details')
        }),
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(
            canvas.getByLabelText(/catalogue number/i, { selector: 'input' }),
            'K 56344{Enter}',
        )

        const original = await canvas.findByTestId(
            `external-record-${MockExternalRecords[0].musicBrainzId}`,
        )
        await userEvent.click(within(original).getByRole('button', { name: /^select$/i }))

        await waitFor(() => {
            expect(screen.getByText('Failed to get record details')).toBeInTheDocument()
        })
        expect(within(original).getByRole('button', { name: /^select$/i })).toBeInTheDocument()
    },
}

export const ShowsWhenNothingMatches: Story = {
    args: {
        searchByCatalogueNumber: fn(async () => []),
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(
            canvas.getByLabelText(/catalogue number/i, { selector: 'input' }),
            'UNKNOWN 1',
        )
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => {
            expect(screen.getByText('No record found')).toBeInTheDocument()
        })
    },
}
