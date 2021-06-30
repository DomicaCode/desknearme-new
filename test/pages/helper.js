import { t, ClientFunction, Selector } from 'testcafe';
import LogInForm from './login'
import ProfileEditForm from './profileEdit'
import TopMenuBtns from './topmenu'
import NewItemForm from './newitem'
import { getURL, myUrl, itemShow, orders, groupsPage } from './fixtures'


const newItemForm = new NewItemForm()
const topMenu = new TopMenuBtns()
const registerForm = new LogInForm()
const profileEditForm = new ProfileEditForm()
const translationMissing = Selector('body').withText('translation missing')

async function checkTranslation(selector) {
  if (await selector.exists) {
    await t.expect(selector.exists).notOk()
  }
};

export async function register(user) {
  checkTranslation(translationMissing)
  await t
    .typeText(registerForm.inputs.firstName, user.firstName)
    .typeText(registerForm.inputs.lastName, user.lastName)
    .typeText(registerForm.inputs.email, user.email)
    .typeText(registerForm.inputs.password, user.password)
    .click(registerForm.buttons.termsAccept)
  await t.click(registerForm.buttons.regSubmit)
};

export async function registerWithProfile(user) {
  checkTranslation(translationMissing)
  await t
    .typeText(registerForm.inputs.firstName, user.firstName)
    .typeText(registerForm.inputs.lastName, user.lastName)
    .typeText(registerForm.inputs.email, user.email)
    .typeText(registerForm.inputs.password, user.password)
    .click(registerForm.buttons.termsAccept)
  await t.click(registerForm.buttons.regSubmit)
  const getLocation = await getURL()

  await t.expect(getLocation).contains(myUrl+ '/dashboard/profile/edit')

    .typeText(profileEditForm.inputs.name, user.name)
    .click(profileEditForm.buttons.save)
};

export async function createItem(itemName, itemDescription, itemPrice) {
  await t
    .click(topMenu.buttons.addDropdown)
    .click(topMenu.buttons.listItem)
    .typeText(newItemForm.inputs.name, itemName)

  await checkTranslation(translationMissing)

  await t
    .typeText(newItemForm.inputs.description, itemDescription)
    .typeText(newItemForm.inputs.price, itemPrice, { replace: true })
    .click(newItemForm.buttons.browseImages)
    .wait(1000)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), ['_uploads_/testimage.png',])
    .wait(1000)
    .typeText(newItemForm.inputs.quantity, "2", { replace: true })
    .wait(1000)
    .click(newItemForm.buttons.submit)

  await t
    .wait(1000)
    .expect(Selector('span').withText('(INVALID)').exists).ok()
    .click(newItemForm.buttons.secondLanguage)
    .typeText(newItemForm.inputs.nameDE, "Beispielartikel")

  await checkTranslation(translationMissing)

  await t
    .typeText(newItemForm.inputs.descriptionDE, "Dies ist eine kurze Beschreibung dieses Artikels")
    .click(newItemForm.buttons.submit)
};

const prepareForPressKey = (str) => {
  let newStr = '';
  for (var i = 0; i < str.length; i++) {
    newStr = newStr + ' ' + str[i];
  }
  return newStr;
}

export async function createGroup(group) {
  await t.click(topMenu.buttons.addDropdown)
  await t.click(topMenu.addDropdown.createGroup)
  await checkErrors()
  await t
    .typeText(groupsPage.inputs.name, group.name)
    .typeText(groupsPage.inputs.summary, group.summary)
    .click(Selector('label[for="description"]'))
    .pressKey(prepareForPressKey(group.description))
    .click(groupsPage.inputs.contentTypePost)
    .click(groupsPage.buttons.create)
};

export async function waitForSelector(selector, messageOnFail) {
  for (var i = 0; i < 40; i++) {
    if (!await selector.exists) {
      await t.eval(() => location.reload(true));
      await t.wait(1000)
    }
  }
  await t
  .expect(selector.exists).ok(messageOnFail)
};

export async function checkErrors() {
  const $ = {
    noTranslationMissing: Selector('body').withText('translation missing'),
    noLiquidError: Selector('body').withText('Liquid Error'),
    noFormError: Selector('body').withText('RenderFormTag Error:'),
    noQueryError: Selector('body').withText('QueryGraphTag Error:'),
    noExecuteQueryError: Selector('body').withText('ExecuteQueryTagError:'),
    imageNotFound: Selector('body').find('img[alt="Page missing"]')
  }

  await t.expect($.noTranslationMissing.exists).notOk();
  await t.expect($.noLiquidError.exists).notOk();
  await t.expect($.noFormError.exists).notOk();
  await t.expect($.noQueryError.exists).notOk();
  await t.expect($.noExecuteQueryError.exists).notOk();
  await t.expect($.imageNotFound.exists).notOk();
};
