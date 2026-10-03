import {
    Colour,
    Genre,
    RecordFormat,
    ReleaseType,
} from '@awjh/home-automation-v2-api-models/records'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import MockExternalRecords from '@test/mockData/records/MockExternalRecords'
import MockRecordLookup from '@test/mockData/records/MockRecordLookup'
import { expect, fn, waitFor, within } from 'storybook/test'
import AddRecord from './AddRecord'

const meta: Meta<typeof AddRecord> = {
    title: 'Features/Records/AddRecord/AddRecord',
    component: AddRecord,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        searchExternalRecords: fn(async () => MockExternalRecords),
        getExternalRecord: fn(async () => MockRecordLookup),
        addRecord: fn(async () => ({ id: '3f1c2b8e-5d4a-4c6b-9e7f-1a2b3c4d5e6f' })),
        uploadRecordImage: fn(async () => ({ key: 'uploaded-image-key' })),
    },
}

export default meta

type Story = StoryObj<typeof AddRecord>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function clickNext(canvas: PlayContext['canvas'], userEvent: PlayContext['userEvent']) {
    await userEvent.click(canvas.getByRole('button', { name: /^(next|finish)$/i }))
}

async function searchAndSelectFirstRelease(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
) {
    await userEvent.type(
        canvas.getByLabelText(/catalogue number/i, { selector: 'input' }),
        'K 56344',
    )
    await userEvent.click(canvas.getByRole('button', { name: /search/i }))

    const release = await canvas.findByTestId(
        `external-record-${MockExternalRecords[0].musicBrainzId}`,
    )
    await userEvent.click(within(release).getByRole('button', { name: /^select$/i }))

    await waitFor(() => {
        expect(within(release).getByRole('button', { name: /^selected$/i })).toBeInTheDocument()
    })
}

async function waitForStep(
    canvas: PlayContext['canvas'],
    step: number,
    { mode, stepCount }: { mode: 'Add' | 'Edit'; stepCount: number } = {
        mode: 'Add',
        stepCount: 5,
    },
) {
    await waitFor(() => {
        expect(canvas.getByText(`${mode} Record (${step} of ${stepCount})`)).toBeInTheDocument()
    })
}

export const Default: Story = {}

export const RequiresCatalogueNumber: Story = {
    play: async ({ canvas, userEvent }) => {
        await clickNext(canvas, userEvent)

        await waitFor(() => {
            expect(canvas.getByText('Catalogue number is required')).toBeInTheDocument()
        })
        expect(canvas.getByText('Add Record (1 of 5)')).toBeInTheDocument()
    },
}

export const SearchFillsInRecordDetails: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await searchAndSelectFirstRelease(canvas, userEvent)

        expect(args.searchExternalRecords).toHaveBeenCalledWith('K 56344')
        expect(args.getExternalRecord).toHaveBeenCalledWith(MockExternalRecords[0].musicBrainzId)

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 2)

        expect(canvas.getByLabelText(/^title/i, { selector: 'input' })).toHaveValue('Rumours')
        expect(canvas.getByLabelText(/^artist/i, { selector: 'input' })).toHaveValue(
            'Fleetwood Mac',
        )
        expect(canvas.getByLabelText(/^year/i, { selector: 'input' })).toHaveValue(1977)

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 3)
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 4)

        expect(canvas.getByText('Side A')).toBeInTheDocument()
        expect(canvas.getByText('Side B')).toBeInTheDocument()
        expect(canvas.getByDisplayValue('Dreams')).toBeInTheDocument()
        expect(canvas.getByDisplayValue('04:14')).toBeInTheDocument()

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 5)

        expect(canvas.getByRole('button', { name: /^rock$/i })).toHaveAttribute(
            'data-status',
            'highlighted',
        )

        await clickNext(canvas, userEvent)

        await waitFor(() => {
            expect(args.addRecord).toHaveBeenCalledWith({
                ...MockRecordLookup,
                catNo: 'K 56344',
                image: undefined,
            })
        })
    },
}

export const SearchKeepsResultsWhenGoingBack: Story = {
    play: async ({ canvas, userEvent }) => {
        await searchAndSelectFirstRelease(canvas, userEvent)

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 2)
        await userEvent.click(canvas.getByRole('button', { name: /^back$/i }))
        await waitForStep(canvas, 1)

        const release = canvas.getByTestId(
            `external-record-${MockExternalRecords[0].musicBrainzId}`,
        )
        expect(within(release).getByRole('button', { name: /^selected$/i })).toBeInTheDocument()
        expect(
            canvas.getByTestId(`external-record-${MockExternalRecords[1].musicBrainzId}`),
        ).toBeInTheDocument()
    },
}

export const SearchPrefillsArtwork: Story = {
    args: {
        getExternalRecord: fn(async () => ({
            ...MockRecordLookup,
            imageUrl: 'https://coverartarchive.org/release/0b6d4d55/front',
        })),
    },
    play: async ({ args, canvas, userEvent }) => {
        await searchAndSelectFirstRelease(canvas, userEvent)

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 2)
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 3)

        expect(canvas.getByLabelText(/^image url/i, { selector: 'input' })).toHaveValue(
            'https://coverartarchive.org/release/0b6d4d55/front',
        )

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 4)
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 5)
        await clickNext(canvas, userEvent)

        await waitFor(() => {
            expect(args.uploadRecordImage).toHaveBeenCalledWith({
                source: 'url',
                url: 'https://coverartarchive.org/release/0b6d4d55/front',
            })
            expect(args.addRecord).toHaveBeenCalledWith(
                expect.objectContaining({ image: 'uploaded-image-key' }),
            )
        })
    },
}

export const CanEnterRecordManually: Story = {
    args: {
        searchExternalRecords: fn(async () => []),
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(
            canvas.getByLabelText(/catalogue number/i, { selector: 'input' }),
            'SAM 001',
        )
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 2)

        await userEvent.type(canvas.getByLabelText(/^title/i, { selector: 'input' }), 'Demo')
        await userEvent.type(canvas.getByLabelText(/^artist/i, { selector: 'input' }), 'Sam')
        await userEvent.type(canvas.getByLabelText(/^label/i, { selector: 'input' }), 'Self')
        await userEvent.type(canvas.getByLabelText(/^year/i, { selector: 'input' }), '2024')
        await userEvent.selectOptions(
            canvas.getByLabelText(/release type/i, { selector: 'select' }),
            ReleaseType.SINGLE,
        )
        await userEvent.selectOptions(
            canvas.getByLabelText(/format/i, { selector: 'select' }),
            RecordFormat.SEVEN_INCH,
        )
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 3)
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 4)

        const [sideATitle] = canvas.getAllByLabelText(/^new track title/i, { selector: 'input' })
        const [sideADuration] = canvas.getAllByLabelText(/^new track duration/i, {
            selector: 'input',
        })
        await userEvent.type(sideATitle, 'First Song')
        await userEvent.type(sideADuration, '3:05{Enter}')

        await waitFor(() => {
            expect(canvas.getByDisplayValue('First Song')).toBeInTheDocument()
        })

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 5)

        await userEvent.click(canvas.getByRole('button', { name: /^pop$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /^red$/i }))
        await clickNext(canvas, userEvent)

        await waitFor(() => {
            expect(args.addRecord).toHaveBeenCalledWith({
                catNo: 'SAM 001',
                title: 'Demo',
                artists: ['Sam'],
                labels: ['Self'],
                year: 2024,
                type: ReleaseType.SINGLE,
                format: RecordFormat.SEVEN_INCH,
                image: undefined,
                // The empty side B is dropped
                sides: [{ name: 'A', songs: [{ title: 'First Song', duration: 185 }] }],
                tags: { genres: [Genre.POP], colours: [Colour.RED] },
            })
        })
    },
}

const editArgs = {
    record: MockRecord,
    editRecord: fn(async () => ({ id: MockRecord.id })),
    addRecord: undefined,
    uploadRecordImage: undefined,
}

const editStep = { mode: 'Edit', stepCount: 4 } as const

export const EditPrefillsExistingRecord: Story = {
    args: editArgs,
    play: async ({ canvas, userEvent }) => {
        await waitForStep(canvas, 1, editStep)

        expect(canvas.getByLabelText(/catalogue number/i, { selector: 'input' })).toHaveValue(
            MockRecord.catNo,
        )

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 2, editStep)

        expect(canvas.getByLabelText(/^title/i, { selector: 'input' })).toHaveValue('Rumours')
        expect(canvas.getByLabelText(/^label/i, { selector: 'input' })).toHaveValue(
            'Warner Bros. Records',
        )

        // Editing skips the image step and goes straight to tracks
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 3, editStep)

        expect(canvas.getByDisplayValue('Gold Dust Woman')).toBeInTheDocument()
    },
}

export const EditSavesChangesAndKeepsArtwork: Story = {
    args: editArgs,
    play: async ({ args, canvas, userEvent }) => {
        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 2, editStep)

        const title = canvas.getByLabelText(/^title/i, { selector: 'input' })
        await userEvent.clear(title)
        await userEvent.type(title, 'Rumours (Remastered)')

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 3, editStep)

        await userEvent.click(canvas.getByTestId('delete-track-button-1-4'))
        await waitFor(() => {
            expect(canvas.queryByDisplayValue('Gold Dust Woman')).not.toBeInTheDocument()
        })

        await clickNext(canvas, userEvent)
        await waitForStep(canvas, 4, editStep)

        await userEvent.click(canvas.getByRole('button', { name: /^blue$/i }))
        await clickNext(canvas, userEvent)

        await waitFor(() => {
            expect(args.editRecord).toHaveBeenCalledWith(MockRecord.id, {
                catNo: MockRecord.catNo,
                title: 'Rumours (Remastered)',
                artists: MockRecord.artists,
                labels: MockRecord.labels,
                year: MockRecord.year,
                type: MockRecord.type,
                format: MockRecord.format,
                image: MockRecord.image,
                sides: [
                    MockRecord.sides[0],
                    { name: 'B', songs: MockRecord.sides[1].songs.slice(0, 4) },
                ],
                tags: { genres: [Genre.ROCK], colours: [Colour.BLACK, Colour.BLUE] },
            })
        })
    },
}
