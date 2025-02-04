import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase{

    //private readonly page: Page
    constructor(page: Page){
        //this.page = page
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)

    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){
        let date = new Date() // Date() is a JS objects that can perform different operations with the date and time
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'}) //
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'}) //
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent() //get text displayed  in the current date picker selector
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} ` // expected month and year
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) { // if displayed month and year doesn't include expected month and year
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click() // click on the chevron right to flip the month to the right
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent() // get the displayed month and year
            //repeat the cycle, once match, stop the while loop
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()
        // getByText('1', {exact: true}) to click on the exact day 1
        return dateToAssert
    }

}