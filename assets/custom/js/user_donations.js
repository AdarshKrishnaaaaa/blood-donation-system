$(document).ready(function(){
    var jdons = $("#donations").html();
    if(jdons.length > 0) {
        var dons = JSON.parse(jdons);
        var html = "";
        for(var i = 0; i < dons.length; i++) {
            var row = dons[i];
            html += "<tr>";
            html += ("<td>" + row.user_fullname + "</td><td>" + row.user_bloodtype + "</td><td>" + row.donation_units + "</td>");
            html += ("<td><button onclick='onViewMedStatus(" + row.donation_id + ");' class='btn btn-success btn-sm'>View</button></td>");
            html += ("<td>" + row.donation_status + "</td>");
            if(row.donation_status === 'Pending' || row.donation_status === 'Verified')
                html += ("<td><button onclick='onDelete(" + row.donation_id + ");' class='btn btn-danger btn-sm'>Delete</button></td>");
            else html += "<td>&nbsp;</td>";
            html += "</tr>";
        }

        if(i > 0)
            $("#tblDonations tbody").html(html);
        else 
            $("#tblDonations tbody").html("<tr><td colspan='6' class='text-center'><h4>No Data!</h4></td></tr>");
    }
    
    initNavbar();
});