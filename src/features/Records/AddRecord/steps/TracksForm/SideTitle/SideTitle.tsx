import TextInput from '@atoms/TextInput/TextInput'
import { Grid, GridItem, IconButton, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { useRef, useState } from 'react'
import { Controller, useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import { LuCheck, LuTrash2, LuX } from 'react-icons/lu'
import { TracksFormValues } from '../SideForm/SideForm'

interface SideTitleProps {
    control: Control<TracksFormValues>
    sideIndex: number
    setValue: UseFormSetValue<TracksFormValues>
    canDeleteSide: boolean
    onDeleteSide: () => void
}

const iconButtonProps = {
    type: 'button',
    borderWidth: 2,
    borderRadius: 0,
} as const

export default function SideTitle({
    control,
    sideIndex,
    setValue,
    canDeleteSide = false,
    onDeleteSide,
}: SideTitleProps) {
    const { keyColors } = useColorMode()
    const [isEditing, setIsEditing] = useState(false)
    const sideNamePath = `sides.${sideIndex}.name` as const
    const sideName = (useWatch({ control, name: sideNamePath }) ?? '') as string
    const originalSideNameRef = useRef(sideName)

    const buttonColors = {
        color: keyColors.primary,
        _hover: { bg: keyColors.buttonHoverBg, color: keyColors.secondary },
        background: keyColors.secondary,
        borderColor: keyColors.primary,
    }

    const startEditing = () => {
        originalSideNameRef.current = sideName
        setIsEditing(true)
    }

    const revertEdit = () => {
        setValue(sideNamePath, originalSideNameRef.current, { shouldDirty: false })
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <Grid gap={2} templateColumns={'auto 1fr auto auto'} alignItems={'center'}>
                <Text fontSize={'xl'} color={keyColors.primary}>
                    Side
                </Text>
                <GridItem>
                    <Controller
                        name={sideNamePath}
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                type={'text'}
                                required={false}
                                aria-label={'side name'}
                                fontSize={'xl'}
                                bg={keyColors.subtle}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault()
                                        setIsEditing(false)
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
                    {...iconButtonProps}
                    {...buttonColors}
                    aria-label={'confirm side name change'}
                    onClick={() => setIsEditing(false)}
                >
                    <LuCheck />
                </IconButton>
                <IconButton
                    {...iconButtonProps}
                    {...buttonColors}
                    aria-label={'revert side name change'}
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
                Side {sideName}
            </Text>
            {canDeleteSide ? (
                <IconButton
                    {...iconButtonProps}
                    {...buttonColors}
                    aria-label={'delete side'}
                    onClick={onDeleteSide}
                >
                    <LuTrash2 />
                </IconButton>
            ) : null}
        </Grid>
    )
}
