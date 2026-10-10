import { buildRecord } from './recordBuilders/buildRecord'

// Records can't be deleted through the API yet, so each test uses its own title and catalogue number

describe('record page', () => {
    beforeEach(() => {
        cy.loginAsTestUser('/records/add')
    })

    it('shows the record details, tags and tracklist', () => {
        const title = `Cypress Record View ${Date.now()}`
        const record = buildRecord(title, {
            artists: ['Cypress Artist', 'Cypress Featured Artist'],
            sides: [
                {
                    name: 'A',
                    songs: [
                        { title: 'Cypress Song A1', duration: 185 },
                        { title: 'Cypress Song A2', duration: 254 },
                    ],
                },
                { name: 'B', songs: [{ title: 'Cypress Song B1', duration: 200 }] },
            ],
        })

        cy.createRecord(record).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.title().should('eq', `${title} - Cypress Artist, Cypress Featured Artist`)
            cy.contains('h1', title).should('be.visible')
            cy.contains('h2', 'Cypress Artist').should('contain.text', 'Cypress Featured Artist')
            cy.getByTestId('record-details').should(
                'have.text',
                `Cypress Label · ${record.catNo} · 2024`,
            )
            cy.contains('rock').should('be.visible')
            cy.contains('black').should('be.visible')

            cy.contains('Tracklist').should('be.visible')
            cy.contains('h3', 'Side A').should('be.visible')
            cy.contains('h3', 'Side B').should('be.visible')
            // Track numbers restart on each side
            cy.contains('1. Cypress Song A1').should('be.visible')
            cy.contains('2. Cypress Song A2').should('be.visible')
            cy.contains('1. Cypress Song B1').should('be.visible')
            cy.contains('03:05').should('be.visible')
            cy.contains('04:14').should('be.visible')
            cy.contains('03:20').should('be.visible')
        })
    })

    it('shows the record artwork', () => {
        const title = `Cypress Record Image ${Date.now()}`

        cy.createRecord(buildRecord(title, { image: '/recipe.jpg' })).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.get(`img[alt="${title}"]`)
                .should('be.visible')
                .and('have.attr', 'src')
                .and('include', 'recipe.jpg')
        })
    })

    it('shows a placeholder when the record has no artwork', () => {
        const title = `Cypress Record No Image ${Date.now()}`

        cy.createRecord(buildRecord(title)).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.contains('h1', title).should('be.visible')
            cy.get(`img[alt="${title}"]`).should('not.exist')
        })
    })

    it('replaces the record artwork with an uploaded file', () => {
        const title = `Cypress Record Change Image ${Date.now()}`

        cy.createRecord(buildRecord(title, { image: '/recipe.jpg' })).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.get(`img[alt="${title}"]`).should('have.attr', 'src', '/recipe.jpg')

            cy.openEditImagePopup()
            cy.getByTestId('edit-image-popup').within(() => {
                cy.get('input[type="file"]').selectFile('public/recipe.jpg')
                cy.clickButtonByText('Save')
            })

            cy.getByTestId('edit-image-popup').should('not.exist')
            cy.contains(/updated image/i).should('be.visible')

            cy.getRecord(recordId).then((record) => {
                expect(record.image).to.be.a('string').and.not.equal('/recipe.jpg')

                const assertShowsUploadedImage = () =>
                    cy
                        .get(`img[alt="${title}"]`)
                        .should('be.visible')
                        .and(($img) => {
                            expect($img.attr('src')).to.include(record.image)
                            expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0)
                        })

                assertShowsUploadedImage()

                // Still shown after a reload, so it was saved rather than only held in state
                cy.reload()
                assertShowsUploadedImage()
            })
        })
    })

    it('removes the record artwork', () => {
        const title = `Cypress Record Remove Image ${Date.now()}`

        cy.createRecord(buildRecord(title, { image: '/recipe.jpg' })).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.get(`img[alt="${title}"]`).should('be.visible')

            cy.openEditImagePopup()
            cy.getByTestId('edit-image-popup').within(() => {
                cy.getInputByLabel(/would you like to remove the image/i, 'select').select('yes', {
                    force: true,
                })
                cy.contains('label', /how would you like to provide the image/i).should('not.exist')
                cy.clickButtonByText('Remove')
            })

            cy.getByTestId('edit-image-popup').should('not.exist')
            cy.contains(/removed image/i).should('be.visible')
            cy.get(`img[alt="${title}"]`).should('not.exist')

            cy.getRecord(recordId).its('image').should('be.undefined')

            cy.reload()
            cy.contains('h1', title).should('be.visible')
            cy.get(`img[alt="${title}"]`).should('not.exist')
        })
    })
})
