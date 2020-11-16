signatureEntryComponent.createNew = function createNew(op) {
    return `
        <div class="row">
            <div class="col-sm-12">
                <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Hex</span>
                    </div>
                    <textarea id="signature-value-${op.containerUUID}" rows="1"
                        class="form-control small asm read-only-disable-${op.containerUUID} role-create-${op.containerUUID}"></textarea>
                    <div class="input-group-append">
                        <button type="button" id="toggle-signature-details-${op.containerUUID}" onclick="signatureEntryComponent.toggleDetails('${op.containerUUID}')" class="btn btn-info btn-sm">
                            More
                        </button>
                        <button type="button" onclick="signatureEntryComponent.remove('${op.containerUUID}')" 
                            class="btn btn-info btn-sm btn-danger read-only-hide-${op.containerUUID}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="signature-details-${op.containerUUID}"  class="col-sm-12 d-none">
                <table class="table table-sm shadow">
                    <tbody>
                        <tr class="d-flex">
                            <td class="col-sm-2">
                                <label class="small">Master Fingerprint</label>
                            </td>
                            <td class="col-sm-10">
                                <input type="text" id="signature-master-fingerprint-${op.containerUUID}"
                                    class="form-control form-control-sm asm read-only-disable-${op.containerUUID}">
                            </td>
                        </tr>
                        <tr class="d-flex">
                            <td class="col-sm-2">
                                <label class="small">Public Key</label>
                            </td>
                            <td class="col-sm-10">
                                <input type="text" id="signature-public-key-${op.containerUUID}"
                                    class="form-control form-control-sm asm read-only-disable-${op.containerUUID}">
                            </td>
                        </tr>
                        <tr class="d-flex">
                            <td class="col-sm-2">
                                <label class="small">Path</label>
                            </td>
                            <td class="col-sm-10">
                                <input type="text" id="signature-path-${op.containerUUID}"
                                  class="form-control form-control-sm asm read-only-disable-${op.containerUUID}">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

signatureEntryComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!containerUUID || !data) {
        return;
    }

    $(`#signature-value-${containerUUID}`).val(data.signature);


    $(`#signature-master-fingerprint-${containerUUID}`).val(data.fingerprint || '');
    $(`#signature-public-key-${containerUUID}`).val(data.publicKey || '');
    $(`#signature-path-${containerUUID}`).val(data.path || '');

}

signatureEntryComponent.htmlToData = function htmlToData(containerUUID) {
    if (!containerUUID) {
        return;

    }
    const data = {};
    data.signature = $(`#signature-value-${containerUUID}`).val() || '';
    data.fingerprint = $(`#signature-master-fingerprint-${containerUUID}`).val() || '';
    data.publicKey = $(`#signature-public-key-${containerUUID}`).val() || '';
    data.path = $(`#signature-path-${containerUUID}`).val() || '';

    return data;
}