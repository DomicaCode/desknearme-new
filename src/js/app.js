import '../css/app.css';

import './quick-search';
import './dropdown';
import './flash';
import './list-filtered';

import './modules/navigation-stats';
import './modules/relationship';
import './modules/wishlist';
import './modules/post-likes';
import './modules/unread-count';
import './modules/search-component';
import './modules/load-more';
import './modules/otp-form';
import './modules/frames';
import './modules/char-counter';

import(/* webpackChunkName: "alpinejs" */ 'alpinejs');

const cart = document.querySelector('[data-cart]');
if(cart){
  import(/* webpackChunkName: "cart" */ './cart');
}

const syntaxHighlighting = document.querySelector('pre > code');
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
  import(/* webpackChunkName: "photo-upload-reset-uuid" */ './photo-upload-reset-uuid');
}

const photoUploadBase = document.querySelector('[data-photo-upload-base]');
if (uppyPhotos && photoUploadBase) {
  import(/* webpackChunkName: "photo-upload-base" */ './photo-upload-base');
}

const photoUploadItems = document.querySelector('[data-photo-upload-items]');
if (uppyPhotos && photoUploadItems) {
  import(/* webpackChunkName: "photo-upload-items" */ './photo-upload-items');
}

const photoUploadAvatar = document.querySelector('[data-photo-upload-avatar]');
if (uppyPhotos && photoUploadAvatar) {
  import(/* webpackChunkName: "photo-upload-avatar" */ './photo-upload-avatar');
}

const commentNewPost = document.querySelector('[data-comment-show-new-post]');
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

const tagsAllowlistInput = document.querySelector('[data-tags-allowlist-input]');
if (tagsAllowlistInput) {
  import(/* webpackChunkName: "tags-allowlist-input" */ './tags-allowlist-input');
}

const groupJoinButtons = document.querySelectorAll('button[data-join-group]');
if (groupJoinButtons.length > 0) {
  import(/* webpackChunkName: "groups-join" */ './groups-join');
}

if (document.querySelectorAll('.timeago').length > 0){
  import(/* webpackChunkName: "time-format" */ './time-format');
}
