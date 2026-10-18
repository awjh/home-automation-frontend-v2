import Stage from '@cdk/defs/Stage'

const DomainNames: Record<Stage, string[]> = {
    // TODO: drop home-automation-v2 once everything has moved to home-automation
    [Stage.PROD]: ['home-automation.andrewhurt.co.uk', 'home-automation-v2.andrewhurt.co.uk'],
}

export default DomainNames
