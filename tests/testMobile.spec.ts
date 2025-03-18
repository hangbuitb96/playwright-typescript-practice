import {test, expect} from '@playwright/test'


test('input fields', async({page}, testInfo) => {
    await page.goto('/', {waitUntil: 'domcontentloaded'})
    
    // if this test is run under project 'mobile' then do the below step, if not then ignore it
    if(testInfo.project.name == 'mobile'){ 
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    if(testInfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }

    const usingGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

    await usingGridEmailInput.fill('test1@test.com')
    await usingGridEmailInput.clear()
    await usingGridEmailInput.pressSequentially('test2@test.com', {delay: 100})
    await expect(usingGridEmailInput).toHaveValue('test2@test.com') // toHaveValue() use for input data in an input field
})