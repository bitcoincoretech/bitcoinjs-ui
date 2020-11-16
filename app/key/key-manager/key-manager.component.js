const keyManagerComponent = function () {

    function openInDefaultModal() {
        $('#modal-title').text('Key Manager');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();
        try {
            const data = keyManagerComponent.htmlToData('default');

            const containerUUID = uuidv4();
            $('#modal-body').html(keyManagerComponent.createNew({
                containerUUID
            }));
            $('#modal-extra-buttons').html(keyManagerComponent.createExternalMenu({
                containerUUID
            }));
            keyManagerComponent.dataToHtml(containerUUID, data);

            $('#modal-confirm-button').click(function () {
                try {
                    const updatedData = keyManagerComponent.htmlToData(containerUUID);
                    $('#key-manager-default-data').html(keyManagerComponent.createNew({
                        containerUUID: 'default'
                    }));
                    keyManagerComponent.dataToHtml('default', updatedData);
                    $('#default-keys-count').text((updatedData.keys || []).length);
                } catch (err) {
                    console.error(err);
                    openToasty('Key Manager', err.message, true);
                }
            });
        } catch (err) {
            console.error(err);
            openToasty('Base64 PSBT ', err.message, true);
        }
    }

    function addNewKey(containerUUID, keyType = 'HD', keyData = {}) {
        const keyUUID = uuidv4();
        $(`#key-manager-entries-${containerUUID}`).append(_buildKeyEntry(containerUUID, keyUUID, keyType, keyData));

    }

    function removeKey(containerUUID, keyUUID) {
        $(`.key-entry-row-${keyUUID}`).remove();
        $(`.key-entry-row-${containerUUID}`).removeClass('blur-medium');
    }

    function toggleKeyDetails(containerUUID, keyUUID) {
        if ($(`#key-entry-details-${keyUUID}`).hasClass('d-none')) {
            $(`#key-entry-details-${keyUUID}`).removeClass('d-none').addClass('d-flex');
            $(`#key-entry-details-toggle-${keyUUID}`).html('Cancel').removeClass('btn-info').addClass('btn-secondary');
            $(`#update-key-entry-details-${keyUUID}`).removeClass('d-none');
            $(`.key-entry-row-${containerUUID}`).addClass('blur-medium');
            $(`.key-entry-row-${keyUUID}`).removeClass('blur-medium');

            _showKeyDetails(keyUUID);
        } else {
            $(`#key-entry-details-${keyUUID}`).addClass('d-none').removeClass('d-flex');
            $(`#key-entry-details-toggle-${keyUUID}`).html('More').addClass('btn-info').removeClass('btn-secondary');
            $(`#update-key-entry-details-${keyUUID}`).addClass('d-none');
            $(`.key-entry-row-${containerUUID}`).removeClass('blur-medium');
        }
    }

    function updateKeyDetails(containerUUID, keyUUID, keyType) {
        if (keyType === 'HD') {
            const data = hdKeyComponent.htmlToData(keyUUID);
            $(`#key-entry-public-key-${keyUUID}`).val(data.publicKey || '');
            $(`#key-entry-base58-${keyUUID}`).val(data.base58 || '');
            $(`#key-entry-fingerprint-${keyUUID}`).val(data.fingerprint || '');
            const keyNameInput = $(`#key-entry-name-${keyUUID}`);
            if (!keyNameInput.val() && data.fingerprint) {
                keyNameInput.val(data.fingerprint);
            }
        } else {
            const data = keyPairComponent.htmlToData(keyUUID);
            $(`#key-entry-public-key-${keyUUID}`).val(data.publicKey || '');
            $(`#key-entry-base58-${keyUUID}`).val(data.wif || '');
            const keyNameInput = $(`#key-entry-name-${keyUUID}`);
            if (!keyNameInput.val() && data.publicKey) {
                keyNameInput.val(`${data.publicKey.substring(0,10)}...${data.publicKey.slice(-7)}`);
            }
        }
        toggleKeyDetails(containerUUID, keyUUID);
    }

    function _showKeyDetails(keyUUID) {
        const keyType = $(`#key-entry-type-${keyUUID}`).text() || 'HD';
        const base58Value = $(`#key-entry-base58-${keyUUID}`).val() || '';
        if (keyType === 'HD') {
            $(`#key-entry-details-container-${keyUUID}`).html(hdKeyComponent.createNew({
                containerUUID: keyUUID
            }));
            hdKeyComponent.dataToHtml(keyUUID, {
                base58: base58Value
            });
        } else {
            $(`#key-entry-details-container-${keyUUID}`).html(keyPairComponent.createNew({
                containerUUID: keyUUID
            }));
            keyPairComponent.changeSourceType(keyUUID);
            keyPairComponent.dataToHtml(keyUUID, {
                wif: base58Value
            });
        }
    }


    function _buildKeyEntry(containerUUID, keyUUID, keyType, keyData) {
        return `
            <tr id="key-entry-row-${keyUUID}" class="d-flex key-entry-row-${keyUUID} key-entry-row-${containerUUID}">
                <td class="col-sm-4">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span id="key-entry-type-${keyUUID}" class="input-group-text">${keyType}</span>
                        </div>
                        <input id="key-entry-name-${keyUUID}" value="${keyData.name || ''}" class="form-control">
                        <div class="input-group-append">
                            <button type="button" onclick="keyManagerComponent.removeKey('${containerUUID}', '${keyUUID}')" class="btn btn-info btn-sm btn-danger">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </td>

                <td class="col-sm-8">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">hex</span>
                        </div>
                        <textarea id="key-entry-public-key-${keyUUID}" rows="1" disabled placeholder="Click 'More' to set value."
                            class="form-control asm read-only-disable-${keyUUID}">${keyData.publicKey || ''}</textarea>
                        <input hidden id="key-entry-base58-${keyUUID}" value="${keyData.base58 || ''}" >
                        <input hidden id="key-entry-fingerprint-${keyUUID}" value="${keyData.fingerprint || ''}" >
                        <input hidden id="key-entry-id-${keyUUID}" value="${keyData.id || uuidv4()}" >
                        <div class="input-group-append">
                            <button id="update-key-entry-details-${keyUUID}" onclick="keyManagerComponent.updateKeyDetails('${containerUUID}', '${keyUUID}', '${keyType}')"
                                class="btn btn-success d-none">
                                OK
                            </button>
                            <button id="key-entry-details-toggle-${keyUUID}" onclick="keyManagerComponent.toggleKeyDetails('${containerUUID}', '${keyUUID}')"
                                class="btn btn-info">
                                More
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
            <tr id="key-entry-details-${keyUUID}" class="d-none key-entry-row-${keyUUID} key-entry-row-${containerUUID}">
                <td class="col-sm-4">
                </td>
                <td class="col-sm-8">
                    <div class="alert alert-info">
                        Click OK to update!
                    </div>
                    <div id="key-entry-details-container-${keyUUID}" class="table-active p-3"> </div>
                    <div class="alert alert-info mt-3">
                        Click OK to update!
                    </div>
                </td>
            </tr>

        `;
    }

    return {
        openInDefaultModal,
        addNewKey,
        removeKey,
        toggleKeyDetails,
        updateKeyDetails
    }
}();