import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test('navigate to form page', async({page}) =>{
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)

    //generate random test data
    const randomFullName = faker.person.fullName() //generate random fullnames
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com` // randomFullName.replace(/\s+/g, '') to remove all whitespaces

    await pm.navigateTo().formLayoutPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialAndSelectOption("test@test.com", "abcabc", "Option 1")
    await pm.onFormLayoutsPage().submitInlineFormWithCredentialAndSelectOption(randomFullName, randomEmail, false)

    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(7)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6,15)
})
