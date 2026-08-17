import {
    GetExtractedExternalRecipeBasicsResponse,
    GetRecipesResponse,
} from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import type AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import { expect, fn, type Mock, waitFor, within } from 'storybook/test'

export const internalRecipeResults = [
    {
        id: 'recipe-1',
        title: 'Spaghetti Bolognese',
        authors: ['Andrew Hurt'],
        calories: 620,
        duration: { prepDuration: 20, cookingDuration: 45, standingTime: 0 },
        produces: { serves: 4 },
        tags: {
            cuisine: [],
            mealType: [],
            meat: [],
            dietary: [],
            occasion: [],
            equipment: [],
        },
    },
    {
        id: 'recipe-2',
        title: 'Spaghetti Carbonara',
        authors: ['Andrew Hurt'],
        calories: 540,
        duration: { prepDuration: 10, cookingDuration: 20, standingTime: 0 },
        produces: { serves: 4 },
        tags: {
            cuisine: [],
            mealType: [],
            meat: [],
            dietary: [],
            occasion: [],
            equipment: [],
        },
    },
] satisfies GetRecipesResponse

export const extractedOnlineRecipe = {
    title: 'Gnocchi in Roasted Red Pepper Sauce',
    duration: {
        prepDuration: 12,
        cookingDuration: 18,
        standingTime: 2,
    },
} satisfies GetExtractedExternalRecipeBasicsResponse

export const bookFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.BOOK,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Traybake',
    author: 'Rukmini Iyer',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: 'The Roasting Tin',
    pageNumber: '86',
    series: 'Simple Suppers',
    recipeUrl: '',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: '',
    prepDuration: '10',
    cookingDuration: '30',
    standingTime: '0',
} satisfies AddMealPlanFormValues

export const onlineFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.ONLINE,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Gnocchi with Roast Pepper Sauce',
    author: 'BBC Good Food',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: 'https://www.bbcgoodfood.com/recipes/gnocchi-roasted-red-pepper-sauce',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: '',
    prepDuration: '10',
    cookingDuration: '20',
    standingTime: '0',
} satisfies AddMealPlanFormValues

export const onlineFlowUsingExtractedValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.ONLINE,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: extractedOnlineRecipe.title,
    author: 'BBC Good Food',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: 'https://www.bbcgoodfood.com/recipes/gnocchi-roasted-red-pepper-sauce',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: '',
    prepDuration: extractedOnlineRecipe.duration.prepDuration.toString(),
    cookingDuration: extractedOnlineRecipe.duration.cookingDuration.toString(),
    standingTime: extractedOnlineRecipe.duration.standingTime.toString(),
} satisfies AddMealPlanFormValues

export const magazineFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.MAGAZINE,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Beef Wellington',
    author: 'Gordon Ramsay',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: '',
    magazineName: 'Gourmet Weekly',
    magazineIssue: 'March 2026',
    magazinePage: '45',
    internalRecipeId: '',
    prepDuration: '60',
    cookingDuration: '45',
    standingTime: '30',
} satisfies AddMealPlanFormValues

export const internalRecipeFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.INTERNAL_RECIPE,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Spaghetti Carbonara',
    author: 'Andrew Hurt',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: '',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: 'recipe-2',
    prepDuration: '10',
    cookingDuration: '20',
    standingTime: '0',
} satisfies AddMealPlanFormValues

export const internalRecipeFromRecipePageFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.INTERNAL_RECIPE,
    mealDate: '2026-04-02',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Pre-entered recipe title',
    author: 'Pre-entered recipe author',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: '',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: 'pre-entered-internal-recipe-id',
    prepDuration: '10',
    cookingDuration: '15',
    standingTime: '5',
} satisfies AddMealPlanFormValues

export const internalRecipeTitleSearchFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.INTERNAL_RECIPE,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Spaghetti Bolognese',
    author: 'Andrew Hurt',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: '',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: 'recipe-1',
    prepDuration: '20',
    cookingDuration: '45',
    standingTime: '0',
} satisfies AddMealPlanFormValues

export const freezerFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.FREEZER,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Chicken Satay',
    author: '',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: '',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: '',
    prepDuration: '0',
    cookingDuration: '5',
    standingTime: '0',
} satisfies AddMealPlanFormValues

export const leftoversFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.LEFTOVERS,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Roast Chicken Pasta Bake',
    author: 'Andrew Hurt',
    fromDate: '2026-04-03',
    fromMealTime: MealTime.DINNER,
    fromCourse: Course.MAIN,
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: '',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: '',
    prepDuration: '5',
    cookingDuration: '25',
    standingTime: '0',
} satisfies AddMealPlanFormValues

export const readyPreparedFlowValues = {
    mealTime: MealTime.DINNER,
    course: Course.MAIN,
    source: SourceType.READY_PREPARED,
    mealDate: '2026-04-10',
    useForLeftovers: false,
    leftoversDate: '',
    title: 'Chicken Flatties',
    author: 'M&S',
    fromDate: '',
    fromMealTime: '',
    fromCourse: '',
    bookTitle: '',
    pageNumber: '',
    series: '',
    recipeUrl: '',
    magazineName: '',
    magazineIssue: '',
    magazinePage: '',
    internalRecipeId: '',
    prepDuration: '0',
    cookingDuration: '15',
    standingTime: '0',
} satisfies AddMealPlanFormValues

type StoryCanvas = {
    getAllByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement[]
    getByLabelText: (text: string | RegExp, options?: { selector?: string }) => HTMLElement
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement
    getByText: (text: string | RegExp) => HTMLElement
}

type StoryUserEvent = {
    clear: (element: Element) => Promise<void>
    click: (element: Element) => Promise<void>
    selectOptions: (element: Element, values: string | string[]) => Promise<void>
    type: (element: Element, text: string) => Promise<void>
}

export interface AddMealPlanStoryArgs {
    assertSubmitted?: (values: AddMealPlanFormValues) => Promise<void> | void
    extractTitleFromOnlineSource?: unknown
    onCancel?: unknown
    onClose?: unknown
    onSubmit: unknown
    searchInternalRecipes?: unknown
    initialValues?: Partial<AddMealPlanFormValues>
}

export function createAddMealPlanStoryArgs() {
    return {
        extractTitleFromOnlineSource: fn(async () => extractedOnlineRecipe),
        onSubmit: fn().mockResolvedValue(undefined),
        searchInternalRecipes: fn(async () => internalRecipeResults),
    }
}

export function resetAddMealPlanMocks(args: AddMealPlanStoryArgs) {
    ;(args.extractTitleFromOnlineSource as Mock).mockClear()
    ;(args.onSubmit as Mock).mockClear()
    ;(args.searchInternalRecipes as Mock).mockClear()
}

function getRecipeResultSelectButton(canvas: StoryCanvas, recipeTitle: string | RegExp) {
    const recipeTitleElement = canvas.getByText(recipeTitle)
    const recipeResultCard = recipeTitleElement.closest('div')?.parentElement

    if (!(recipeResultCard instanceof HTMLElement)) {
        throw new Error(`Could not find recipe result card for ${recipeTitle.toString()}`)
    }

    return within(recipeResultCard).getByRole('button', { name: /select/i })
}

async function selectPrimaryDetails(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    source: SourceType,
    options?: {
        leftoversDate: string
        useForLeftovers: boolean
    },
) {
    await userEvent.selectOptions(
        canvas.getByLabelText(/meal time/i, { selector: 'select' }),
        MealTime.DINNER,
    )
    await userEvent.selectOptions(
        canvas.getByLabelText(/course/i, { selector: 'select' }),
        Course.MAIN,
    )
    await userEvent.selectOptions(canvas.getByLabelText(/source/i, { selector: 'select' }), source)

    if (source !== SourceType.LEFTOVERS && options?.useForLeftovers) {
        await userEvent.selectOptions(
            canvas.getByLabelText(/use for leftovers\?/i, { selector: 'select' }),
            'true',
        )

        await fillTextInput(
            canvas,
            userEvent,
            /when will the leftovers be used\?/i,
            options.leftoversDate,
        )
    }

    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function fillTextInput(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    label: RegExp,
    value: string,
) {
    const input = canvas.getByLabelText(label, { selector: 'input' })
    await userEvent.clear(input)
    await userEvent.type(input, value)
}

async function fillTitleAuthorDetails(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    values: { title: string; author?: string; authorLabel?: RegExp },
) {
    await fillTextInput(canvas, userEvent, /title/i, values.title)

    if (values.author) {
        await fillTextInput(canvas, userEvent, values.authorLabel ?? /author/i, values.author)
    }

    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function fillDurations(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    values: Pick<AddMealPlanFormValues, 'prepDuration' | 'cookingDuration' | 'standingTime'>,
) {
    await fillTextInput(canvas, userEvent, /preparation time/i, values.prepDuration)
    await fillTextInput(canvas, userEvent, /cooking time/i, values.cookingDuration)
    await fillTextInput(canvas, userEvent, /standing time/i, values.standingTime)
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))
}

async function expectSubmitted(
    args: AddMealPlanStoryArgs,
    values: AddMealPlanFormValues,
    mealDateWasEdited = false,
) {
    if (args.assertSubmitted) {
        await args.assertSubmitted(values)
        return
    }

    await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({
            ...values,
            mealDate: mealDateWasEdited ? values.mealDate : args.initialValues!.mealDate,
        })
    })
}

export async function playDefaultAddMealPlanFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await userEvent.click(canvas.getByRole('button', { name: /next/i }))

    await waitFor(() => {
        expect(canvas.getByText(/meal time is required/i)).toBeInTheDocument()
        expect(canvas.getByText(/source is required/i)).toBeInTheDocument()
    })

    expect(args.onSubmit).not.toHaveBeenCalled()
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playBookFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.BOOK)
    await fillTitleAuthorDetails(canvas, userEvent, bookFlowValues)
    await fillTextInput(canvas, userEvent, /book title/i, bookFlowValues.bookTitle)
    await fillTextInput(canvas, userEvent, /page number/i, bookFlowValues.pageNumber)
    await fillTextInput(canvas, userEvent, /series/i, bookFlowValues.series)
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
    await fillDurations(canvas, userEvent, bookFlowValues)

    await expectSubmitted(args, bookFlowValues)
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playBookFlowMarkedForLeftovers(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.BOOK, {
        useForLeftovers: true,
        leftoversDate: '2026-04-11',
    })
    await fillTitleAuthorDetails(canvas, userEvent, bookFlowValues)
    await fillTextInput(canvas, userEvent, /book title/i, bookFlowValues.bookTitle)
    await fillTextInput(canvas, userEvent, /page number/i, bookFlowValues.pageNumber)
    await fillTextInput(canvas, userEvent, /series/i, bookFlowValues.series)
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
    await fillDurations(canvas, userEvent, bookFlowValues)

    await expectSubmitted(args, {
        ...bookFlowValues,
        useForLeftovers: true,
        leftoversDate: '2026-04-11',
    })
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playOnlineFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.ONLINE)
    await fillTextInput(canvas, userEvent, /recipe url/i, onlineFlowValues.recipeUrl)
    await userEvent.click(canvas.getByRole('button', { name: /extract details/i }))

    await waitFor(() => {
        expect(args.extractTitleFromOnlineSource).toHaveBeenCalledWith(onlineFlowValues.recipeUrl)
    })

    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
    await fillTitleAuthorDetails(canvas, userEvent, onlineFlowValues)
    await fillDurations(canvas, userEvent, onlineFlowValues)

    await expectSubmitted(args, onlineFlowValues)
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playOnlineFlowLeavingExtractedDetails(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.ONLINE)
    await fillTextInput(canvas, userEvent, /recipe url/i, onlineFlowUsingExtractedValues.recipeUrl)
    await userEvent.click(canvas.getByRole('button', { name: /extract details/i }))

    await waitFor(() => {
        expect(args.extractTitleFromOnlineSource).toHaveBeenCalledWith(
            onlineFlowUsingExtractedValues.recipeUrl,
        )
    })

    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
    await fillTextInput(canvas, userEvent, /author/i, onlineFlowUsingExtractedValues.author)
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

    await expectSubmitted(args, onlineFlowUsingExtractedValues)
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playMagazineFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.MAGAZINE)
    await fillTitleAuthorDetails(canvas, userEvent, magazineFlowValues)
    await fillTextInput(canvas, userEvent, /magazine name/i, magazineFlowValues.magazineName)
    await fillTextInput(canvas, userEvent, /issue/i, magazineFlowValues.magazineIssue)
    await fillTextInput(canvas, userEvent, /page/i, magazineFlowValues.magazinePage)
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
    await fillDurations(canvas, userEvent, magazineFlowValues)

    await expectSubmitted(args, magazineFlowValues)
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playInternalRecipeFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.INTERNAL_RECIPE)
    await fillTextInput(canvas, userEvent, /search recipes/i, 'andrew')
    await userEvent.click(canvas.getByRole('button', { name: /search/i }))

    await waitFor(() => {
        expect(args.searchInternalRecipes).toHaveBeenCalledWith('andrew')
        expect(canvas.getByText(/spaghetti bolognese/i)).toBeInTheDocument()
        expect(canvas.getByText(/spaghetti carbonara/i)).toBeInTheDocument()
    })

    const selectButtons = canvas.getAllByRole('button', { name: /select/i })
    await userEvent.click(selectButtons[1])
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

    await expectSubmitted(args, internalRecipeFlowValues)
}

export async function playInternalRecipeFromRecipePageFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.INTERNAL_RECIPE)
    await fillTextInput(canvas, userEvent, /meal date/i, '2026-04-02')
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

    await expectSubmitted(args, internalRecipeFromRecipePageFlowValues, true)
}

export async function playInternalRecipeTitleSearchFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.INTERNAL_RECIPE)
    await fillTextInput(canvas, userEvent, /search recipes/i, 'bolognese')
    await userEvent.click(canvas.getByRole('button', { name: /search/i }))

    await waitFor(() => {
        expect(args.searchInternalRecipes).toHaveBeenCalledWith('bolognese')
        expect(canvas.getByText(/spaghetti bolognese/i)).toBeInTheDocument()
    })

    await userEvent.click(getRecipeResultSelectButton(canvas, /spaghetti bolognese/i))
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

    await expectSubmitted(args, internalRecipeTitleSearchFlowValues)
}

export async function playFreezerFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.FREEZER)
    await fillTitleAuthorDetails(canvas, userEvent, freezerFlowValues)
    await fillDurations(canvas, userEvent, freezerFlowValues)

    await expectSubmitted(args, freezerFlowValues)
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playLeftoversFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.LEFTOVERS)
    await fillTitleAuthorDetails(canvas, userEvent, leftoversFlowValues)
    await fillTextInput(canvas, userEvent, /original meal date/i, leftoversFlowValues.fromDate)
    await userEvent.selectOptions(
        canvas.getByLabelText(/original meal time/i, { selector: 'select' }),
        leftoversFlowValues.fromMealTime,
    )
    await userEvent.selectOptions(
        canvas.getByLabelText(/original meal course/i, { selector: 'select' }),
        leftoversFlowValues.fromCourse,
    )
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
    await fillDurations(canvas, userEvent, leftoversFlowValues)

    await expectSubmitted(args, leftoversFlowValues)
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playReadyPreparedFlow(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    args: AddMealPlanStoryArgs,
) {
    resetAddMealPlanMocks(args)

    await selectPrimaryDetails(canvas, userEvent, SourceType.READY_PREPARED)
    await fillTitleAuthorDetails(canvas, userEvent, {
        title: readyPreparedFlowValues.title,
        author: readyPreparedFlowValues.author,
        authorLabel: /producer/i,
    })
    await fillDurations(canvas, userEvent, readyPreparedFlowValues)

    await expectSubmitted(args, readyPreparedFlowValues)
    expect(args.searchInternalRecipes).not.toHaveBeenCalled()
}

export async function playCancelOnlyOnFirstPage(
    canvas: StoryCanvas,
    userEvent: StoryUserEvent,
    onCancel: unknown,
) {
    ;(onCancel as Mock).mockClear()

    await userEvent.click(canvas.getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
        expect(onCancel).toHaveBeenCalledTimes(1)
    })
    ;(onCancel as Mock).mockClear()

    await selectPrimaryDetails(canvas, userEvent, SourceType.BOOK)
    await userEvent.click(canvas.getByRole('button', { name: /back/i }))

    await waitFor(() => {
        expect(onCancel).not.toHaveBeenCalled()
    })
}
