function fillDonateCount() {
    $.ajax({
        method: "POST",
        url: "/api/doncount",
    }).done(function (resp) {
        if(resp.code === 0) {
            var row = resp.data;
            $("#tbNumBloodDonations").val(row);
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

function ValidateDonate() {
    var ret = true;
    var dondate = $("#tbDonateDate").val();
    var numunits = parseInt($("#tbNumUnits").val());

    if(numunits === 0) {
        $("#tbNumUnits").addClass('is-invalid');
        ret = false;
    }

    if(dondate === '') {
        $("#tbDonateDate").addClass('is-invalid');
        ret = false;
    }
    if($("#cbIAgree").is(':checked') === false) {
        ShowErrorBox('Error!', 'You must declare these informations are true before submitting.');
        ret = false;
    }

    return ret;
}

$(document).ready(function() {
    initNavbar();
    fillDonateCount();
    var juser = $("#user").html();
    if(juser.length > 0) {
        var user = JSON.parse(juser);
        if(user.user_gender === 'Male') $(".femcb").hide();
    }

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
});