import { UploadRecipeImageInput, UploadRecipeImageResponse } from '@defs/Image'
import { ImageFormValues } from '@features/Recipes/AddRecipe/steps/ImageForm/ImageForm'
import resolveImageKey from '@features/Recipes/AddRecipe/steps/ImageForm/resolveImageKey'
import useToaster from '@hooks/useToaster'
import { useCallback, useState } from 'react'
import EditImagePopup from './EditImagePopup'

export interface UseEditImageOptions {
    image: string | undefined
    uploadImage: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>
    // Saves the new key (or removes the image when undefined) and returns its display URL
    updateImage: (imageKey: string | undefined) => Promise<string | undefined>
}

export default function useEditImage({ image, uploadImage, updateImage }: UseEditImageOptions) {
    const toaster = useToaster()
    const [currentImage, setCurrentImage] = useState(image)
    const [isEditing, setIsEditing] = useState(false)

    const onSubmit = useCallback(
        async (values: ImageFormValues) => {
            try {
                const imageKey = await resolveImageKey(values, uploadImage)
                setCurrentImage(await updateImage(imageKey))
                setIsEditing(false)
                toaster.create({
                    title: imageKey ? 'Updated image' : 'Removed image',
                    description: imageKey
                        ? 'The image has been successfully updated.'
                        : 'The image has been successfully removed.',
                    type: 'success',
                })
            } catch (error) {
                console.error('Error updating image:', error)
                toaster.create({
                    title: 'Failed to update image',
                    description: 'There was an error while updating the image. Please try again.',
                    type: 'error',
                })
            }
        },
        [toaster, updateImage, uploadImage],
    )

    const openEditImage = useCallback(() => setIsEditing(true), [])

    const editImagePopup = isEditing ? (
        <EditImagePopup
            hasImage={Boolean(currentImage)}
            onSubmit={onSubmit}
            onClose={() => setIsEditing(false)}
        />
    ) : null

    return { image: currentImage, openEditImage, editImagePopup }
}
