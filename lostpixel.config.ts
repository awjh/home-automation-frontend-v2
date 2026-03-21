import { CustomProjectConfig } from 'lost-pixel'

// Optionally filter stories by ID via LOST_PIXEL_FILTER env var.
// Example: LOST_PIXEL_FILTER=calendar yarn lost-pixel
const filter = process.env.LOST_PIXEL_FILTER?.toLowerCase()

export const config: CustomProjectConfig = {
    storybookShots: {
        // Points to the built Storybook output (run `yarn build-storybook` first)
        storybookUrl: './storybook-static',
        breakpoints: [375, 768, 1280], // mobile, tablet, desktop
        // Mask the Chakra toast element — its position is non-deterministic
        mask: [{ selector: '[data-scope="toast"]' }],
    },
    // OSS mode — run locally, store baselines in .lostpixel/baseline/
    generateOnly: true,
    failOnDifference: true,
    filterShot: ({ id }) => {
        const storyId = (id ?? '').toLowerCase()
        if (filter) return storyId.includes(filter)
        return true
    },
}
