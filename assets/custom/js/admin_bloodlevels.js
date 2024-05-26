function FillBloodLevels() {
    var bl_json = $("#blevels").html();
    console.log(bl_json);
    var bdata = JSON.parse(bl_json);
    console.log(bdata);

    if(Array.isArray(bdata) && bdata.length > 0) {
        var html = "";
        for(var i = 0; i < bdata.length; i++) {
            var row = bdata[i];
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td><td>" + row.bq_bloodtype + "</td><td>" + row.quantity + "</td>";
            html += "</tr>";
        }

        $("#tblBloodLevels tbody").html(html);
    }
}

$(document).ready(function() {
    FillBloodLevels();
});