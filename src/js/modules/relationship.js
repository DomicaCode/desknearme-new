import apiFetch from '../apiFetch';

window.relationship = function (type) {
  return {
    type: type,
    exists: false,
    initialized: '',
    init() {
      this.id = this.$el.dataset.id;
      this.exists = window[this.type].includes(this.id);
      this.initialized = true;
    },
    toggle($dispatch) {
      const createPath = '/api/relationships/create.json';
      const deletePath = '/api/relationships/delete.json';

      const url = this.exists ? deletePath : createPath;
      const method = this.exists ? 'delete' : 'post';

      const fd = new FormData(this.$el);
      const body = JSON.stringify(Object.fromEntries(fd));

      apiFetch(url, {body, method,})
        .then(() => {
          if (this.exists) {
            delete window[this.type][window[this.type].indexOf(this.id)]
          } else {
            window[this.type].push(this.id)
          }
          $dispatch('data-ready')
        })
        .finally(() => {
          this.initialized = true;
        });
    },
  };
};
