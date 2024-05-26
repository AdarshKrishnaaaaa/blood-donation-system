var addModal = new bootstrap.Modal('#AddModal');
function FillRequests() {
    $.ajax({
        method: "POST",
        url: "/api/getalluserreqs"
    }).done(function (resp) {
        if (resp.code === 0) {
            if (Array.isArray(resp.data) === true && resp.data.length > 0) {
                var html = "";
                for (var i = 0; i < resp.data.length; i++) {
                    var row = resp.data[i];
                    html += "<tr>";
                    html += ("<td>" + (i + 1) + "</td><td>" + row.request_desc + "</td><td>" + row.request_bloodtype + "</td><td>" + row.request_units + "</td><td>" + row.request_status + "</td>");
                    html += ("<td style='width: 200px;'><button onclick='onDelete(" + row.request_id + ");' class='btn btn-danger btn-sm w-100 p-0'>Delete</button><br/></td>");
                    html += "</tr>";
                }

                $("#tblRequests tbody").html(html);
            }
            else
                $("#tblRequests tbody").html("<tr><td class='text-center' colspan='6'><h4>No Data!</h4></td></tr>");
        }
        else {
            ShowErrorBox('Error', resp.message);
            $("#tblRequests tbody").html("<tr><td class='text-center' colspan='6'><h4>No Data!</h4></td></tr>");
        }
    });
}

$("#btnTriggerAddModal").click(function() {
    addModal.show();
});

$(document).ready(function () {
    var resp_json = $("#resp").html();
    if (resp_json.length > 0) {
        var resp = JSON.parse(resp_json);
        if (resp.code === 0) {
            if (resp.data === false) {
                ShowErrorBox('Error!', resp.message);
            }
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    }

    FillRequests();
});