const signatureEntryComponent = function () {

    function toggleDetails(containerUUID) {
        if ($(`#signature-details-${containerUUID}`).hasClass('d-none')) {
            $(`#signature-details-${containerUUID}`).removeClass('d-none');
            $(`#toggle-signature-details-${containerUUID}`).html('Less');
        } else {
            $(`#signature-details-${containerUUID}`).addClass('d-none');
            $(`#toggle-signature-details-${containerUUID}`).html('More');
        }
    }

    function remove(containerUUID) {
        $(`#container-${containerUUID}`).remove();
    }

    return {
        toggleDetails,
        remove
    }
}();