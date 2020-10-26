

document.addEventListener('DOMContentLoaded', function()
{
    console.log(window.location.href);


    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting == "hello")//判断是否为要处理的消息
        {
                //sendResponse({farewell: "goodbye"});
                var datas = getAllImgAddress(); 
                sendResponse({farewell: datas});
        }
    });



    var getAllImgAddress = function(){

        console.log('window.onload');
        console.log(window.jQuery);


        var images = [];
        console.log('预览图地址：');
        var nodes = $('.tab-content-container ul li');
        nodes.each(function(){ 
            var s = $(this).attr('data-imgs');
            var data = JSON.parse(s);
            console.log(data.original);

            images.push(data.original);
        });

    

        var images1 = [];
        console.log('正文图地址：');
        var imgs = $('#desc-lazyload-container img');
        imgs.each(function(){
            var s = $(this).attr('src');
            console.log(s);

            images1.push(s);
        });

        const productID = window.location.href.match(/\/(\d+).html/)[1];

        return {'covers': images, 'shows': images1, 'productId': productID };
        
    }

    
	
});