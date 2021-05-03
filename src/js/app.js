import '../css/app.css';

import './quick-search';
import './dropdown';
import './flash';
import './list-filtered';

import './modules/navigation-stats';
import './modules/relationship';
import './modules/wishlist';
import './modules/unread-count';
import './modules/search-component';

import(/* webpackChunkName: "alpinejs" */ 'alpinejs');

const cart = document.querySelector('[data-cart]');
if(cart){
  import(/* webpackChunkName: "cart" */ './cart');
}

const syntaxHighlighting = document.querySelector('.hljs');
if (syntaxHighlighting) {
  import(/* webpackChunkName: "syntax-highlighting" */ './syntax-highlighting');
}

const slider = document.querySelector('[data-slider]');
if(slider){
  import(/* webpackChunkName: "slider" */ './slider');
}

const uppyPhotos = document.querySelector('[data-s3-uppy-photo]');
if (uppyPhotos) {
  import(/* webpackChunkName: "photo-upload" */ './photo-upload');
}

const commentNewPost = document.querySelector('[data-comment-new-post]');
if (commentNewPost) {
  import(/* webpackChunkName: "comment-new-post" */ './comment-new-post');
}

const markdownEditor = document.querySelector('[data-markdown-editor]');
if (markdownEditor) {
  import(/* webpackChunkName: "markdown-editor" */ './markdown-editor');
}

const markdownImages = document.querySelector('.markdown img');
if (markdownImages) {
  import(/* webpackChunkName: "markdown-images" */ './markdown-images');
}

const styleGuide = document.querySelector('#styleGuide');
if (styleGuide) {
  import(/* webpackChunkName: "style-guide" */ './style-guide');
}

const tagsInput = document.querySelector('[data-tags-input]');
if (tagsInput) {
  import(/* webpackChunkName: "tags-input" */ './tags-input');
}

const groupJoinButtons = document.querySelectorAll('button[data-join-group]');
if (groupJoinButtons.length > 0) {
  import(/* webpackChunkName: "groups-join" */ './groups-join');
}

const userFollowButtons = document.querySelectorAll('button[data-follow-user]');
if (userFollowButtons.length > 0) {
  import(/* webpackChunkName: "user-follow" */ './user-follow');
}

const itemStatusSelectors = document.querySelectorAll('select[data-item-status-object-id]');
if (itemStatusSelectors.length > 0) {
  import(/* webpackChunkName: "item-status-create" */ './item-status-create');
}
