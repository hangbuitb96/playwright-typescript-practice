import {test as base} from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({ //extend the type TestOptions
    globalsQaURL: ['', {option: true}], // '' is default value, could be empty or a string

    formLayoutsPage: async({page}, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('')
        console.log('Tear down')
    },
    
    pageManager: async({page, formLayoutsPage}, use) => { 
        const pm = new PageManager(page)
        await use(pm)
    }
    //formLayoutsPage is fixture dependency for pageManager fixture
    //pageManager fixture will trigger formLayoutsPage to initialize first
    //then pageManager will be initialized -> instance of pageManager will be passed to the test
})