import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 40000, //change test timeout (default = 30s) for the whole framework/test run
  globalTimeout: 60000,
  expect:{   //set expect timeout for locator assertion
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50} 
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    // ['allure-playwright'],
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:4200',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4202' // if process env dev is equal to 1 then (?) url will be ...
          :  process.env.STAGING === '1' ? 'http://localhost:4201' // else (:) process env staging is equal to 1 then url will be ...
          :  'http://localhost:4200', // otherwise use this url 

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // actionTimeout: 5000,
    // navigationTimeout: 5000
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: { 
        ...devices['iPhone 13 Pro'] 
      }
    },
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200' 
      },
    },
    {
      name: 'qa',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200' 
      },
    },
    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts', // run this project to run only this file spec
      use: {
        viewport: {width: 1920, height: 1080} // full screen size
      }
    },
  ]
});
