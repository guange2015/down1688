

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
        } else if (request.greeting == "get_first_img"){
            var url = getFirstImg(); 
            sendResponse({farewell: url});
        } else if (request.greeting == 'showmsg'){
            alert(request.msg);
        }
    });

    
    var getFirstImg = function(){
        const o = getAllImgAddress();
        return o["covers"][0];
    }


    var getAllImgAddress = function(){

        console.log('window.onload');
        console.log(window.jQuery);

        var images = [];
        var images1 = [];
        var images2 = [];
        let productID ='';

        //判断一下哪个站
        if(window.location.href.startsWith('https://www.aliexpress.com') || window.location.href.startsWith('https://aliexpress.com')){

            console.log('预览图地址：');
            var nodes = $('.images-view-wrap ul li img');
            nodes.each(function(){ 
                let s = $(this).attr('src');

                //Erotic-Adult-Sex.jpg_50x50.jpg_.webp
                console.log(s);
                if(s.endsWith('_50x50.jpg_.webp')){
                    s = s.substr(0, s.length-'_50x50.jpg_.webp'.length);
                }

                images.push(s);
            });

            console.log('规格图地址：');
            var specNodes = $('.product-sku .sku-property-list li img');
            specNodes.each(function(){ 
                let s = $(this).attr('src');

                //Erotic-Adult-Sex.jpg_50x50.jpg_.webp
                console.log(s);
                if(s.endsWith('_50x50.jpg_.webp')){
                    s = s.substr(0, s.length-'_50x50.jpg_.webp'.length);
                }

                images2.push(s);
            });


            console.log('正文图地址：');
            var imgs = $('.product-overview img');
            imgs.each(function(){
                var s = $(this).attr('src');
                console.log(s);
                if(s.startsWith('//')){
                    s = "https:"+s;
                }

                images1.push(s);
            });


            productID = window.location.href.match(/\/(\d+).html/)[1];

        } else { //1688

            console.log('预览图地址：');
            var nodes = $('.tab-content-container ul li');
            nodes.each(function(){ 
                var s = $(this).attr('data-imgs');

                //视频的话，没地址
                if(s && s.length>0 && s[0]=='{'){
                    var data = JSON.parse(s);
                    console.log(data.original);
                    images.push(data.original);
                }
            });

            //规格图
            console.log('规格图地址：');
            var specNodes = $('.widget-custom-container .obj-leading .list-leading li>div');
            specNodes.each(function(){
                var s = $(this).attr('data-imgs');
                //视频的话，没地址
                if(s && s.length>0 && s[0]=='{'){
                    var data = JSON.parse(s);
                    console.log(data.original);
                    images2.push(data.original);
                }
            });
        

            
            console.log('正文图地址：');
            var imgs = $('#desc-lazyload-container img');
            imgs.each(function(){
                var s = $(this).attr('src');
                console.log(s);

                if(s.startsWith('//')){
                    s = "https:"+s;
                }

                images1.push(s);
            });

            productID = window.location.href.match(/\/(\d+).html/)[1];

        }
        

        return {'covers': images, 'specs': images2, 'shows': images1, 'productId': productID };
    }

    
	
});