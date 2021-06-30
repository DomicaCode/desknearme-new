import { Selector } from 'testcafe'
import { buyerRole, sellerRole, merchantRole, merchantRoleA, randomPersonRole } from './pages/roles'
import { myUrl, item, topMenu, SellerMerchantA } from './pages/fixtures'
import { checkErrors } from './pages/helper'

fixture`Reviews`.page(myUrl)

test('User who hasn`t placed any order have empty lists', async (t) => {
  await t
    .useRole(randomPersonRole)

    .click(topMenu.buttons.profileDropdown)
    .click(topMenu.profileDropdown.reviews)
    checkErrors()

  await t
    .expect(Selector('h1').withText("You don't have any item reviews").exists).ok()

    .click(Selector('a').withText('Merchants'))
    checkErrors()

  await t
    .expect(Selector('h1').withText("You don't have any merchant reviews").exists).ok()
})

test("Buyer can put a product's review to order that he have placed before", async (t) => {
  await t
    .useRole(buyerRole)
    .navigateTo(myUrl + '/dashboard/reviews/items')

    let possibleReview = Selector('section div ul')
    let countReviews = possibleReview.count

  await t
    //.expect(countReviews).eql(2)

  await t
    .click(Selector(possibleReview.withText(item.commonName)).find('li').withText('Add review'))

    checkErrors()
  await t
    .click(Selector('span[data-tc="rate-star"]'))

    .typeText(Selector('textarea[placeholder="Product review (optional)"]'), "review-body-description")
    .typeText(Selector('input[name="item_review[pros]"]'), "pros")
    .typeText(Selector('input[name="item_review[cons]"]'), "cons")
    .click(Selector('button').withText('Save review'))
    .click(Selector(possibleReview.withText(SellerMerchantA.item)).find('li').withText('Add review'))
    .click(Selector('span[data-tc="rate-star"]').nth(2))
    .typeText(Selector('textarea[placeholder="Product review (optional)"]'), "review-body-description")
    .typeText(Selector('input[name="item_review[pros]"]'), "pros")
    .typeText(Selector('input[name="item_review[cons]"]'), "cons")
    .click(Selector('button').withText('Save review'))
})

test("Buyer can put a review to merchant, who sold items to him", async (t) => {
  await t
    .useRole(buyerRole)
    .navigateTo(myUrl + '/dashboard/reviews/items')

    let merchantsReviewTab = Selector('li a').withText('Merchants')

  await t
    .click(merchantsReviewTab)

    let possibleReview = Selector('section div ul')
    let countReviews = possibleReview.count

  await t
    .expect(countReviews).eql(2)

    .click(Selector(possibleReview
          .withText("Organization A"))
          .find('li').withText('Add review'))

    checkErrors()
    await t
    .click(Selector('div[data-tc="recommend-merchant"]'))
    .click(Selector('fieldset[data-tc="compilance-rating"]').find('span[data-tc="rate-star"]'))
    .click(Selector('fieldset[data-tc="delivery-rating"]').find('span[data-tc="rate-star"]'))
    .click(Selector('fieldset[data-tc="service-rating"]').find('span[data-tc="rate-star"]'))
    .typeText(Selector('textarea[name="organization_review[body]"]'), "test-review-merchant")
    .click(Selector('button').withText('Save review'))
})
