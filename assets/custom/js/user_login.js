function CheckMobile(str) {
    return /^\d+$/.test(str);
}

function ValidateLogin() {
    var ret = true;
    var login = $("#tbMobile").val();
    var paswd = $("#tbPasswd").val();

    if(login.length() < 10 || !CheckMobile(login)) {
        $("#tbMobile").addClass('is-invalid');
        ret = false;
    }

    if(paswd === '') {
        $("#tbPasswd").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

$(document).ready(function () {
    var resp_json = $("#resp").html();
    var resp = JSON.parse(resp_json);

    if (resp.code === 0) {
        if (resp.message !== 'get') {
            ShowInfoBox('Success!', resp.message);
        }
    }
    else {
        ShowErrorBox('Error!', resp.message);
    }

    fillupCities();
});