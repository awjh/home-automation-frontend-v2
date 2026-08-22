'use server'

import BackendApi from '@constants/BackendApi'
import { cookies } from 'next/headers'

async function getSessionJwt() {
    const cookieStore = await cookies()
    const sessionJwt = cookieStore.get('stytch_session_jwt')?.value

    if (!sessionJwt) {
        throw new Error('Not authenticated')
    }

    return sessionJwt
}

async function getAuthHeaders() {
    const sessionJwt = await getSessionJwt()

    if (!process.env.API_KEY) {
        throw new Error('API_KEY is not defined')
    }

    return {
        Authorization: `Bearer ${sessionJwt}`,
        'x-api-key': process.env.API_KEY!,
    }
}

function getBaseUrl(): string {
    if (!process.env.API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined')
    }

    return process.env.API_BASE_URL
}

type Endpoint = keyof (typeof BackendApi)['paths']
type Method<EP extends Endpoint> = keyof (typeof BackendApi)['paths'][EP]

type ParameterNamesByLocation<T, Location extends string> = T extends {
    parameters: ReadonlyArray<infer P>
}
    ? P extends { in: Location; name: infer N }
        ? N
        : never
    : undefined

type QueryParameterNames<T> = T extends { parameters: ReadonlyArray<infer P> }
    ? P extends { in: 'query'; name: infer N }
        ? N
        : never
    : undefined

type PathParameterNames<T> = ParameterNamesByLocation<T, 'path'>

type QueryParams<EP extends Endpoint, M extends Method<EP>> =
    QueryParameterNames<(typeof BackendApi)['paths'][EP][M]> extends infer K
        ? [K] extends [never]
            ? undefined
            : [K] extends [string]
              ? Record<K, string>
              : undefined
        : undefined

type PathParams<EP extends Endpoint, M extends Method<EP>> =
    PathParameterNames<(typeof BackendApi)['paths'][EP][M]> extends infer K
        ? [K] extends [never]
            ? undefined
            : [K] extends [string]
              ? Record<K, string>
              : undefined
        : undefined

type Body<
    EP extends Endpoint,
    M extends Method<EP>,
> = 'requestBody' extends keyof (typeof BackendApi)['paths'][EP][M] ? object : undefined

type QueryParamsArg<E extends Endpoint, M extends Method<E>> =
    QueryParams<E, M> extends undefined
        ? { queryParams?: undefined }
        : { queryParams: QueryParams<E, M> }

type PathParamsArg<E extends Endpoint, M extends Method<E>> =
    PathParams<E, M> extends undefined
        ? { pathParams?: undefined }
        : { pathParams: PathParams<E, M> }

type BodyArg<E extends Endpoint, M extends Method<E>> =
    Body<E, M> extends undefined ? { body?: undefined } : { body: Body<E, M> }

type CallApiEndpointArgs<E extends Endpoint, M extends Method<E>> = {
    additionalHeaders?: Record<string, string>
} & PathParamsArg<E, M> &
    QueryParamsArg<E, M> &
    BodyArg<E, M>

export default async function getEndpoint<E extends Endpoint, M extends Method<E>>({
    endpoint,
    method,
}: {
    endpoint: E
    method: M
}) {
    return async function callApiEndpoint<R>({
        additionalHeaders = {},
        pathParams,
        queryParams,
        body,
    }: CallApiEndpointArgs<E, M>): Promise<R> {
        const url = getBaseUrl()
        const pathParamsRecord = (pathParams ?? {}) as Record<string, string>
        const resolvedEndpoint = endpoint.replace(/\{([^}]+)\}/g, (_, key: string) => {
            const value = pathParamsRecord[key]

            if (value === undefined) {
                throw new Error(`Missing path parameter: ${key}`)
            }

            return encodeURIComponent(value)
        })

        const res = await fetch(
            `${url}${resolvedEndpoint}${queryParams ? `?${new URLSearchParams(queryParams as Record<string, string>).toString()}` : ''}`,
            {
                method: method.toString().toUpperCase(),
                headers: {
                    ...(await getAuthHeaders()),
                    ...additionalHeaders,
                },
                body: body ? JSON.stringify(body) : undefined,
            },
        )

        if (!res.ok) {
            throw new Error('Failed to call API endpoint')
        }

        const content = res.headers.get('content-type')

        if (content && content.includes('application/json')) {
            return res.json() as Promise<R>
        } else if (content && content.includes('image/')) {
            const imageBuffer = Buffer.from(await res.arrayBuffer())
            const contentType = res.headers.get('content-type') ?? 'image/jpeg'

            return `data:${contentType};base64,${imageBuffer.toString('base64')}` as unknown as Promise<R>
        }

        return res.text() as unknown as Promise<R>
    }
}
