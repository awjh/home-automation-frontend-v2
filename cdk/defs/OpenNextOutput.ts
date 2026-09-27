// Subset of the .open-next/open-next.output.json manifest written by `open-next build`
type OpenNextOutput = {
    origins: {
        s3: {
            type: 's3'
            originPath: string
            copy: {
                from: string
                to: string
                cached: boolean
                versionedSubDir?: string
            }[]
        }
        default: {
            type: 'function'
            handler: string
            bundle: string
        }
        imageOptimizer: {
            type: 'function'
            handler: string
            bundle: string
        }
    }
    behaviors: {
        pattern: string
        origin: 's3' | 'default' | 'imageOptimizer'
    }[]
}

export default OpenNextOutput
