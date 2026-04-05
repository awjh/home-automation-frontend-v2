import { GridItem, GridItemProps, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

const cellHeight = {
    base: 8,
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

type BackgroundStyle = 'normal' | 'subtle'

interface CalendarCellPropsNonSpacer {
    backgroundStyle:
        | BackgroundStyle
        | {
              base?: BackgroundStyle
              sm?: BackgroundStyle
              md?: BackgroundStyle
              lg?: BackgroundStyle
          }
    day: number
    variant: Exclude<CalendarCellVariant, 'spacer'>
    onClick: () => void | Promise<void>
}

type CalendarCellProps = CalendarCellPropsNonSpacer | CalendarCellPropsSpacer

function calcHighlightedColor(
    backgroundStyle: CalendarCellPropsNonSpacer['backgroundStyle'],
    keyColors: ReturnType<typeof useColorMode>['keyColors'],
) {
    if (typeof backgroundStyle === 'object') {
        return Object.entries(backgroundStyle).reduce(
            (acc, [breakpoint, style]) => {
                acc[breakpoint as keyof typeof backgroundStyle] =
                    style === 'normal' ? keyColors.subtle : keyColors.lessSubtle
                return acc
            },
            {} as Record<string, string>,
        )
    }

    return backgroundStyle === 'normal' ? keyColors.subtle : keyColors.lessSubtle
}

export default function CalendarCell(props: CalendarCellProps) {
    const { keyColors } = useColorMode()

    let backgroundColor: GridItemProps['backgroundColor'] = undefined
    let textColor: GridItemProps['color'] = undefined
    let borderColor: GridItemProps['borderColor'] = undefined

    switch (props.variant) {
        case 'default':
            backgroundColor = 'transparent'
            textColor = keyColors.primary
            borderColor = 'transparent'
            break
        case 'selected':
            backgroundColor = 'transparent'
            textColor = keyColors.primary
            borderColor = keyColors.primary
            break
        case 'highlighted':
            const highlightedColor = calcHighlightedColor(props.backgroundStyle, keyColors)

            backgroundColor = highlightedColor
            textColor = keyColors.primary
            borderColor = highlightedColor
            break
        case 'selected-highlighted':
            backgroundColor = keyColors.primary
            textColor = keyColors.secondary
            borderColor = keyColors.primary
            break
    }

    if (props.variant === 'spacer') {
        return <GridItem height={cellHeight} />
    }

    return (
        <GridItem
            backgroundColor={backgroundColor}
            color={textColor}
            borderColor={borderColor}
            borderWidth={2}
            boxSizing={'border-box'}
            cursor={'pointer'}
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
