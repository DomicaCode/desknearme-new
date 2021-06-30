import { Selector } from 'testcafe'
import {
  myUrl,
  Anon,
  loginForm
} from './pages/fixtures'
import { waitForSelector } from './pages/helper'


fixture`Expiration`.page(myUrl)

test.page(myUrl + '/sessions/new')("Unpaid order status is expired after 'x' time", async (t) => {
  await t
    .typeText(loginForm.inputs.email, Anon.email)
    .typeText(loginForm.inputs.password, Anon.password)
    .click(loginForm.buttons.logIn)
    .navigateTo(myUrl + '/dashboard/buy/orders')

    let cancelledOrder = Selector('article').withText('CANCELLED BY YOU')
    let cancelledOrderDetails = cancelledOrder.find('a').withText('View details')

    await waitForSelector(cancelledOrder, "Expects order with status 'CANCELLED BY YOU'")
    await t.click(cancelledOrderDetails)

    let orderStatus = Selector('span[data-tc="order-status"]')

    await waitForSelector(orderStatus.withText('EXPIRED'), "Expects status of order is 'EXPIRED'")
})
