import {test as base} from '@playwright/test'

export type TestOptions = {
    globalsQaURL: string
}

export const test = base.extend<TestOptions>({ //extend the type TestOptions
    globalsQaURL: ['', {option: true}] // '' is default value, could be empty or a string
})