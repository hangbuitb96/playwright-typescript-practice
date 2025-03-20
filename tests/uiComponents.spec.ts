import {test, expect} from '@playwright/test'
import { time } from 'console'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('Form Layouts page @block', () => {
    test.describe.configure({retries: 0})
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}, testInfo) => {
        if(testInfo.retry){
            //do something such as clean DB
        }
        const usingGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingGridEmailInput.fill('test1@test.com')
        await usingGridEmailInput.clear()
        //simulate the keystrokes, with x ms delay typing one key
        await usingGridEmailInput.pressSequentially('test2@test.com', {delay: 100})

        //generic assertion
        const inputValue = await usingGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingGridEmailInput).toHaveValue('test2@test.com') // toHaveValue() use for input data in an input field
    })

    test.only('radio buttons', async({page}) =>{
        const usingGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        //await usingGridForm.getByLabel('Option 1').check({force: true})
        await usingGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        // const radioStatus = await usingGridForm.getByRole('radio', {name: "Option 1"}).isChecked() //return boolean
        await expect(usingGridForm).toHaveScreenshot({maxDiffPixels: 50}) 
        
        
        
        // expect(radioStatus).toBeTruthy()
        // await expect(usingGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()
        
        // await usingGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        // expect(await usingGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    
    })
})

test.describe('Toastr page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
    })

    test('checkboxes', async({page}) =>{
        //await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true})
        await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
        await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true})
        await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){ // for of loop for array //.all() will convert the boxes list to an array
            await box.uncheck({force: true}) //uncheck all boxes
            expect(await box.isChecked()).toBeFalsy() 
        }
    })
})

test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') //when the list has a UL tag
    page.getByRole('listitem') //when the list has LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)') // css - ('attribute', 'its value')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()
    for(const color in colors) { // for in loop for object
        await optionList.filter({hasText: color}).click() //click on each color in the list
        await expect(header).toHaveCSS('background-color', colors[color]) //assert
        if(color !="Corporate")
            await dropDownMenu.click() // open the dropdown list to click on the next color 
    }

})

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()
    
    // page.getByRole('tooltip)') // if the web element has a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => { // create a dialog listener to access to browser dialog
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept() // accept the action in dialog
    })
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1 get the row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()

    // edit 
    await page.locator('input-editor').getByPlaceholder("Age").clear()
    await page.locator('input-editor').getByPlaceholder("Age").fill('35')
    await page.locator('.nb-checkmark').click()

    // 2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowByID = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth('1').getByText('11')}) 
    // page.getByRole('row', {name: "11"}) -> return 2 rows
    // .filter({has: page.locator('td').nth('1').getByText('11')}) -> filter column by index 1-> column 2 and has text 11
    
    //edit email
    await targetRowByID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder("E-mail").clear()
    await page.locator('input-editor').getByPlaceholder("E-mail").fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')

    // 3 test filter of the table
    const ages = ["20", "30", "40", "200"] // create all test data 
    for( let age of ages){ // create a loop to loop throught each of the test data
        // find Age filter input field and type in the test data
        await page.locator('input-filter').getByPlaceholder("Age").clear()
        await page.locator('input-filter').getByPlaceholder("Age").fill(age)
        await page.waitForTimeout(500) // hardcode wait
        //find all rows as the result of the search output
        const ageRows = page.locator('tbody tr')
        //lopping through each of the row
        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent() // to find the content of the last column
            
            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }
            else {
                expect(cellValue).toEqual(age)
            }
            
        }
    }
})

test('date picker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

const calendarInputField = page.getByPlaceholder('Form Picker')
await calendarInputField.click()

let date = new Date() // Date() is a JS objects that can perform different operations with the date and time
date.setDate(date.getDate() + 100)
const expectedDate = date.getDate().toString()
const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'}) //
const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'}) //
const expectedYear = date.getFullYear()
const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent() //get text displayed  in the current date picker selector
const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} ` // expected month and year
while(!calendarMonthAndYear.includes(expectedMonthAndYear)) { // if displayed month and year doesn't include expected month and year
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click() // click on the chevron right to flip the month to the right
    calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent() // get the displayed month and year
    //repeat the cycle, once match, stop the while loop
}
await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
// getByText('1', {exact: true}) to click on the exact day 1

await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    //1 update HTML attribute 
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => { //use evaluate expression 
        //then set the values of the desired coordinates
        node.setAttribute('cx', '227.8310426688925')
        node.setAttribute('cy', '227.8310426688925')
    })
    //need to trigger action on this web element
    await tempGauge.click()

    //2 mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    //define a bounding box of the area where you want to start with bounding box
    const  box = await tempBox.boundingBox()
    //get the center of the bounding box
    const x = box.x + box.width / 2
    const y = box.y + box?.height / 2
    //move the mouse around the screen
    // trigger the mouse commands providing x and y coordinates
    await page.mouse.move(x,y) 
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})

    

