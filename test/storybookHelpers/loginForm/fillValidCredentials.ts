export const ValidEmail = 'andrew@example.com'
export const ValidPassword = 'Password123!'

export default async function fillValidCredentials(
    canvas: {
        getByLabelText: (text: string | RegExp, options?: { selector?: string }) => HTMLElement
        getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement
    },
    userEvent: {
        clear: (element: Element) => Promise<void>
        click: (element: Element) => Promise<void>
        type: (element: Element, text: string) => Promise<void>
    },
) {
    const emailInput = canvas.getByLabelText(/email/i, { selector: 'input' })
    const passwordInput = canvas.getByLabelText(/password/i, { selector: 'input' })

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, ValidEmail)
    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, ValidPassword)

    return canvas.getByRole('button', { name: /log in/i })
}
