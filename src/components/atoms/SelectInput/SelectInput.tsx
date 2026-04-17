import { Field, Select, createListCollection } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

export interface SelectItem {
    label: string
    value: string
}

export interface SelectInputProps {
    options: SelectItem[]
    label: string
    value?: string
    required?: boolean
    errorMessage?: string
    onChange?: (value: string) => void
    onBlur?: () => void
}

export default function SelectInput(props: SelectInputProps) {
    const { keyColors } = useColorMode()
    const isInvalid = Boolean(props.errorMessage)

    const inputCollection = createListCollection({
        items: props.options.map((option) => ({
            label: option.label,
            value: option.value,
        })),
    })

    return (
        <Field.Root required={props.required} invalid={isInvalid}>
            <Field.Label color={keyColors.primary}>
                {props.label}
                {props.required ? <Field.RequiredIndicator /> : null}
            </Field.Label>

            <Select.Root
                collection={inputCollection}
                value={props.value ? [props.value] : []}
                invalid={isInvalid}
                positioning={{
                    offset: {
                        mainAxis: -2,
                        crossAxis: 0,
                    },
                    sameWidth: true,
                }}
                onValueChange={(value) => {
                    props.onChange?.(value.value[0])
                }}
                onInteractOutside={() => props.onBlur?.()}
            >
                <Select.HiddenSelect required={props.required} onBlur={() => props.onBlur?.()} />
                <Select.Label />

                <Select.Control>
                    <Select.Trigger
                        borderColor={keyColors.primary}
                        borderWidth={2}
                        color={keyColors.primary}
                        borderRadius={0}
                        textTransform={'capitalize'}
                    >
                        <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator color={keyColors.primary} />
                        <Select.ClearTrigger color={keyColors.primary} />
                    </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                    <Select.Content
                        bg={keyColors.subtle}
                        borderRadius={0}
                        borderWidth={2}
                        borderColor={keyColors.primary}
                    >
                        {inputCollection.items.map((item) => {
                            const isSelected = item.value === props.value

                            return (
                                <Select.Item
                                    item={item}
                                    key={item.value}
                                    textTransform={'capitalize'}
                                    color={keyColors.primary}
                                    bg={isSelected ? keyColors.lessSubtle : undefined}
                                    borderRadius={0}
                                    _highlighted={{
                                        bg: isSelected ? keyColors.lessSubtle : keyColors.primary,
                                        color: isSelected ? keyColors.primary : keyColors.secondary,
                                    }}
                                    _hover={{
                                        bg: keyColors.primary,
                                        color: keyColors.secondary,
                                    }}
                                >
                                    {item.label}
                                </Select.Item>
                            )
                        })}
                    </Select.Content>
                </Select.Positioner>
            </Select.Root>
            {props.errorMessage && <Field.ErrorText>{props.errorMessage}</Field.ErrorText>}
        </Field.Root>
    )
}
