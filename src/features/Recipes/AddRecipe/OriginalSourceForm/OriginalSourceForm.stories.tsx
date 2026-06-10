import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import OriginalSourceForm from './OriginalSourceForm'

const onNext = fn()
const onBack = fn()

const meta: Meta<typeof OriginalSourceForm> = {
    title: 'Features/AddRecipe/OriginalSourceForm',
    component: OriginalSourceForm,
    decorators: [(Story) => <Story />],
    args: {
        onNext,
        onBack,
    },
}

export default meta
type Story = StoryObj<typeof meta>

type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function selectSourceType(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
    sourceType: string,
) {
    await userEvent.selectOptions(
        canvas.getByLabelText(/where is the recipe originally from/i, {
            selector: 'select',
        }),
        sourceType,
    )
}

async function submitOnlineSource(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
) {
    await userEvent.type(
        canvas.getByLabelText(/url/i, { selector: 'input' }),
        'https://example.com/recipe',
    )
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function submitBookSource(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
) {
    await userEvent.type(
        canvas.getByLabelText(/book title/i, { selector: 'input' }),
        'The Recipe Book',
    )
    await userEvent.type(canvas.getByLabelText(/page number/i, { selector: 'input' }), '42')
    await userEvent.type(canvas.getByLabelText(/^series$/i, { selector: 'input' }), 'Series A')
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function submitMagazineSource(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
) {
    await userEvent.type(
        canvas.getByLabelText(/magazine title/i, { selector: 'input' }),
        'Food Monthly',
    )
    await userEvent.type(canvas.getByLabelText(/page number/i, { selector: 'input' }), '12')
    await userEvent.type(canvas.getByLabelText(/issue/i, { selector: 'input' }), 'Winter 2026')
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

export const Default: Story = {}

export const CanSubmitOnlineSource: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        await submitOnlineSource(canvas, userEvent)

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    sourceType: 'online',
                    title: '',
                    page: '',
                    series: '',
                    issue: '',
                    url: 'https://example.com/recipe',
                }),
            )
        })
    },
}

export const CanSubmitBookSource: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        await selectSourceType(canvas, userEvent, 'book')
        await submitBookSource(canvas, userEvent)

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    sourceType: 'book',
                    title: 'The Recipe Book',
                    page: '42',
                    series: 'Series A',
                    issue: '',
                    url: '',
                }),
            )
        })
    },
}

export const CanSubmitMagazineSource: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        await selectSourceType(canvas, userEvent, 'magazine')
        await submitMagazineSource(canvas, userEvent)

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    sourceType: 'magazine',
                    title: 'Food Monthly',
                    page: '12',
                    series: '',
                    issue: 'Winter 2026',
                    url: '',
                }),
            )
        })
    },
}

export const ValidatesOnlineSource: Story = {
    play: async ({ canvas, userEvent }) => {
        onNext.mockClear()
        onBack.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/url is required/i)).toBeInTheDocument()
        })
    },
}

export const ValidatesBookSource: Story = {
    play: async ({ canvas, userEvent }) => {
        onNext.mockClear()
        onBack.mockClear()

        await selectSourceType(canvas, userEvent, 'book')
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/book title is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/page number is required/i)).toBeInTheDocument()
        })
    },
}

export const ValidatesMagazineSource: Story = {
    play: async ({ canvas, userEvent }) => {
        onNext.mockClear()
        onBack.mockClear()

        await selectSourceType(canvas, userEvent, 'magazine')
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/magazine title is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/page number is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/issue is required/i)).toBeInTheDocument()
        })
    },
}
