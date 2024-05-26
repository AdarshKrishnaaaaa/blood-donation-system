function getStats() {
    $.ajax({
        method: "POST",
        url: "/api/getusercount"
    }).done(function (resp) {
        if (resp.code === 0) {
            $("#lblUserCount").html(resp.data);
        }
    });

    $.ajax({
        method: "POST",
        url: "/api/getpendingcount"
    }).done(function (resp) {
        if (resp.code === 0) {
            $("#lblPendingCount").html(resp.data);
        }
    });

    $.ajax({
        method: "POST",
        url: "/api/getacceptedcount"
    }).done(function (resp) {
        if (resp.code === 0) {
            $("#lblAcceptedCount").html(resp.data);
        }
    });
}

$(document).ready(function() {
    getStats();
});