import Stage from '@cdk/defs/Stage'

// CloudFront only accepts ACM certificates issued in us-east-1
const CertificateArns: Record<Stage, string> = {
    // TODO: replace with the ARN of the us-east-1 certificate for home-automation-v2.andrewhurt.co.uk
    [Stage.PROD]:
        'arn:aws:acm:us-east-1:558946902552:certificate/5341efeb-b33a-4ea9-a4b9-687080b038f5',
}

export default CertificateArns
