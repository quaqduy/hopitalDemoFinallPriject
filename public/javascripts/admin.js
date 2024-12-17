$(document).ready(function() {
    $('#dashboardLink').click(function() {
        $('.dashboard').show();
        $('.accounts, .schedule, .emergency').hide();
    });

    $('#accountsLink').click(function() {
        $('.accounts').show();
        $('.dashboard, .schedule, .emergency').hide();
    });

    $('#scheduleLink').click(function() {
        $('.schedule').show();
        $('.dashboard, .accounts, .emergency').hide();
    });

    $('#emergencyLink').click(function() {
        $('.emergency').show();
        $('.dashboard, .accounts, .schedule').hide();
    });
});
