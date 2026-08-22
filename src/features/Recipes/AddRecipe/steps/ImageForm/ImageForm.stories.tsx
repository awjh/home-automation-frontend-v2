import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import ImageForm, { HasImageOption, ImageSourceOption } from './ImageForm'

const onSubmitStep = fn()

const meta: Meta<typeof ImageForm> = {
    title: 'Features/Recipes/AddRecipe/AddRecipeForm/steps/ImageForm',
    component: ImageForm,
    decorators: [(Story) => <Story />],
    args: {
        onSubmitStep,
    },
}

export default meta
type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

function submitCurrentForm(canvasElement: HTMLElement) {
    const form = canvasElement.querySelector('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form as HTMLFormElement)
}

export const DefaultsToNoImage: Story = {
    play: async ({ canvas, canvasElement }) => {
        onSubmitStep.mockClear()

        expect(
            canvas.queryByLabelText(/how would you like to provide the image/i, {
                selector: 'select',
            }),
        ).not.toBeInTheDocument()

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onSubmitStep).toHaveBeenCalledWith(
                expect.objectContaining({ hasImage: HasImageOption.NO }),
            )
        })
    },
}

export const CanProvideImageByUrl: Story = {
    play: async ({ canvas, canvasElement, userEvent }) => {
        onSubmitStep.mockClear()

        await userEvent.selectOptions(
            canvas.getByLabelText(/would you like to add an image/i, { selector: 'select' }),
            HasImageOption.YES,
        )

        await waitFor(() => {
            expect(canvas.getByLabelText(/image url/i, { selector: 'input' })).toBeInTheDocument()
        })

        await userEvent.type(
            canvas.getByLabelText(/image url/i, { selector: 'input' }),
            'https://example.com/lasagne.jpg',
        )

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onSubmitStep).toHaveBeenCalledWith(
                expect.objectContaining({
                    hasImage: HasImageOption.YES,
                    imageSource: ImageSourceOption.URL,
                    imageUrl: 'https://example.com/lasagne.jpg',
                }),
            )
        })
    },
}

export const CanProvideImageByUpload: Story = {
    play: async ({ canvas, canvasElement, userEvent }) => {
        onSubmitStep.mockClear()

        await userEvent.selectOptions(
            canvas.getByLabelText(/would you like to add an image/i, { selector: 'select' }),
            HasImageOption.YES,
        )

        await userEvent.selectOptions(
            canvas.getByLabelText(/how would you like to provide the image/i, {
                selector: 'select',
            }),
            ImageSourceOption.UPLOAD,
        )

        const file = new File(['image-bytes'], 'lasagne.jpg', { type: 'image/jpeg' })

        await userEvent.upload(canvas.getByLabelText(/image file/i), file)

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onSubmitStep).toHaveBeenCalledWith(
                expect.objectContaining({
                    hasImage: HasImageOption.YES,
                    imageSource: ImageSourceOption.UPLOAD,
                    imageFile: file,
                }),
            )
        })
    },
}

export const ShowsValidationErrorsWhenRequiredFieldsAreMissing: Story = {
    play: async ({ canvas, canvasElement, userEvent }) => {
        onSubmitStep.mockClear()

        await userEvent.selectOptions(
            canvas.getByLabelText(/would you like to add an image/i, { selector: 'select' }),
            HasImageOption.YES,
        )

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(canvas.getByText(/image url is required/i)).toBeInTheDocument()
            expect(onSubmitStep).not.toHaveBeenCalled()
        })
    },
}
