'use client'

import { VStack } from '@chakra-ui/react'
import { MusicRecord } from '@awjh/home-automation-v2-api-models/records'
import { UploadRecipeImageInput, UploadRecipeImageResponse } from '@defs/Image'
import useEditImage from '@features/Images/EditImage/useEditImage'
import NavBar from '@features/NavBar/NavBar'
import ViewRecord from '@features/Records/ViewRecord/ViewRecord'
import { useCallback } from 'react'

export interface RecordScreenProps {
    record: MusicRecord
    uploadRecordImage: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>
    updateRecordImage: (
        recordId: string,
        imageKey: string | undefined,
    ) => Promise<string | undefined>
}

export default function RecordScreen({
    record,
    uploadRecordImage,
    updateRecordImage,
}: RecordScreenProps) {
    const updateImage = useCallback(
        (imageKey: string | undefined) => updateRecordImage(record.id, imageKey),
        [record.id, updateRecordImage],
    )
    const { image, openEditImage, editImagePopup } = useEditImage({
        image: record.image,
        uploadImage: uploadRecordImage,
        updateImage,
    })

    return (
        <VStack width={'full'}>
            <NavBar />
            {editImagePopup}
            <VStack width={'full'} minHeight={'100vh'}>
                <ViewRecord record={{ ...record, image }} onImageClick={openEditImage} />
            </VStack>
        </VStack>
    )
}
