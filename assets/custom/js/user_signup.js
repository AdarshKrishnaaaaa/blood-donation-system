function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dob.getFullYear();
    if (
        currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
        return age - 1;
    }

    return age;
}

function fillupCities() {
    $.ajax({
        method: "POST",
        url: "/api/cities",
    }).done(function (resp) {
        if(resp.code === 0) {
            var html = "<option value='-1'>--Select City--</option>";
            for(var i = 0; i < resp.data.length; i++) {
                var row = resp.data[i];
                html += ("<option value='" + row.city_name + "'>" + row.city_name + "</option>");
            }
            $("#ddCity").html(html);
        }
    });
}

$("#tbDob").change(function(){
    var dob = $("#tbDob").val();
    if(dob.length > 0) {
        var age = calculateAge(dob);
        $("#lblAge").html(age.toString());
        if(age < 18)
            $("#tbDob").addClass('is-invalid');
        else $("#tbDob").removeClass('is-invalid');
    }
    else $("#lblAge").html("Select your date of birth to determine your age.");
});

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

function ValidateEmail(email) {
    var regex = new RegExp(
        '[a-z0-9!#$%&/\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&/\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'
    );
    return regex.test(email);
}

function checkPassword(str) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(str);
}

function CheckMobile(str) {
    return /^\d+$/.test(str);
}

function ValidateSignup() {
    var ret = true;

    var fname = $("#tbFullname").val();
    var mob = $("#tbMobile").val();
    var pwd = $("#tbPasswd").val();
    var cpwd = $("#tbPasswd1").val();
    var dob = $("#tbDob").val();
    var weight = parseInt($("#tbWeight").val()) || 0;
    var gend = $("#ddGender").val();
    var blood = $("#ddBlood").val();
    var addr = $("#tbAddress").val();
    var city = $("#ddCity").val();

    if (fname === '') {
        $("#tbFullname").addClass('is-invalid');
        ret = false;
    }

    if (mob === '' || !CheckMobile(mob)) {
        $("#tbMobile").addClass('is-invalid');
        ret = false;
    }

    if (pwd === '' || !checkPassword(pwd)) {
        $("#tbPasswd").addClass('is-invalid');
        ret = false;
    }

    if (cpwd !== pwd) {
        $("#tbPasswd1").addClass('is-invalid');
        ret = false;
    }

    if(dob.length > 0) {
        var age = calculateAge(dob);
        $("#lblAge").html(age.toString());
        if(age < 18) {
            $("#tbDob").addClass('is-invalid');
            ret = false;
        }
        else $("#tbDob").removeClass('is-invalid');
    }
    else { 
        $("#tbDob").addClass('is-invalid');
        $("#lblAge").html("Select your date of birth to determine your age.");
        ret = false;
    }

    if (weight === 0) {
        $("#tbWeight").addClass('is-invalid');
        ret = false;
    }

    if (gend === '-1') {
        $("#ddGender").addClass('is-invalid');
        ret = false;
    }

    if (blood === '-1') {
        $("#ddBlood").addClass('is-invalid');
        ret = false;
    }

    if (city === '-1') {
        $("#ddCity").addClass('is-invalid');
    }

    return ret;
}