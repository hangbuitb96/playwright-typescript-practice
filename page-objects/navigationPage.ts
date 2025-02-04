//Import the Page class from the Playwright testing library. 
//Page is a central concept in Playwright that represents a single tab or browser window.
import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

//This defines a class called NavigationPage. 
//The 'export' keyword makes this class available for use in other files (modules).
export class NavigationPage  extends HelperBase{

    //create a new field inside of this class
    //A 'readonly' property called page is defined. 
    //This property is of type Page, which is the type imported from Playwright. 
    //The 'readonly' modifier means that the value of this property cannot be changed after it's initialized 
    //(it can only be set in the constructor).
    // readonly page: Page 
    readonly formLayoutsMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly startTableMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator


    //The constructor method is used to initialize an instance of the class. 
    //It takes a 'page' parameter of type 'Page' and assigns it to the 'page' property.
    //The 'page' object in Playwright allows you to interact with the content of a web page, 
    //such as clicking elements, filling forms, etc.
    //This constructor expects a page parameter to be passed inside of this class
    //inside of the constructor, we need to put a required parameter 
    //that we expect to construct when we call this page object
    constructor(page: Page){ //page parameter will have type of Page
        //assign the parameter (page) to the local field of this class (page)
        //this.page = page 
        super(page)
        //'this' means we want to use a field (page) or the variable or property related only to this particular class
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.startTableMenuItem = page.getByText('Smart Table')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')

    }   
    
    async formLayoutPage(){
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
        //we're going to use this page: Page instance of the page 
        //that we're going to read from the constructor
        //and this instance will be passed from our test
        await this.waitForNumberOfSeconds(2)
    }

    async datePickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenuItem.click()
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.startTableMenuItem.click()
    }

    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false")
            await groupMenuItem.click()
    }
}