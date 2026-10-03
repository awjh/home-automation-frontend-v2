import Button from '@atoms/Button/Button'
import { GetRecordsResponse } from '@awjh/home-automation-v2-api-models'
import { Box, Separator, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { Fragment } from 'react'
import SearchRecordResult from '../SearchRecordResult/SearchRecordResult'

export interface SearchRecordResultsProps {
    records: GetRecordsResponse
    // Omitted when there are no more pages to load
    onLoadNextPage?: () => void
    isLoadingNextPage?: boolean
}

export default function SearchRecordResults(props: SearchRecordResultsProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack w={'full'} gap={0}>
            {props.records.map((record, index) => (
                <Fragment key={`record-result-${record.id}`}>
                    <SearchRecordResult
                        record={record}
                        colorStyle={index % 2 === 0 ? 'primary' : 'subtle'}
                    />
                    {index != props.records.length - 1 && (
                        <Separator size="md" w={'full'} borderColor={keyColors.primary} />
                    )}
                </Fragment>
            ))}
            {props.onLoadNextPage && props.records.length > 0 && (
                <Box py={4}>
                    <Button
                        type={'button'}
                        colorStyle={'secondary'}
                        onClick={props.onLoadNextPage}
                        loading={props.isLoadingNextPage}
                        loadingText={'Loading...'}
                    >
                        Load More
                    </Button>
                </Box>
            )}
        </VStack>
    )
}
