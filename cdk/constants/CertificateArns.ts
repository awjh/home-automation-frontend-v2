import Stage from '@cdk/defs/Stage'

// CloudFront only accepts ACM certificates issued in us-east-1
const CertificateArns: Record<Stage, string> = {
    [Stage.PROD]:
        'arn:aws:acm:us-east-1:558946902552:certificate/0489f430-7d34-4201-9ddb-2ce87aeeb8d3',
}

export default CertificateArns
