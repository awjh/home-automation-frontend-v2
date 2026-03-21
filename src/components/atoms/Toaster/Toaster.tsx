import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import useToaster from '@hooks/useToaster'

export default function Toaster() {
    const toaster = useToaster()
    const { keyColors } = useColorMode()

    return (
        <Portal>
            <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
                {(toast) => (
                    <Toast.Root
                        width={{ md: 'sm' }}
                        color={
                            toast.type === 'success' || toast.type === 'error'
                                ? keyColors.secondary
                                : keyColors.primary
                        }
                        bg={toast.type === 'success' ? keyColors.primary : undefined}
                        borderColor={toast.type === 'error' ? 'red.600' : keyColors.primary}
                        borderWidth={2}
                        borderRadius={0}
                    >
                        {toast.type === 'loading' ? (
                            <Spinner size="sm" color={keyColors.primary} />
                        ) : (
                            <Toast.Indicator />
                        )}
                        <Stack gap="1" flex="1" maxWidth="100%">
                            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description && (
                                <Toast.Description>{toast.description}</Toast.Description>
                            )}
                        </Stack>
                        {toast.action && (
                            <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
                        )}
                        {toast.closable && <Toast.CloseTrigger />}
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    )
}
