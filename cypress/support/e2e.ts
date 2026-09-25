import './commands'

// The Next.js dev tools badge is fixed to the bottom-left of the page in `next dev` and can
// cover elements Cypress needs to click, so hide it for all tests
Cypress.on('window:load', (win) => {
    const style = win.document.createElement('style')
    style.textContent = 'nextjs-portal { display: none !important; }'
    win.document.head.appendChild(style)
})
