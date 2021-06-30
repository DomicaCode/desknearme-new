import { Selector } from 'testcafe';

export default class GroupsPage {
  constructor() {
    this.buttons = {
      addGroup: Selector('main').find('a').withText('Add group'),
      submitForm: Selector('button').withText('Submit'),
      create: Selector('button').withText('Create group'),
      update: Selector('button').withText('Update group'),
      editGroup: Selector('td').find('a').withText('Edit')
    }
    this.inputs = {
      name: Selector('input[name="group[name]"]'),
      summary: Selector('textarea[name="group[summary]"]'),
      description: Selector('textarea[name="group[description]"]'),
      contentTypePost: Selector('#group_content_type_post')
    }
  }
}





