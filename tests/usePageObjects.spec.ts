import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to form page @smoke @regression', async({page}) =>{
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke', async({page}) => {
    const pm = new PageManager(page)

    //generate random test data
    const randomFullName = faker.person.fullName() //generate random fullnames
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com` // randomFullName.replace(/\s+/g, '') to remove all whitespaces

    await pm.navigateTo().formLayoutPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialAndSelectOption(process.env.USERNAME, process.env.PASSWORD, "Option 1")
    await page.screenshot({path: 'screenshots/formsLayoutPage.png'}) // take screenshot of entire window
    const buffer = await page.screenshot() // save the screenshot in an variable to integrate with other services
    // console.log(buffer.toString('base64'))
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'}) // take screenshot of a specific area
    await pm.onFormLayoutsPage().submitInlineFormWithCredentialAndSelectOption(randomFullName, randomEmail, false)

    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(7)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(1,5)
})
