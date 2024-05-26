$(document).ready(function(){
    var jresp = $("#resp").html();
    if(jresp.length > 0) {
        var resp = JSON.parse(jresp);
        $("#errmsg").html(resp.message);
        $("#errdetails").html(resp.data);
    }
});