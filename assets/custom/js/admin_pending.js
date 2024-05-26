var reviewModal = new bootstrap.Modal('#ReviewModal', { backdrop : 'static' });

function formatStatus(status) {
    if(status === "Pending") return "<span class='badge bg-secondary'>Pending</span>";
    else if(status === "Active") return "<span class='badge bg-success'>Active</span>";
    else if(status === "Fulfilled") return "<span class='badge bg-primary'>Fulfilled</span>";
    else return "";
}

function int2BoolString(param) {
    if(param === 1 || param === '1') return "<span class='badge bg-success p-2'>Yes</span>";
    else if(param === 0 || param === '0') return "<span class='badge bg-danger p-2'>No</span>";
}

function onReviewClick(donid) {
    $("#hdnDonID").val(donid);

    $.ajax({
        method: "POST",
        url: "/api/getdongender",
        data: { donid : donid }
    }).done(function (resp) {
        if(resp.code === 0) {
            if(resp.data === 'Male') {
                $("#ReviewModal tr .female").hide();
            }
            else {
                $("#ReviewModal tr .female").show();
            }
        }
    });

    $.ajax({
        method: "POST",
        url: "/api/getds",
        data: { donid : donid }
    }).done(function (resp) {
        if(resp.code === 0) {
            var row = resp.data;
            $("#ds_eat4h").html(int2BoolString(row.donor_stat_eat4h));
            $("#ds_slp6h").html(int2BoolString(row.donor_stat_slp6h));
            $("#ds_tat1w").html(int2BoolString(row.donor_stat_tat1w));
            $("#ds_anb1w").html(int2BoolString(row.donor_stat_anb1w));
            $("#ds_asp1w").html(int2BoolString(row.donor_stat_asp1w));
            $("#ds_tt1w").html(int2BoolString(row.donor_stat_tt1w));
            $("#ds_fev1w").html(int2BoolString(row.donor_stat_fev1w));
            $("#ds_aidsprb").html(int2BoolString(row.donor_stat_aidsprb));
            $("#ds_cntmed").html(int2BoolString(row.donor_stat_cntmed));
            $("#ds_sbsabs").html(int2BoolString(row.donor_stat_sbsabuse));
            $("#ds_jndc1y").html(int2BoolString(row.donor_stat_jndc1y));
            $("#ds_osklm3").html(int2BoolString(row.donor_stat_osklm3));
            $("#ds_uhinj").html(int2BoolString(row.donor_stat_uhinj));
            $("#ds_mnsactive").html(int2BoolString(row.donor_stat_mnsactive));
            $("#ds_bb1y").html(int2BoolString(row.donor_stat_bb1y));
            $("#ds_prgnt").html(int2BoolString(row.donor_stat_prgnt));
            $("#ds_abrt6m").html(int2BoolString(row.donor_stat_abrt6m));
            $("#ds_srg12m").html(int2BoolString(row.donor_stat_srg12m));
            reviewModal.show();
        }
    });
}

function fillPendingTable() {
    var plist_json = $("#plist").html();
    if(plist_json.length > 0) {
        var plist = JSON.parse(plist_json);
        var html = "";
        for(var i = 0; i < plist.length; i++) {
            html += "<tr>";
            html += ("<td>" + plist[i].user_fullname + "</td>");
            html += ("<td>" + plist[i].user_bloodtype + "</td>");
            html += ("<td>" + plist[i].donation_units + "</td>");
            html += ("<td>" + formatStatus(plist[i].donation_status) + "</td>");            
            if(plist[i].donation_status === 'Verified' || plist[i].donation_status === 'Done') {
                html += ("<td><button class='btn btn-warning btn-sm' onclick='onChangeStatus(" + plist[i].donation_id + ");'>Change Status</button></td>");
            }
            else {
                html += ("<td><button class='btn btn-success btn-sm' onclick='onReviewClick(" + plist[i].donation_id + ");'>Review</button></td>");
            }
            html += "</td></tr>";
        }

        $("#tblPendings tbody").html(html);
    }
}

$(document).ready(function() {
    var resp_json = $("#resp").html();
    if(resp_json.length > 0) {
        var resp = JSON.parse(resp_json);
        if (resp.code === 0) {
            if (resp.message !== 'get') {
                ShowInfoBox('Success!', resp.message);
            }
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    }

    fillPendingTable();
});