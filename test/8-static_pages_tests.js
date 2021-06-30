import { Selector, ClientFunction, t } from 'testcafe';
import { myUrl, staticPages } from './pages/fixtures';
import { checkErrors } from './pages/helper';
import faker from 'faker';

fixture`Static Pages`;

test.page(myUrl + '/about-us')('About Us', async (t) => {
  await checkErrors();
});

test.page(myUrl + '/terms-of-service')('Terms of Service', async (t) => {
  await checkErrors();
});

test.page(myUrl + '/privacy-policy')('Privacy Policy', async (t) => {
  await checkErrors();
});

test.page(myUrl + '/faq')('FAQ', async (t) => {
  await t.click(staticPages.faq.aboutQuestions);

  await t.expect(staticPages.faq.aboutQuestionsAnswer.exists).ok();

  await checkErrors();
});

test.page(myUrl + '/' + faker.lorem.word())('render 404 for not existing page', async (t) => {
  await t.expect(staticPages.notFound.imagePresent.exists).ok();
  await t.expect(staticPages.notFound.headerPresent.exists).ok();

  // Cant use checkErrors because it checks for 404 :)
  const $ = {
    noTranslationMissing: Selector('body').withText('translation missing'),
    noLiquidError: Selector('body').withText('Liquid Error'),
    noFormError: Selector('body').withText('RenderFormTag Error:'),
    noQueryError: Selector('body').withText('QueryGraphTag Error:'),
    noExecuteQueryError: Selector('body').withText('ExecuteQueryTagError:'),
  }

  await t.expect($.noTranslationMissing.exists).notOk();
  await t.expect($.noLiquidError.exists).notOk();
  await t.expect($.noFormError.exists).notOk();
  await t.expect($.noQueryError.exists).notOk();
  await t.expect($.noExecuteQueryError.exists).notOk();
});
