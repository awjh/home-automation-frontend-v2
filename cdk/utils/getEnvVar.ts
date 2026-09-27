export default function getEnvVar<T extends { [s: string]: string }>(
    key: keyof T,
    required: boolean = true,
): string {
    const envVar = process.env[key as string]

    if (!envVar && required) {
        throw new Error(`Environment variable ${key as string} is not set`)
    }
    return envVar!
}
