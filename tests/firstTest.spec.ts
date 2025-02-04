import {test, expect} from '@playwright/test'

// create test hook
test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) => {
    // by Tage name
    await page.locator('input').first().click()

    // by ID
    await page.locator('#inputEmail1').click()

    // by class value
    page.locator('.shape-rectangle')

    // by Attribute
    page.locator('[placeholder="Email"]')

    // by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput=""]')

    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()
    
    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the grid').click()

    await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()
})

test('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign In"}).first().click()

    // using index nth(x) (NOT RECOMMENDED)
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async({page}) => {
    // hasText - help find the nb-card block by the text wherever inside it
    await page.locator('nb-card', {hasText: "Using the grid"}).getByRole('textbox', {name: "Email"}).click()
    // hasText - help find the nb-card block by the locator wherever inside it
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('.custom-checkbox')}).filter({hasText: "Sign In"}).getByRole('textbox', {name: "Email"}).click()
    //await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign In"}).getByRole('textbox', {name: "Email"}).click()

    //await page.locator(':text-is("Using the grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    const passwordField = basicForm.getByRole('textbox', {name: "Password"})
    const checkMeOut = basicForm.locator('nb-checkbox')
    const signInBtn = basicForm.getByRole('button')
    
    await emailField.fill('test@test.com')
    await passwordField.fill('abcabc')
    await checkMeOut.click()
    await signInBtn.click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('extracting values', async({page}) => {
    //single text value textContent()
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const btnText = await basicForm.locator('button').textContent()
    expect(btnText).toEqual('Submit')

    // all text values allTextContents()
    const allRadioBtnLabel = await page.locator('nb-radio').allTextContents()
    expect(allRadioBtnLabel).toContain('Option 1')

    //input value inputValue()
    const emailField = basicForm.getByRole('textbox', {name: 'Email'})
    await emailField.fill('test@test.com')
    const emailInputValue = await emailField.inputValue()
    expect(emailInputValue).toEqual('test@test.com')

    // attribue value getAttribute()
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('assertions', async({page}) => {
    const basicFormBtn = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    // general assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormBtn.textContent()
    expect(text).toEqual('Submit')

    //Locator assertions - wait up to 5s for the element to be available
    await expect(basicFormBtn).toHaveText('Submit')

    //soft assertions
    //the test can be continue the execution even if the assertion has failed
    await expect.soft(basicFormBtn).toHaveText('Submit5') //intentionally failed
    await basicFormBtn.click() //click anyway  
})



