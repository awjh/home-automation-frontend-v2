import { Box, chakra, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import useToaster from '@hooks/useToaster'
import { useEffect, useState } from 'react'

// How long a room shows as rung before it can be rung again
export const BELLBOARD_ROOM_RUNG_DURATION = 30_000

type RingStatus = 'idle' | 'ringing' | 'rung'

export interface BellboardRoomProps {
    room: string
    onRing: () => Promise<unknown>
    rungDuration?: number
}

export default function BellboardRoom({
    room,
    onRing,
    rungDuration = BELLBOARD_ROOM_RUNG_DURATION,
}: BellboardRoomProps) {
    const { keyColors } = useColorMode()
    const toaster = useToaster()
    const [status, setStatus] = useState<RingStatus>('idle')

    useEffect(() => {
        if (status !== 'rung') {
            return
        }

        const timeout = setTimeout(() => setStatus('idle'), rungDuration)

        return () => clearTimeout(timeout)
    }, [status, rungDuration])

    const ring = async () => {
        setStatus('ringing')

        try {
            await onRing()
            setStatus('rung')
        } catch (error) {
            console.error('Error ringing bellboard room:', error)
            setStatus('idle')
            toaster.create({
                title: `Failed to ring ${room}`,
                description: 'There was an error while ringing the bell. Please try again.',
                type: 'error',
            })
        }
    }

    return (
        <chakra.button
            type={'button'}
            aria-label={`Ring ${room}`}
            data-status={status}
            disabled={status !== 'idle'}
            onClick={ring}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            gap={4}
            w={'full'}
            h={'full'}
            p={4}
            color={keyColors.primary}
            bg={keyColors.secondary}
            borderColor={keyColors.primary}
            borderWidth={2}
            borderRadius={0}
            cursor={'pointer'}
            _hover={{ bg: keyColors.subtle }}
            _disabled={{ cursor: 'not-allowed', _hover: { bg: keyColors.secondary } }}
        >
            <Box
                data-part={'outer-circle'}
                p={'5px'}
                borderColor={keyColors.primary}
                borderWidth={2}
                borderRadius={'full'}
            >
                <Box
                    data-part={'inner-circle'}
                    data-filled={status === 'rung' || undefined}
                    w={10}
                    h={10}
                    borderColor={keyColors.primary}
                    borderWidth={2}
                    borderRadius={'full'}
                    bg={status === 'rung' ? keyColors.primary : 'transparent'}
                    transition={'background-color 0.2s'}
                />
            </Box>
            <Text textAlign={'center'}>{room}</Text>
        </chakra.button>
    )
}
