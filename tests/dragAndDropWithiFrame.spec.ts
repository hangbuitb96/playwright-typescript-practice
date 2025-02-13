import {expect} from '@playwright/test'
import {test} from '../test-options' //because in test-options.ts, test is imported from @playwright/test

test('drag and drop with iframe', async({page, globalsQaURL}) => {
    await page.goto(globalsQaURL)

    //switch to the iframe
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    //find the locator within the iframe, drag to another locator
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))
    
    // more precise control
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()
    
    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})