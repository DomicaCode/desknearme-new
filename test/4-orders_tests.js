import { Selector } from 'testcafe'
import { buyerRole, merchantRole, merchantRoleA } from './pages/roles'
import {
  John,
  myUrl,
  item,
  link,
  itemShow,
  topMenu,
  itemSearch,
  dashboard,
  orders,
  publicProfile,
  Anon,
  SellerMerchantB,
  SellerMerchantA,
  getURL,
  cartPage,
  loginForm,
  soldOrders
} from './pages/fixtures'
import { register, checkErrors, waitForSelector } from './pages/helper'

fixture`Purchase`.page(myUrl)

test('Buying two items by registered user', async (t) => {
  await t
    .useRole(buyerRole)
    .typeText(itemSearch.quickSearch.keyword, item.commonName)
    .click(itemSearch.buttons.quickSearch)
    .expect(itemSearch.links.commonItem.exists).ok()
    .click(itemSearch.links.commonItem)

  await t.click(itemShow.buttons.buy)
  await checkErrors()
  await t.click(orders.buttons.checkout)
  await t.typeText(orders.inputs.phone, '123456')
  await t
    .click(orders.labels.homeDelivery)
    .typeText('#address_full_name', 'Address')
    .typeText('#address_country', 'Country')
    .typeText('#address_city', 'City')
    .typeText('#address_state', 'State')
    .typeText('#address_zip', 'zip')
    .typeText('#address_street', 'street')
    .typeText('#address_building_number', '12')
    .typeText('#address_flat_number', '21')
    .click('input[data-tc="save-default-address"]')
    .click(orders.labels.examplePayment)
  await t
    .click(orders.buttons.review_and_confirm)
    .click(orders.buttons.confirm)
    .click(orders.buttons.paySuccess)
  })

fixture`Save default address`.page(myUrl)

test('Buying another item', async (t) => {
  await t.useRole(buyerRole)
  await t.typeText(itemSearch.quickSearch.keyword, SellerMerchantA.item)

    .click(itemSearch.buttons.quickSearch)
    .click(Selector('a').withText(SellerMerchantA.item))
    .click(itemShow.buttons.buy)
    .click(orders.buttons.checkout)
  await t.typeText(orders.inputs.phone, '123456')
    .click(orders.labels.homeDelivery)

  await t
    .expect(Selector('#address_full_name').withAttribute('value', 'Address').exists).ok()
    .expect(Selector('#address_country').withAttribute('value', 'Country').exists).ok()
    .expect(Selector('#address_city').withAttribute('value', 'City').exists).ok()
    .expect(Selector('#address_state').withAttribute('value', 'State').exists).ok()
    .expect(Selector('#address_zip').withAttribute('value', 'zip').exists).ok()
    .expect(Selector('#address_street').withAttribute('value', 'street').exists).ok()
    .expect(Selector('#address_building_number').withAttribute('value', '12').exists).ok()
    .expect(Selector('#address_flat_number').withAttribute('value', '21').exists).ok()
    .wait(50)

  await t
    .click(orders.labels.examplePayment)
    .click(orders.buttons.review_and_confirm)
    .click(orders.buttons.confirm)
    .click(orders.buttons.paySuccess)
})

fixture`Stock / cart`.page(myUrl)

test.skip('Stock of this item ^ decreased by 1', async (t) => {
  await t
    .useRole(merchantRole) // seller checks if his order shown as paid
    .click(topMenu.buttons.profileDropdown)
    .click(topMenu.profileDropdown.selling)


    await t.expect(Selector('ul[data-tc="inventory-product"]').withText(item.commonName).exists).ok()

    let stockOfThisItem = Selector('ul[data-tc="inventory-product"]').withText(item.commonName).find('li[data-tc="inventory-product-quantity"]')

    await waitForSelector(stockOfThisItem.withExactText('1'), "Expects stock of johnsmith watch decreased from 2 to 1")
})


test('Add same item to cart, check if previously finalised order doesn\'t change', async (t) => {
  await t
    .useRole(buyerRole)
    .typeText(itemSearch.quickSearch.keyword, item.commonName)
    .click(itemSearch.buttons.quickSearch)

    .expect(itemSearch.links.commonItem.exists)
    .ok()

    .click(itemSearch.links.commonItem)
    await t.click(itemShow.buttons.buy)

    .wait(500)

    await t
    .expect(await getURL()).contains(myUrl + '/dashboard/buy/cart')

    .click(topMenu.buttons.cart)

    await t
    .expect(await getURL()).contains(myUrl + '/dashboard/buy/cart')

    await t
    .expect(cartPage.product.exists).ok()

    await t
    .expect(cartPage.productQuantity.withAttribute('value', '1').exists).ok()

    .click(orders.buttons.removeFromCart)

  await t.navigateTo(myUrl + "/dashboard/buy/orders")

  let countOrders = orders.cards.card.withText(John.name).count

  await waitForSelector(orders.cards.card.withText(John.name), "Expects order with John Smith name")
  await t.expect(countOrders).eql(1)
})

fixture`Purchasing as anonymous visitor`.page(myUrl)

test('Buying an item by anon', async (t) => {
  await t
    .typeText(itemSearch.quickSearch.keyword, item.commonName)
    .click(itemSearch.buttons.quickSearch)

    .expect(itemSearch.links.commonItem.exists).ok()
    .click(itemSearch.links.commonItem)
    .click(itemShow.buttons.buy)
  await checkErrors()

  await t
    .click(orders.buttons.checkout)
    .click(Selector('a').withText('Register'))
  await register(Anon)
  await t.typeText(orders.inputs.phone, Anon.phone)
  await t
    .click(orders.labels.personalPickup)
    .click(orders.labels.examplePayment)
    .click(orders.buttons.review_and_confirm)
    .click(orders.buttons.confirm)
    .click(orders.buttons.paySuccess)

  await t
    .useRole(merchantRole) // seller checks if his order shown as paid
    .click(topMenu.buttons.profileDropdown)
    .click(topMenu.profileDropdown.selling)
    .click(dashboard.nav.sold) // seller's order check

  await checkErrors()
})

fixture`Expiration`.page(myUrl)

test.page(myUrl + '/sessions/new')('Proceed checkout and abandon payment for expire test', async (t) => {
  await t
    .typeText(loginForm.inputs.email, Anon.email)
    .typeText(loginForm.inputs.password, Anon.password)
    .click(loginForm.buttons.logIn)
    .typeText(itemSearch.quickSearch.keyword, SellerMerchantA.item)
    .click(itemSearch.buttons.quickSearch)
    .click(Selector('a').withText(SellerMerchantA.item))
    .click(itemShow.buttons.buy)
    .click(orders.buttons.checkout)
    await t.typeText(orders.inputs.phone, Anon.phone)
    .click(orders.labels.personalPickup)
    .click(orders.labels.examplePayment)
    .click(orders.buttons.review_and_confirm)
    .click(orders.buttons.confirm)
})

fixture`Profile view aspect`.page(myUrl)

test('Expects an item in products that belongs to the profile we are currently visiting', async (t) => {
  await t
    .useRole(merchantRole)
    .navigateTo(myUrl + '/profile/' + SellerMerchantB.name)
    .click(publicProfile.menu.products)
  await
    checkErrors()

  await t.expect(link.withText("Watch").exists).ok()
})

fixture`Stock / cart`.page(myUrl)

test.page(myUrl + '/search')('Item status is out of stock', async (t) => {
  await t
    .useRole(merchantRole)
    .typeText(itemSearch.quickSearch.keyword, item.commonName)
    .click(itemSearch.buttons.quickSearch)
    .click(itemSearch.links.commonItem)
  await waitForSelector(Selector('div').withText('SOLD OUT'), "Expects order with status 'SOLD OUT'")
})

fixture`Delivery / order acceptance`.page(myUrl)

test('Delivery', async (t) => {
  await t
    .useRole(merchantRole)
    .navigateTo(soldOrders.url)

  await waitForSelector(soldOrders.johnSmithOrderId, "Expects there is order from john smith")

  //var countOrders = orders.orders.orderNumber.count

  await t
    //.expect(countOrders).eql(2) - Check later if order count is correct

    .click(soldOrders.johnSmithOrderId)
    .typeText(soldOrders.delivery.information, "delivered", { replace: true })

    .expect(soldOrders.delivery.statuses.inProgress.exists).ok()

    .click(soldOrders.delivery.saveDeliveryInfo)
    .click(soldOrders.delivery.markAsCompleted)
})

fixture`Returns`.page(myUrl)

test('Return item by buyer', async (t) => {
  await t
    .useRole(buyerRole)
    .navigateTo(orders.urls.buyer)

    .click(Selector('article').withText('COMPLETED').find('a').withText('View details'))

    .expect(orders.statuses.delivered.exists).ok()

    await t.wait(100)

    await waitForSelector(orders.buttons.return, "Expects return button")
    await t.click(orders.buttons.return)

    .typeText(orders.inputs.returnReason, 'Damaged Necklace')
    .typeText(orders.inputs.returnDescription, 'Necklace which has arrived is damaged')
    .click(orders.checkboxes.returnToStore)
    .click(orders.buttons.sendReturnRequest)
  })

test('Accept return by merchant', async (t) => {
  await t
    .useRole(merchantRole)
    .navigateTo(soldOrders.url)

    var orderIdWithDeliveredStatus = Selector('ul').withText('COMPLETED').find(('a[data-tc="order-id"]'))

    await t.click(orderIdWithDeliveredStatus)

    .expect(soldOrders.delivery.statuses.returnRequested.exists).ok()

    .click(soldOrders.returns.buttons.returnDetails)
    .click(soldOrders.returns.buttons.accept)
})

// TODO: fix me please
// test.page(myUrl + '/search')('Wishlist', async (t) => {
//   await t
//     .useRole(buyerRole)
//     .typeText(itemSearch.quickSearch.keyword, "Rochees RW38 Analog Watch")
//     .click(itemSearch.buttons.quickSearch)
//     .click(Selector('a').withText('Rochees RW38 Analog Watch'))
//     .click(Selector('button[data-tc="wishlist-item"]'))
//     .click(Selector('a[data-tc="wishlist"]'))
//     .expect(Selector('li a').withText("Rochees RW38 Analog Watch").exists).ok()
//     .click(Selector('a').withText('Rochees RW38 Analog Watch'))
//     .click(Selector('button[data-tc="wishlist-item"]'))
//     .click(Selector('a[data-tc="wishlist"]'))
//     .expect(Selector('li a').withText("Rochees RW38 Analog Watch").exists).notOk()
// })

fixture`Cancellation`.page(myUrl)

test('Order cancel by merchant', async (t) => {
  await t
    .useRole(merchantRole)
    .navigateTo(myUrl + '/dashboard/sell/orders')

  var orderIdWithNewStatus = Selector('ul').withText('IN PROGRESS').find(('a[data-tc="order-id"]'))

  await t
    .click(orderIdWithNewStatus)
    .click(soldOrders.cancellation.cancelCheckbox)
    .setNativeDialogHandler(() => true)

  await t
    .click(soldOrders.cancellation.confirmCancel)
    .expect(Selector('h3').withText('Cancelled order').exists).ok()
    .expect(Selector('p').withText('Cancelled by you').exists).ok()
})

fixture`Orders search`.page(myUrl)

test.skip('Merchant can use order statuses filters', async (t) => {
  await t
    .useRole(merchantRole)
    .navigateTo(myUrl + '/dashboard/sell/orders')

  await t.expect(soldOrders.order.count).eql(2)

  await t
    //.expect(soldOrders.orderStatus.withText('RETURNED').exists).ok()
    .expect(soldOrders.orderStatus.withText('CANCELLED BY YOU').exists).ok()

  await t
    .click(soldOrders.buttons.filters)
    .click(soldOrders.filters.new)
    .click(soldOrders.filters.returned)
    .click(soldOrders.filters.delivered)
    .click(soldOrders.filters.cancelledByYou)
    .wait(100)
    .click(soldOrders.buttons.applyFilters)
    .wait(200)
    .expect(soldOrders.order.count).eql(0)

  await t
    .click(soldOrders.buttons.filters).click(soldOrders.filters.returned).wait(100)
    .click(soldOrders.buttons.applyFilters).wait(200)
    //.expect(soldOrders.order.count).eql(1)

  await t
    .click(soldOrders.buttons.filters)
    .click(soldOrders.filters.cancelledByYou)
    .wait(100)
    .click(soldOrders.buttons.applyFilters)
    .wait(200)

    waitForSelector(soldOrders.orderStatus.withText('CANCELLED BY YOU'), "Expects order with status 'CANCELLED BY YOU'")

  //await t.expect(soldOrders.order.count).eql(1)
})

fixture`Delivery / order acceptance`.page(myUrl)

test('Second order acceptance by other merchant(A)', async (t) => {
  await t
    .useRole(merchantRoleA)
    .navigateTo(myUrl + '/dashboard/sell/orders')
  await waitForSelector(soldOrders.johnSmithOrderId, "Expects there is order from john smith")

  var countOrders = orders.orders.orderNumber.count

  await t
    .expect(countOrders).eql(1)

    .click(soldOrders.johnSmithOrderId)
    .typeText(soldOrders.delivery.information, "delivered", { replace: true })

    .expect(soldOrders.delivery.statuses.inProgress.exists).ok()

    .click(soldOrders.delivery.saveDeliveryInfo)
    .click(soldOrders.delivery.markAsCompleted)
})
