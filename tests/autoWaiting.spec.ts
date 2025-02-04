import {test, expect} from '@playwright/test'

// await - used for some promises methods (see docs)
// that can wait for the certain desired condition up to the limit of the timeout
// default = 30s
test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000) //modify (add 2s to) test timeout for a particular test suite
})

test('auto waiting', async({page}) => {
    const successBtn = page.locator('.bg-success')

    //___use default wait for some promises methods
    // await successBtn.click()

    // const text = await successBtn.textContent()
    // expect(text).toEqual('Data loaded with AJAX get request.')

    //___ additional wait for methods that don't have auto waiting implemented
    // await successBtn.waitFor({state: "attached"})
    // const text = await successBtn.allTextContents()
    // expect(text).toContain('Data loaded with AJAX get request.')

    //___override the particular expect timeout for this test only
    await expect(successBtn).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative wait', async({page}) => {
    const successBtn = page.locator('.bg-success')
    // ___wait for elemtent
    // await page.waitForSelector('.bg-success')

    //___wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata') //reuqest URL

    //___wait for network calls to be completed (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle')
    //....
    const text = await successBtn.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async({page}) => {
    //test.setTimeout(20000)  //to overwrite the test timeout set in playwright.config.ts for a particular test
    test.slow() // increase the default timeout set in playwright.config.ts in 3 times (x3)
    const successBtn = page.locator('.bg-success')

    await successBtn.click({timeout: 16000}) // set action timeout - to overwrite the action timeout set in playwright.config.ts

})