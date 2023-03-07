
//数据请求
export function uniAjax (url, type, data, fun, contentType) {
    //url 请求地址
    //type 请求格式 POST GET
    //data 请求数据传参
    //fun 请求成功执行方法
    //contentType 默认application/json 1=>application/x-www-form-urlencoded
    var contentType;
    let session_key = uni.getStorageSync('session_key');
    if (contentType == 1) {
        contentType = 'application/x-www-form-urlencoded'
    } else {
        contentType = 'application/json'
    }
    // if (!session_key || session_key == '') {
    //     uni.navigateTo({ url: '/pages/index/registration' })
    // }

    uni.request({
        url: url,
        method: type,
        data: data,
        header: {
            'token': session_key,
            'Content-Type': contentType //自定义请求头信息
        },
        success: (res) => {
            fun(res);
            // if(res.data.retcode==1){
            //  uni.showToast({
            //   title: res.data.retmsg,
            //   icon : 'none'
            //  });
            // }
        },
        fail: (err) => {
            uni.showToast({
                title: JSON.stringify(err),
                icon: 'none'
            });
        }
    });
}

// 防抖
export function debounce (fn, delay) {
    let timer = null;
    if (delay == undefined) {
        delay = 1000;
    }
    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this)
        }, delay)
    }
}
// 节流
export function throttle (fn, delay) {
    let flag = true;
    if (delay == undefined) {
        delay = 1000;
    }
    return function () {
        let context = this;
        let args = arguments;
        if (flag) {
            flag = false
            setTimeout(function () {
                fn.apply(context, args);
                flag = true
            }, delay);
        }
    }
}
