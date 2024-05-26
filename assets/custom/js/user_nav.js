function initNavbar() {
    $.ajax({
        method: "POST",
        url: "/api/user",
    }).done(function (resp) {
        if(resp.code === 0) {
            var row = resp.data;
            $("#miUser").html(row.user_fullname);
        }
    });
}