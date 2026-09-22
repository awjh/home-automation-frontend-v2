import DescriptionTable, { DescriptionTableProps } from '@atoms/DescriptionTable/DescriptionTable'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import formatDuration from '@utils/formatDuration'
import joinValues from '@utils/joinValues'

export interface RecipeDescriptionTableProps {
    recipe: Pick<Recipe, 'duration' | 'calories' | 'produces'>
}

export default function RecipeDescriptionTable(props: RecipeDescriptionTableProps) {
    const { duration, calories, produces } = props.recipe

    const descriptionTableData: DescriptionTableProps['data'] = [
        { key: 'Calories', value: calories },
    ]

    if ('serves' in produces) {
        descriptionTableData.push({ key: 'Serves', value: produces.serves })
    } else {
        descriptionTableData.push({
            key: 'Produces',
            value: joinValues(produces.quantity, produces.measure),
        })
    }

    if (duration.standingTime > 0) {
        descriptionTableData.push(
            {
                key: 'Active duration',
                value: formatDuration(duration.cookingDuration + duration.prepDuration),
            },
            {
                key: 'Standing time',
                value: formatDuration(duration.standingTime),
            },
        )
    } else {
        descriptionTableData.push({
            key: 'Duration',
            value: formatDuration(duration.cookingDuration + duration.prepDuration),
        })
    }

    return <DescriptionTable data={descriptionTableData} />
}
