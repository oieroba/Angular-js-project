function showStatusMessage(message, messageType) {
    $(".status-message").addClass(messageType);
    $(".status-message").find('span').html(message);
    $(".status-message").show();
    //if ($('.status-message').is(':offscreen'))
    $(window).scrollTop($('.status-message').offset().top - 300);
}
function hideStatusMessage() {
    debugger;
    $(".status-message").removeClass("success").removeClass("error").removeClass("warning");
    $(".status-message").find('span').html("");
    $(".status-message").hide();
}

$(document).on("click", ".status-message a", function () {
    hideStatusMessage();
});

var isModalClosed = true;
$(document).on('hidden.bs.modal', '#ModalLoader', function (e) {
    isModalClosed = true;
})

function ShowLoader(Message) {
    try {
        while (isModalClosed) {
            if (Message != null && Message != "") {
                $("#DIVLoadingMessage").html(Message);
                isModalClosed = false;
                $("div#ModalLoader").modal('show');
            }
        }
    } catch (e) {
    }
}

function HideLoader() {
    try {
        $("#DIVLoadingMessage").html("");
        $("div#ModalLoader").modal('hide');
    } catch (e) {
    }
}

$(function () {
    $('.phone_us').mask("(000) 000-0000", "(000)000-0000");
    $('.zip_us').mask("00000");
    $('.date_us').mask("00/00/0000");
    $('.ssn_us').mask("000-00-0000");
    $('.decimal5').mask("00.00", "0.0", "0.00", "00.0");
});
