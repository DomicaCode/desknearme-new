import { Selector } from 'testcafe';
import { myUrl } from './fixtures';

export default class SoldOrders {
  constructor() {
    this.url = (myUrl + '/dashboard/sell/orders');
    this.order = Selector('section div ul');
    this.orderStatus = Selector('span[data-tc="order-status"]');
    this.orderId = Selector('a[data-tc="order-id"]');
    this.johnSmithOrderId = Selector('ul').withText('John Smith').find('a[data-tc="order-id"]');
    this.filters = {
      new: Selector('label').withText('New'),
      returned: Selector('label').withText('Returned'),
      delivered: Selector('label').withText('Delivered'),
      cancelledByYou: Selector('label').withText('Cancelled By You'),
      inProgress: Selector('label').withText('In Progress')
    }
    this.buttons = {
      filters: Selector('button').withText('Filters'),
      applyFilters: Selector('button').withText('Apply')
    }
    this.delivery = {
      information: Selector('input[name="order_delivery[delivery_information]"]'),
      saveDeliveryInfo: Selector('button').withText('Mark as delivered'),
      statuses: {
        delivered: Selector('span').withText('READY FOR PICKUP'),
        new: Selector('span').withText('new'),
        inProgress: Selector('span').withText('NEW'),
        returnRequested: Selector('div').withText('Requested')
      },
      markAsCompleted: Selector('button').withText('Mark as completed')
    }
    this.returns = {
      buttons: {
        returnDetails: Selector('a').withText('Return details'),
        accept: Selector('button').withText('Approve'),
        markAsReturned: Selector('button').withText('Mark as returned and refund payment'),
      }
    }
    this.cancellation = {
      cancelCheckbox: Selector('input[data-tc="sold-order-cancel-checkbox"]'),
      confirmCancel: Selector('button').withText('Cancel order and manage stock')
    }
  }
}
