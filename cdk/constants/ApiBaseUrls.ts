import Stage from '@cdk/defs/Stage'

const ApiBaseUrls: Record<Stage, string> = {
    [Stage.PROD]: 'https://api.home-automation.prod.andrewhurt.co.uk',
}

export default ApiBaseUrls
