import { Selector, ClientFunction, t } from 'testcafe'
import { buyerRole, sellerRole, merchantRole, randomPersonRole } from './pages/roles'
import {
  John,
  SellerRandomUser,
  myUrl,
  item,
  editedItem,
  link,
  itemShow,
  editedItemShow,
  newItemForm,
  topMenu,
  itemSearch,
  dashboard,
  orders,
  publicProfile,
  permissionDenied,
  Anon,
  SellerMerchantB,
  SellerMerchantA,
  getURL,
  cartPage,
  loginForm,
  soldOrders
} from './pages/fixtures'
import { register, createItem, checkErrors, waitForSelector } from './pages/helper'

fixture`Item tests`.page(myUrl)


test('Creating item', async (t) => {
  await t.useRole(randomPersonRole)

  await t.navigateTo(myUrl + '/dashboard/sell/items')
  await t.click(newItemForm.buttons.createOrganization)

  await createItem(item.name, item.description, item.price)
  //checks if all data is correct
  await
    checkErrors()

  await t
    .wait(500)
    .click(topMenu.buttons.changeLanguageToDE)

    .expect(itemShow.fields.nameDE.exists).ok()
    .expect(itemShow.fields.descriptionDE.exists).ok()

    .expect(itemShow.fields.price.innerText)
    .eql('$10,000', 'expect item price is 10.000$')

    .expect(itemShow.fields.displayImage).ok()

    .click(topMenu.buttons.changeLanguageToEN)

    .expect(itemShow.fields.name.exists).ok()
    .expect(itemShow.fields.description.exists).ok()

    .expect(itemShow.fields.price.innerText)
    .eql('$10,000', 'expect item price is 10.000$')

    .expect(itemShow.fields.displayImage).ok()

  var editItemUrl = await Selector('a')
    .withText('Edit Item')
    .getAttribute('href')

  await t
    .navigateTo(myUrl + '/dashboard/sell/items')

  await waitForSelector(Selector('#data-breadcrumb-header').withText('Inventory (1)'), "Waiting for breacrumb with text 'Inventory (1)'")
  await t.expect(Selector('section.table ul').count).eql(1)
    .expect(Selector('section.table ul > li').withText(item.name).exists).ok()

  // Break-in test
  await t.useRole(merchantRole)
  await t.navigateTo(myUrl + editItemUrl)

  await t.expect(Selector('div').withText(permissionDenied).exists).ok()
})

test('Editing item and search', async (t) => {
  await t
  //item search
    .useRole(randomPersonRole)
  await t
    .typeText(itemSearch.quickSearch.keyword, item.name)
    .click(itemSearch.buttons.quickSearch)
    .click(itemSearch.links.item)


  //change of item information
  await t.click(itemShow.buttons.edit)

  await
    checkErrors()
  await t.typeText(newItemForm.inputs.name, editedItem.name, { replace: true })
  await t.typeText(newItemForm.inputs.description, editedItem.description, {
    replace: true,
  })
  await t.typeText(newItemForm.inputs.price, editedItem.price, {
    replace: true,
  })
  await t.click(newItemForm.buttons.submit)

  await t.expect(editedItemShow.fields.name.exists).ok()
  await t.expect(editedItemShow.fields.description.exists).ok()
  await t
    .expect(editedItemShow.fields.editedPrice.innerText)
    .eql('$5,000', 'check item\'s price')
})

test('Delete created item', async (t) => {
  await t
    .useRole(randomPersonRole)
    .click(topMenu.buttons.profileDropdown)
    .click(topMenu.buttons.selling)
  await
    checkErrors()
  await t.setNativeDialogHandler(() => true).click(itemShow.buttons.delete)

  //after fix write tests here to ensure item is correctly deleted
})

test('Creating new item for sell', async (t) => {
  await t.useRole(merchantRole)
  await createItem(item.commonName, item.description, item.price)
})

test.page(myUrl +"/search?keyword=Aries Gold G 729 S-BK&category=&sort_by=relevance&submit=search")('Cart', async (t) => {
  await t.click(itemSearch.results.seededAvailableItem)
    .click(itemShow.buttons.buy)
    .typeText(Selector('input[name="line_item[quantity]"]'), "2", { replace: true })

  const orderTotalPrice = (Selector('ul').find('#data-order-totalprice').innerText)

  await t.expect(Selector('#data-item-totalprice').innerText).eql(await orderTotalPrice)

  await
    checkErrors()
  await t.click(orders.buttons.removeFromCart)
  await t.wait(500)

  await t.expect(Selector('div p').withText('There are no items in your cart').exists).ok()
  await t.expect(Selector('p a').withText('Browse products').exists).ok()
  await t.expect(Selector('h2').withText('My Cart (0)').exists).ok()
  // later add some expect for empty cart
})
