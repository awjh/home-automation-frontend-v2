import { Box, HStack, Stack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { useEffect, useState } from 'react'
import zxcvbn from 'zxcvbn'

interface PasswordStrengthMeterProps {
    passwordValue: string
}

export default function PasswordStrengthMeter(props: PasswordStrengthMeterProps) {
    const { keyColors } = useColorMode()

    const [strength, setStrength] = useState(-1)

    useEffect(() => {
        if (props.passwordValue === '') {
            setStrength(-1)
            return
        }
        const result = zxcvbn(props.passwordValue)

        setStrength(result.score)
    }, [props.passwordValue])

    if (strength === -1) {
        return null
    }

    let label = ''

    switch (strength) {
        case 0:
            label = 'Very weak'
            break
        case 1:
            label = 'Weak'
            break
        case 2:
            label = 'Fair'
            break
        case 3:
            label = 'Good'
            break
        case 4:
            label = 'Strong'
            break
    }

    return (
        <Stack align="flex-end" gap="1">
            <HStack width="full">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Box
                        key={index}
                        height="1"
                        flex="1"
                        rounded="sm"
                        data-selected={index < strength ? '' : undefined}
                        layerStyle="fill.subtle"
                        bg={index <= strength ? keyColors.primary : keyColors.subtle}
                    />
                ))}
            </HStack>
            {label && (
                <HStack textStyle="sm" color={keyColors.primary}>
                    {label}
                </HStack>
            )}
        </Stack>
    )
}
