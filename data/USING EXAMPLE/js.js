App.reqres.request("notify:showNotify", {
    text: "Invalid data. Password length minimum 3 charts",
    withCloseBtn: true,
    showTime: 2000,
    type: "error"
});

App.reqres.request("notify:showNotify", {
    text: "Success. Redirect to project page ... ",
    withCloseBtn: false
});