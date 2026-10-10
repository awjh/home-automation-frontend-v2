import ImageWithFallback, {
    ImageWithFallbackProps,
} from '@atoms/ImageWithFallback/ImageWithFallback'
import { chakra, Flex, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { LuImagePlus } from 'react-icons/lu'

export interface EditableImageProps extends ImageWithFallbackProps {
    // What the image is of, used in the button's accessible name e.g. "Change recipe image"
    subject: string
    onClick: () => void
}

export default function EditableImage({ subject, onClick, ...imageProps }: EditableImageProps) {
    const { keyColors } = useColorMode()
    const action = imageProps.src ? 'Change' : 'Add'

    return (
        <chakra.button
            type={'button'}
            aria-label={`${action} ${subject} image`}
            onClick={onClick}
            position={'relative'}
            w={imageProps.w}
            cursor={'pointer'}
            flexShrink={0}
            className={'group'}
            data-testid={'editable-image'}
        >
            <ImageWithFallback {...imageProps} />
            <Flex
                position={'absolute'}
                inset={0}
                alignItems={'center'}
                justifyContent={'center'}
                gap={2}
                bg={keyColors.secondary}
                color={keyColors.primary}
                opacity={0}
                transition={'opacity 0.2s'}
                _groupHover={{ opacity: 0.75 }}
                _groupFocusVisible={{ opacity: 0.75 }}
            >
                <LuImagePlus />
                <Text>{action} image</Text>
            </Flex>
        </chakra.button>
    )
}
