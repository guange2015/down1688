// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {

  console.log("1111111111111111111");

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
        seq +=  1;
  
  
        chrome.downloads.download({
          url: url,
          filename: `${data.productId}/covers/${seq}.${ext}`,
          saveAs : false,
          conflictAction : "overwrite"
        });
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
    "title": "1688下载器",
    documentUrlPatterns: ['https://detail.1688.com/*']
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
    title: '下载所有描述图片', // %s表示选中的文字
    contexts: ['all'], // 只有当选中文字时才会出现此右键菜单
    onclick: genericOnClick2
    
  }, function () {
    console.log('contextMenus are create.');
});

chrome.contextMenus.create({
  id: 'sampleContextMenu3',
  "parentId": parent, 
  title: '下载所有内容图片', // %s表示选中的文字
  contexts: ['all'], // 只有当选中文字时才会出现此右键菜单
  onclick: genericOnClick3
  
}, function () {
  console.log('contextMenus are create.');
});
  
});