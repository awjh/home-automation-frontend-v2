import { UploadRecipeImageInput, UploadRecipeImageResponse } from '@defs/Image'
import uploadImageFile from '@utils/uploadImageFile'
import { HasImageOption, ImageFormValues, ImageSourceOption } from './ImageForm'

export default async function resolveImageKey(
    imageValues: ImageFormValues | undefined,
    uploadRecipeImage: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>,
): Promise<string | undefined> {
    if (!imageValues || imageValues.hasImage !== HasImageOption.YES) {
        return undefined
    }

    if (imageValues.imageSource === ImageSourceOption.UPLOAD) {
        if (!imageValues.imageFile) {
            return undefined
        }

        return uploadImageFile(imageValues.imageFile, uploadRecipeImage)
    }

    if (!imageValues.imageUrl) {
        return undefined
    }

    const { key } = await uploadRecipeImage({ source: 'url', url: imageValues.imageUrl })

    return key
}
