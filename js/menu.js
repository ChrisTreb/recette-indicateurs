$(document).ready(function() {
    // Menu behaviour
    $("#nav-icon").click(function() {
        $(this).toggleClass("open");
        $("#menu").slideToggle();
    });
});