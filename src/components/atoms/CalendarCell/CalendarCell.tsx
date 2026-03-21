import { GridItem, GridItemProps, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

const cellWidth = { base: undefined, sm: 12, lg: 16 }
const cellHeight = {
    base: 'calc(((100vw - 32px - 4pt - 16px) / 7) / 1.33333)',
    sm: 9,
    lg: 12,
}

export type CalendarCellVariant =
    | 'default'
    | 'selected'
    | 'highlighted'
    | 'selected-highlighted'
    | 'spacer'

interface CalendarCellPropsSpacer {
    variant: Extract<CalendarCellVariant, 'spacer'>
}

interface CalendarCellPropsNonSpacer {
    day: number
    variant: Exclude<CalendarCellVariant, 'spacer'>
    onClick: () => void | Promise<void>
}

type CalendarCellProps = CalendarCellPropsNonSpacer | CalendarCellPropsSpacer

export default function CalendarCell(props: CalendarCellProps) {
    const { keyColors } = useColorMode()

    let backgroundColor: GridItemProps['backgroundColor'] = undefined
    let textColor: GridItemProps['color'] = undefined
    let borderColor: GridItemProps['borderColor'] = undefined

    switch (props.variant) {
        case 'default':
            backgroundColor = keyColors.secondary
            textColor = keyColors.primary
            borderColor = keyColors.secondary
            break
        case 'selected':
            backgroundColor = keyColors.secondary
            textColor = keyColors.primary
            borderColor = keyColors.primary
            break
        case 'highlighted':
            backgroundColor = keyColors.subtle
            textColor = keyColors.primary
            borderColor = keyColors.subtle
            break
        case 'selected-highlighted':
            backgroundColor = keyColors.primary
            textColor = keyColors.secondary
            borderColor = keyColors.primary
            break
    }

    if (props.variant === 'spacer') {
        return <GridItem width={cellWidth} height={cellHeight} />
    }

    return (
        <GridItem
            backgroundColor={backgroundColor}
            color={textColor}
            borderColor={borderColor}
            borderWidth={2}
            boxSizing={'border-box'}
            cursor={'pointer'}
            width={cellWidth}
            height={cellHeight}
            onClick={props.onClick}
            data-variant={props.variant}
        >
            <Text
                h={cellHeight}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                fontSize={'lg'}
            >
                {props.day}
            </Text>
        </GridItem>
    )
}
