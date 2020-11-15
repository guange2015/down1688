// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {

  let g_responses = {};

  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });


  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });


  
  function downloadFile(data, type){

    let seq = 1;

    if(type=='all' || type=='covers'){
      for(var i in data.covers){
        const url = data.covers[i];
        const ss = url.split('/');
        const filename = ss[ss.length-1];
  
        console.log('url: '+url);
        console.log('ss: '+ss);
        console.log('filename: '+filename);


        const temps = filename.split('.');
        const ext = filename.split('.')[temps.length-1];
        

        chrome.downloads.download({
          url: url,
          filename: `${data.productId}/covers/${seq}.${ext}`,
          saveAs : false,
          conflictAction : "overwrite"
        });

        seq +=  1;
      }
    }
    
    seq = 1;
    if(type=='all' || type=='shows'){
    for(var i in data.shows){

      const url = data.shows[i];
      const ss = url.split('/');
      const filename = ss[ss.length-1];

      console.log('url: '+url);
      console.log('ss: '+ss);
      console.log('filename: '+filename);


      const temps = filename.split('.');
      const ext = filename.split('.')[temps.length-1];

      const lastname = `${seq}.${ext}`;

      if (seq % 10 % 8 == 0){
        seq += 3;
      } else {
        seq +=  1;
      }

      chrome.downloads.download({
        url: url,
        filename: `${data.productId}/shows/${lastname}`,
        saveAs : false,
        conflictAction : "overwrite"
      });
    }
  }

    
  }



  function genericOnClick(info){
    console.log('genericOnClick');
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function(tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {greeting: "hello"},
              function(response) {
                      console.log(response.farewell);
                      downloadFile(response.farewell, 'all');
          });
    });
  }

  function genericOnClick10(info){
    console.log('genericOnClick');
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function(tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {greeting: "get_first_img"},
              function(response) {
                      console.log(response.farewell);
                      //先通过以前的记录查
                      for (const key in g_responses) {
                        if(key.startsWith(response.farewell)){
                          const element = g_responses[key];
                          const msg = `分析成功: ${element}`;
                          console.log(msg);
                          chrome.tabs.sendMessage(
                            tabs[0].id,
                            {greeting: "showmsg", msg: msg});
                            return;
                        }                          
                      }

                      chrome.tabs.sendMessage(
                        tabs[0].id,
                        {greeting: "showmsg", msg: '分析失败'});
          });
    });
  }


  function genericOnClick2(info){
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function(tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {greeting: "hello"},
              function(response) {
                      console.log(response.farewell);
                      downloadFile(response.farewell, 'covers');
          });
    });
  }

  function genericOnClick3(info){
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function(tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {greeting: "hello"},
              function(response) {
                      console.log(response.farewell);
                      downloadFile(response.farewell, 'shows');
          });
    });
  }

  var parent = chrome.contextMenus.create({
    "title": "速易下",
    documentUrlPatterns: ['*://detail.1688.com/*', "*://www.aliexpress.com/*", "*://aliexpress.com/*"]
    });  

  chrome.contextMenus.create({
    id: 'sampleContextMenu1',
    "parentId": parent, 
    title: '下载所有图片', // %s表示选中的文字
    contexts: ['all'], // 只有当选中文字时才会出现此右键菜单
    onclick: genericOnClick
    
  }, function () {
    console.log('contextMenus are create.');
  });

  chrome.contextMenus.create({
    id: 'sampleContextMenu2',
    "parentId": parent, 
    title: '分析产品上架时间', // %s表示选中的文字
    contexts: ['all'], // 只有当选中文字时才会出现此右键菜单
    onclick: genericOnClick10
    
  }, function () {
    console.log('contextMenus are create.');
  });

//   chrome.contextMenus.create({
//     id: 'sampleContextMenu2',
//     "parentId": parent, 
//     title: '下载所有描述图片', // %s表示选中的文字
//     contexts: ['all'], // 只有当选中文字时才会出现此右键菜单
//     onclick: genericOnClick2
    
//   }, function () {
//     console.log('contextMenus are create.');
// });

// chrome.contextMenus.create({
//   id: 'sampleContextMenu3',
//   "parentId": parent, 
//   title: '下载所有内容图片', // %s表示选中的文字
//   contexts: ['all'], // 只有当选中文字时才会出现此右键菜单
//   onclick: genericOnClick3
  
// }, function () {
//   console.log('contextMenus are create.');
// });


var formatTime = function(str){
  //Thu, 10 Sep 2020 16:23:01 GMT
  var n = str.match(/.+,\s+(\d+)\s+(.+?)\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+GMT/);
  const months = {"Jan":'01',"Feb":'02',"Mar":'03',"Apr":'04',"May":'05',"Jun":'06',"Jul":'07',"Aug":'08',"Sep":'09',"Oct":'10',"Nov":'11',"Dec":'12'};
  if(n){
    //2020-12-10 16:23:01 转成这种形式
    console.log(n[2]);
    return `${n[3]}-${months[n[2]]}-${n[1]} ${n[4]}:${n[5]}:${n[6]}`;
  }
  return null;
}

chrome.webRequest.onHeadersReceived.addListener(function(details){
  if(details.type != 'image')return;
  console.log(`onHeadersReceived: ${details.url}`);
  // console.log(details);
  

  for (const key in details.responseHeaders) {
    const element = details.responseHeaders[key];
    if(element.name == 'last-modified'){
      g_responses[details.url] = formatTime(element.value);
      // console.log(element.value);
    }
  }


},
{ urls: ["*://*.alicdn.com/*"] },
        ["responseHeaders","blocking"]
);



  
});