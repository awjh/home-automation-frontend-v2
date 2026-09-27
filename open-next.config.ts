import type { OpenNextConfig } from '@opennextjs/aws/types/open-next.js'

// Keep the AWS footprint minimal: no DynamoDB tag cache or SQS revalidation queue.
// The app does not use revalidateTag/revalidatePath, and any ISR revalidation runs in-process.
const config = {
    default: {
        override: {
            wrapper: 'aws-lambda',
            converter: 'aws-apigw-v2',
            incrementalCache: 's3-lite',
            tagCache: 'dummy',
            queue: 'direct',
        },
    },
    imageOptimization: {
        loader: 's3-lite',
    },
} satisfies OpenNextConfig

export default config
