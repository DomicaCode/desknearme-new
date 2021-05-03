!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",Object.defineProperty(n,"p",{get:function(){try{if("string"!=typeof window.cdnUrl)throw new Error("WebpackRequireFrom: 'window.cdnUrl' is not a string or not available at runtime. See https://github.com/agoldis/webpack-require-from#troubleshooting");return window.cdnUrl}catch(t){return console.error(t),""}}}),n(n.s=2)}([function(t,e,n){"use strict";var o=n(1);e.a=Object(o.createConsumer)("/websocket")},function(t,e,n){!function(t){"use strict";var e={logger:self.console,WebSocket:self.WebSocket},n={log:function(){if(this.enabled){for(var t,n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];o.push(Date.now()),(t=e.logger).log.apply(t,["[ActionCable]"].concat(o))}}},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},s=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),r=function(){return(new Date).getTime()},c=function(t){return(r()-t)/1e3},a=function(t,e,n){return Math.max(e,Math.min(n,t))},u=function(){function t(e){i(this,t),this.visibilityDidChange=this.visibilityDidChange.bind(this),this.connection=e,this.reconnectAttempts=0}return t.prototype.start=function(){this.isRunning()||(this.startedAt=r(),delete this.stoppedAt,this.startPolling(),addEventListener("visibilitychange",this.visibilityDidChange),n.log("ConnectionMonitor started. pollInterval = "+this.getPollInterval()+" ms"))},t.prototype.stop=function(){this.isRunning()&&(this.stoppedAt=r(),this.stopPolling(),removeEventListener("visibilitychange",this.visibilityDidChange),n.log("ConnectionMonitor stopped"))},t.prototype.isRunning=function(){return this.startedAt&&!this.stoppedAt},t.prototype.recordPing=function(){this.pingedAt=r()},t.prototype.recordConnect=function(){this.reconnectAttempts=0,this.recordPing(),delete this.disconnectedAt,n.log("ConnectionMonitor recorded connect")},t.prototype.recordDisconnect=function(){this.disconnectedAt=r(),n.log("ConnectionMonitor recorded disconnect")},t.prototype.startPolling=function(){this.stopPolling(),this.poll()},t.prototype.stopPolling=function(){clearTimeout(this.pollTimeout)},t.prototype.poll=function(){var t=this;this.pollTimeout=setTimeout((function(){t.reconnectIfStale(),t.poll()}),this.getPollInterval())},t.prototype.getPollInterval=function(){var t=this.constructor.pollInterval,e=t.min,n=t.max,o=t.multiplier*Math.log(this.reconnectAttempts+1);return Math.round(1e3*a(o,e,n))},t.prototype.reconnectIfStale=function(){this.connectionIsStale()&&(n.log("ConnectionMonitor detected stale connection. reconnectAttempts = "+this.reconnectAttempts+", pollInterval = "+this.getPollInterval()+" ms, time disconnected = "+c(this.disconnectedAt)+" s, stale threshold = "+this.constructor.staleThreshold+" s"),this.reconnectAttempts++,this.disconnectedRecently()?n.log("ConnectionMonitor skipping reopening recent disconnect"):(n.log("ConnectionMonitor reopening"),this.connection.reopen()))},t.prototype.connectionIsStale=function(){return c(this.pingedAt?this.pingedAt:this.startedAt)>this.constructor.staleThreshold},t.prototype.disconnectedRecently=function(){return this.disconnectedAt&&c(this.disconnectedAt)<this.constructor.staleThreshold},t.prototype.visibilityDidChange=function(){var t=this;"visible"===document.visibilityState&&setTimeout((function(){!t.connectionIsStale()&&t.connection.isOpen()||(n.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = "+document.visibilityState),t.connection.reopen())}),200)},t}();u.pollInterval={min:3,max:30,multiplier:5},u.staleThreshold=6;var l={message_types:{welcome:"welcome",disconnect:"disconnect",ping:"ping",confirmation:"confirm_subscription",rejection:"reject_subscription"},disconnect_reasons:{unauthorized:"unauthorized",invalid_request:"invalid_request",server_restart:"server_restart"},default_mount_path:"/cable",protocols:["actioncable-v1-json","actioncable-unsupported"]},d=l.message_types,p=l.protocols,g=p.slice(0,p.length-1),h=[].indexOf,f=function(){function t(e){i(this,t),this.open=this.open.bind(this),this.consumer=e,this.subscriptions=this.consumer.subscriptions,this.monitor=new u(this),this.disconnected=!0}return t.prototype.send=function(t){return!!this.isOpen()&&(this.webSocket.send(JSON.stringify(t)),!0)},t.prototype.open=function(){return this.isActive()?(n.log("Attempted to open WebSocket, but existing socket is "+this.getState()),!1):(n.log("Opening WebSocket, current state is "+this.getState()+", subprotocols: "+p),this.webSocket&&this.uninstallEventHandlers(),this.webSocket=new e.WebSocket(this.consumer.url,p),this.installEventHandlers(),this.monitor.start(),!0)},t.prototype.close=function(){if((arguments.length>0&&void 0!==arguments[0]?arguments[0]:{allowReconnect:!0}).allowReconnect||this.monitor.stop(),this.isActive())return this.webSocket.close()},t.prototype.reopen=function(){if(n.log("Reopening WebSocket, current state is "+this.getState()),!this.isActive())return this.open();try{return this.close()}catch(t){n.log("Failed to reopen WebSocket",t)}finally{n.log("Reopening WebSocket in "+this.constructor.reopenDelay+"ms"),setTimeout(this.open,this.constructor.reopenDelay)}},t.prototype.getProtocol=function(){if(this.webSocket)return this.webSocket.protocol},t.prototype.isOpen=function(){return this.isState("open")},t.prototype.isActive=function(){return this.isState("open","connecting")},t.prototype.isProtocolSupported=function(){return h.call(g,this.getProtocol())>=0},t.prototype.isState=function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];return h.call(e,this.getState())>=0},t.prototype.getState=function(){if(this.webSocket)for(var t in e.WebSocket)if(e.WebSocket[t]===this.webSocket.readyState)return t.toLowerCase();return null},t.prototype.installEventHandlers=function(){for(var t in this.events){var e=this.events[t].bind(this);this.webSocket["on"+t]=e}},t.prototype.uninstallEventHandlers=function(){for(var t in this.events)this.webSocket["on"+t]=function(){}},t}();f.reopenDelay=500,f.prototype.events={message:function(t){if(this.isProtocolSupported()){var e=JSON.parse(t.data),o=e.identifier,i=e.message,s=e.reason,r=e.reconnect;switch(e.type){case d.welcome:return this.monitor.recordConnect(),this.subscriptions.reload();case d.disconnect:return n.log("Disconnecting. Reason: "+s),this.close({allowReconnect:r});case d.ping:return this.monitor.recordPing();case d.confirmation:return this.subscriptions.notify(o,"connected");case d.rejection:return this.subscriptions.reject(o);default:return this.subscriptions.notify(o,"received",i)}}},open:function(){if(n.log("WebSocket onopen event, using '"+this.getProtocol()+"' subprotocol"),this.disconnected=!1,!this.isProtocolSupported())return n.log("Protocol is unsupported. Stopping monitor and disconnecting."),this.close({allowReconnect:!1})},close:function(t){if(n.log("WebSocket onclose event"),!this.disconnected)return this.disconnected=!0,this.monitor.recordDisconnect(),this.subscriptions.notifyAll("disconnected",{willAttemptReconnect:this.monitor.isRunning()})},error:function(){n.log("WebSocket onerror event")}};var m=function(t,e){if(null!=e)for(var n in e){var o=e[n];t[n]=o}return t},b=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments[2];i(this,t),this.consumer=e,this.identifier=JSON.stringify(n),m(this,o)}return t.prototype.perform=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.action=t,this.send(e)},t.prototype.send=function(t){return this.consumer.send({command:"message",identifier:this.identifier,data:JSON.stringify(t)})},t.prototype.unsubscribe=function(){return this.consumer.subscriptions.remove(this)},t}(),y=function(){function t(e){i(this,t),this.consumer=e,this.subscriptions=[]}return t.prototype.create=function(t,e){var n=t,i="object"===(void 0===n?"undefined":o(n))?n:{channel:n},s=new b(this.consumer,i,e);return this.add(s)},t.prototype.add=function(t){return this.subscriptions.push(t),this.consumer.ensureActiveConnection(),this.notify(t,"initialized"),this.sendCommand(t,"subscribe"),t},t.prototype.remove=function(t){return this.forget(t),this.findAll(t.identifier).length||this.sendCommand(t,"unsubscribe"),t},t.prototype.reject=function(t){var e=this;return this.findAll(t).map((function(t){return e.forget(t),e.notify(t,"rejected"),t}))},t.prototype.forget=function(t){return this.subscriptions=this.subscriptions.filter((function(e){return e!==t})),t},t.prototype.findAll=function(t){return this.subscriptions.filter((function(e){return e.identifier===t}))},t.prototype.reload=function(){var t=this;return this.subscriptions.map((function(e){return t.sendCommand(e,"subscribe")}))},t.prototype.notifyAll=function(t){for(var e=this,n=arguments.length,o=Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];return this.subscriptions.map((function(n){return e.notify.apply(e,[n,t].concat(o))}))},t.prototype.notify=function(t,e){for(var n=arguments.length,o=Array(n>2?n-2:0),i=2;i<n;i++)o[i-2]=arguments[i];return("string"==typeof t?this.findAll(t):[t]).map((function(t){return"function"==typeof t[e]?t[e].apply(t,o):void 0}))},t.prototype.sendCommand=function(t,e){var n=t.identifier;return this.consumer.send({command:e,identifier:n})},t}(),v=function(){function t(e){i(this,t),this._url=e,this.subscriptions=new y(this),this.connection=new f(this)}return t.prototype.send=function(t){return this.connection.send(t)},t.prototype.connect=function(){return this.connection.open()},t.prototype.disconnect=function(){return this.connection.close({allowReconnect:!1})},t.prototype.ensureActiveConnection=function(){if(!this.connection.isActive())return this.connection.open()},s(t,[{key:"url",get:function(){return S(this._url)}}]),t}();function S(t){if("function"==typeof t&&(t=t()),t&&!/^wss?:/i.test(t)){var e=document.createElement("a");return e.href=t,e.href=e.href,e.protocol=e.protocol.replace("http","ws"),e.href}return t}function w(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:A("url")||l.default_mount_path;return new v(t)}function A(t){var e=document.head.querySelector("meta[name='action-cable-"+t+"']");if(e)return e.getAttribute("content")}t.Connection=f,t.ConnectionMonitor=u,t.Consumer=v,t.INTERNAL=l,t.Subscription=b,t.Subscriptions=y,t.adapters=e,t.createWebSocketURL=S,t.logger=n,t.createConsumer=w,t.getConfig=A,Object.defineProperty(t,"__esModule",{value:!0})}(e)},function(t,e,n){"use strict";n.r(e);var o=n(0);const i=function(){const t=this;t.settings={},t.settings.debug=!1,t.settings.inbox=document.querySelector("#chat-inbox"),t.settings.messageInput=document.querySelector("#chat-messageInput"),t.settings.messagesListContainer=document.querySelector("#chat-messagesList-container"),t.settings.messagesList=document.querySelector("#chat-messagesList"),t.settings.messageTemplate=t=>{let e=new Date(t.created_at);return`\n    <li class="flex mb-2 break-words ${"sent"===t.status?"justify-end":"justify-start"}">\n      <div class="max-w-full rounded py-2 px-3 ${"sent"===t.status?"bg-indigo-200":"bg-gray-300"}">\n        <p class="text-sm mt-1">${t.message}</p>\n        <p class="text-right text-xs text-gray-500 mt-1">${e.getHours()}:${e.getMinutes()}</p>\n      </div>\n    </li>\n    `},t.settings.currentUserId=t.settings.messageInput.getAttribute("data-current-profile-id"),t.settings.loadingIndicator=document.querySelector("#chat-loadingIndicator"),t.settings.currentPage=1,t.settings.morePages="true"===t.settings.loadingIndicator.dataset.more,t.settings.lostConnection=t.settings.inbox.getAttribute("data-error-connection"),t.channel=null,t.conversationId=t.settings.messageInput.getAttribute("data-conversation-id"),t.errorNotification=null;const e=()=>{t.settings.messagesListContainer.scrollTo(0,t.settings.messagesList.scrollHeight)};t.createSubscription=()=>{t.channel=o.a.subscriptions.create({channel:"conversate",room_id:t.conversationId,sender_name:t.settings.messageInput.getAttribute("data-from-name"),autor_id:t.settings.messageInput.getAttribute("data-current-profile-id")},{received:function(e){t.showMessage(Object.assign(e,{status:t.settings.currentUserId==e.autor_id?"sent":"received"})),t.settings.debug&&(console.log("[Inbox] Message received"),console.log(e))},connected:function(){t.settings.messageInput.disabled=!1,t.settings.messageInput.focus(),t.errorNotification&&t.errorNotification.hide(),t.settings.debug&&console.log("[Inbox] Connected to channel and joined room "+t.conversationId)},rejected:function(){t.blocked(),t.settings.debug&&console.log("[Inbox] The connection was rejected by the server")},disconnected:function(){t.blocked(),t.settings.debug&&console.log("[Inbox] You've been disconnected from the server")}})},t.sendMessage=e=>{let n={message:(o=e,i=document.createElement("div"),i.innerText=i.textContent=o,o=i.innerHTML),autor_id:t.settings.currentUserId,sender_name:t.settings.messageInput.getAttribute("data-from-name"),created_at:new Date};var o,i;t.channel.send(Object.assign(n,{create:!0})),t.settings.debug&&(console.log("[Inbox] Message sent"),console.log(n))},t.showMessage=e=>{t.settings.messagesList.insertAdjacentHTML("beforeend",t.settings.messageTemplate(e)),t.settings.debug&&console.log("[Inbox] Message shown in chat")},t.loadPage=(e=1,n=30)=>{let o=t.settings.messagesList.querySelector("li:first-child");t.settings.loadingIndicator.style.display="block",fetch(`/api/chat/messages.json?conversation_id=${t.conversationId}&page=${e}&per_page=${n}`).then(t=>t.ok?t.json():Promise.reject(t)).then(e=>{let n="";Object.entries(e.results).reverse().forEach(([e,o])=>{o=Object.assign(o,{status:t.settings.currentUserId==o.autor_id?"sent":"received"}),n+=t.settings.messageTemplate(o)}),t.settings.messagesList.insertAdjacentHTML("afterbegin",n),e.has_next_page||(t.settings.morePages=!1)}).catch(t=>{console.log(t),t.json().then(t=>console.log(t))}).finally(()=>{t.settings.loadingIndicator.style.display="none",t.settings.messagesListContainer.scrollTop=o.offsetTop-300})},t.blocked=()=>{t.settings.messageInput.disabled=!0,t.errorNotification=new api.flash("error","We cannot connect to the server. Check your internet connection or try reloading the page.")},t.init=()=>{t.settings.inbox.style.height=`calc(100vh - ${t.settings.inbox.offsetTop}px - 20px)`,t.createSubscription(),e(),t.settings.messageInput.addEventListener("keypress",e=>{"Enter"===e.key&&t.settings.messageInput.value.trim()&&(t.sendMessage(t.settings.messageInput.value.trim()),t.settings.messageInput.value="")}),document.addEventListener("message",t=>{throw new Error("test"+JSON.stringify(t)+JSON.stringify(t.details))});let n="";t.settings.messagesListContainer.addEventListener("scroll",()=>{!0===t.settings.morePages&&(clearTimeout(n),n=setTimeout(()=>{0===t.settings.messagesListContainer.scrollTop&&(t.settings.currentPage=t.settings.currentPage+1,t.loadPage(t.settings.currentPage))},300))})},t.init()};document.addEventListener("DOMContentLoaded",()=>{document.querySelector("#chat-messagesList-container")&&(document.chat=new i)});const s=function(t){const e=this;e.settings={},e.sendMessageButton=t.sendMessageButton?t.sendMessageButton:document.querySelector(".chat-sendMessage"),e.preventDoubleClick=()=>{e.sendMessageButton.addEventListener("click",t=>{e.sendMessageButton.setAttribute("disabled","disabled")})},e.init=()=>{e.preventDoubleClick()},e.init()};document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".chat-sendMessage").forEach(t=>{new s({sendMessageButton:t})})})}]);