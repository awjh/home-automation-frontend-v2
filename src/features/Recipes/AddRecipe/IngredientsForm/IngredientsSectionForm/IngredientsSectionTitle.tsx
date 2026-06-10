import TextInput from '@atoms/TextInput/TextInput'
import { Grid, GridItem, IconButton, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { useRef, useState } from 'react'
import { Controller, useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import { LuCheck, LuTrash2, LuX } from 'react-icons/lu'
import { IngredientsFormValues } from './IngredientsSectionForm'

interface IngredientsSectionTitleProps {
    control: Control<IngredientsFormValues>
    sectionIndex: number
    setValue: UseFormSetValue<IngredientsFormValues>
    canDeleteSection: boolean
    onDeleteSection: () => void
}

export default function IngredientsSectionTitle({
    control,
    sectionIndex,
    setValue,
    canDeleteSection = false,
    onDeleteSection,
}: IngredientsSectionTitleProps) {
    const { keyColors } = useColorMode()
    const [isEditing, setIsEditing] = useState(false)
    const sectionNamePath = `sections.${sectionIndex}.name` as const
    const sectionName = (useWatch({
        control,
        name: sectionNamePath,
    }) ?? '') as string
    const originalSectionNameRef = useRef(sectionName)

    const startEditing = () => {
        originalSectionNameRef.current = sectionName
        setIsEditing(true)
    }

    const confirmEdit = () => {
        setIsEditing(false)
    }

    const revertEdit = () => {
        setValue(sectionNamePath, originalSectionNameRef.current, { shouldDirty: false })
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <Grid gap={2} templateColumns={'1fr auto auto'} alignItems={'end'}>
                <GridItem>
                    <Controller
                        name={sectionNamePath}
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextInput
                                {...field}
                                type={'text'}
                                required={false}
                                label={undefined}
                                errorMessage={fieldState.error?.message}
                                reserveErrorSpace={true}
                                fontSize={'xl'}
                                color={keyColors.primary}
                                borderColor={keyColors.primary}
                                borderWidth={2}
                                borderRadius={0}
                                bg={keyColors.subtle}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault()
                                        confirmEdit()
                                    }

                                    if (event.key === 'Escape') {
                                        event.preventDefault()
                                        revertEdit()
                                    }
                                }}
                            />
                        )}
                    />
                </GridItem>
                <IconButton
                    type={'button'}
                    aria-label={'confirm section title change'}
                    color={keyColors.primary}
                    _hover={{
                        bg: keyColors.buttonHoverBg,
                        color: keyColors.secondary,
                    }}
                    background={keyColors.secondary}
                    borderWidth={2}
                    borderColor={keyColors.primary}
                    borderRadius={0}
                    onClick={confirmEdit}
                >
                    <LuCheck />
                </IconButton>
                <IconButton
                    type={'button'}
                    aria-label={'revert section title change'}
                    color={keyColors.primary}
                    _hover={{
                        bg: keyColors.buttonHoverBg,
                        color: keyColors.secondary,
                    }}
                    background={keyColors.secondary}
                    borderWidth={2}
                    borderColor={keyColors.primary}
                    borderRadius={0}
                    onClick={revertEdit}
                >
                    <LuX />
                </IconButton>
            </Grid>
        )
    }

    return (
        <Grid gap={2} templateColumns={'1fr auto'} alignItems={'center'}>
            <Text fontSize={'xl'} color={keyColors.primary} cursor={'text'} onClick={startEditing}>
                {sectionName}
            </Text>
            {canDeleteSection ? (
                <IconButton
                    type={'button'}
                    aria-label={'delete section'}
                    color={keyColors.primary}
                    _hover={{
                        bg: keyColors.buttonHoverBg,
                        color: keyColors.secondary,
                    }}
                    background={keyColors.secondary}
                    borderWidth={2}
                    borderColor={keyColors.primary}
                    borderRadius={0}
                    onClick={onDeleteSection}
                >
                    <LuTrash2 />
                </IconButton>
            ) : null}
        </Grid>
    )
}
