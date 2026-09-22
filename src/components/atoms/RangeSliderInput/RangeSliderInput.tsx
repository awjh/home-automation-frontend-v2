import { Field, HStack, Slider, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

export type RangeSliderValue = {
    min: number
    max: number
}

export interface RangeSliderInputProps {
    label: string
    value: RangeSliderValue
    min: number
    max: number
    step?: number
    required?: boolean
    onChange: (value: RangeSliderValue) => void
}

export default function RangeSliderInput({
    label,
    value,
    min,
    max,
    step = 1,
    required = false,
    onChange,
}: RangeSliderInputProps) {
    const { keyColors } = useColorMode()

    return (
        <Field.Root required={required}>
            <VStack alignItems={'stretch'} gap={2} w={'full'}>
                <Field.Label
                    color={keyColors.primary}
                    textTransform={'capitalize'}
                    fontSize={'lg'}
                    fontWeight={'bold'}
                    mb={2}
                >
                    {label} ({value.min} - {value.max})
                    {required ? <Field.RequiredIndicator /> : null}
                </Field.Label>
                <Slider.Root
                    min={min}
                    max={max}
                    step={step}
                    size={'sm'}
                    value={[value.min, value.max]}
                    onValueChange={(details) => {
                        const [nextMin, nextMax] = details.value

                        if (nextMin === undefined || nextMax === undefined) {
                            return
                        }

                        onChange({ min: nextMin, max: nextMax })
                    }}
                >
                    <Slider.Control>
                        <Slider.Track
                            bg={keyColors.subtle}
                            borderColor={keyColors.subtle}
                            boxShadow={'none'}
                        >
                            <Slider.Range bg={keyColors.primary} />
                        </Slider.Track>
                        <Slider.Thumbs
                            bg={keyColors.primary}
                            borderColor={keyColors.primary}
                            boxSize={6}
                        />
                    </Slider.Control>
                </Slider.Root>
                <HStack justifyContent={'space-between'}>
                    <Text color={keyColors.primary}>{min}</Text>
                    <Text color={keyColors.primary}>{max}</Text>
                </HStack>
            </VStack>
        </Field.Root>
    )
}
