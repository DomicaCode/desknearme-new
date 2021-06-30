window.navigationStats = function () {

  return {
    cartQuantity: false,
    inboxUnread: false,

    store(key, list){
      console.log(key, list)
      window[key] = (list || []).map(e => e.r_id)
    },

    init($dispatch) {
      fetch('/api/users/stats.json')
        .then((res) => res.json())
        .then((res) => {
          this.cartQuantity = res.cart_quantity;
          this.inboxUnread = res.inbox_unread;

          this.store('wishlistIds', res['relationships']['wishlist']);
          this.store('tagIds', res['relationships']['followship:tag']);
          this.store('postIds', res['relationships']['followship:post']);
          this.store('profileIds', res['relationships']['followship:profile']);
          this.store('groupIds', []);

          $dispatch('data-ready');
        })
        .catch(e => {
          this.cartQuantity = false;
          this.inboxUnread = 0;
        });
    },
  };
};
