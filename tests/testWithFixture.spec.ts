import {test} from '../test-options'
import {faker} from '@faker-js/faker'

// test.beforeEach(async({page}) => {
//     await page.goto('/')
// })

test('parametrized methods', async({pageManager}) => { //add fixture here, remove if fixture auto: true
    // change page fixture of playwright to custom pageManager fixture
    //generate random test data
    const randomFullName = faker.person.fullName() //generate random fullnames
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com` // randomFullName.replace(/\s+/g, '') to remove all whitespaces

    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialAndSelectOption(process.env.USERNAME, process.env.PASSWORD, "Option 1")
    await pageManager.onFormLayoutsPage().submitInlineFormWithCredentialAndSelectOption(randomFullName, randomEmail, false)
})