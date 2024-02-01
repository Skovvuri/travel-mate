$(document).ready(function () {

    // Initialize Date Range Picker
    // https://github.com/dangrossman/daterangepicker
    $('#dateRange').daterangepicker({
        opens: 'left',
        drops: 'down',
        autoApply: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD-MM-YYYY', // Set the date format
            separator: ' - ', // Set the separator between dates
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], // Set the abbreviated days of the week
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // Set the month names
        }
    });

    // Handle the 'apply' event when a date range is selected
    $('#dateRange').on('apply.daterangepicker', function (ev, picker) {
        // Update the input value with the selected date range
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });
});