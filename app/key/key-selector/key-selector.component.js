const keySelectorComponent = function () {

    function changeSelectedKey(containerUUID, keyId) {
        keyId = keyId || $(`#key-list-${containerUUID}`).val();
        $(`#key-list-${containerUUID}`).val(keyId);

        try {
            const keyPair = _getKeyFromDefaultStorageById(keyId);
            if (!keyPair) {
                throw new Error('No key selected!');
            }
            $(`#key-type-${containerUUID}`).val((keyPair.type || 'Simple'));
            $(`.key-property-${containerUUID}`).removeClass('d-none');
            if (keyPair.type === 'HD') {
                $(`.hd-key-property-${containerUUID}`).removeClass('d-none');
                $(`#key-fingerprint-${containerUUID}`).val((keyPair.fingerprint || ''));
                $(`#public-key-value-${containerUUID}`).val('');
            } else {
                $(`.hd-key-property-${containerUUID}`).addClass('d-none');
                $(`#public-key-value-${containerUUID}`).val(keyPair.publicKey || '');
                $(`#key-fingerprint-${containerUUID}`).val('');
                $(`#key-path-${containerUUID}`).val('');
            }
        } catch (err) {
            console.error(err);
            openToasty('Select Key', err.message, true);
        }
    }

    function checkHDPath(containerUUID) {
        const keyId = $(`#key-list-${containerUUID}`).val();
        try {
            const keyPair = _getKeyFromDefaultStorageById(keyId);
            if (!keyPair || !keyPair.base58) {
                throw new Error('Cannot derive path for key!');;
            }
            const path = $(`#key-path-${containerUUID}`).val();
            const network = networkComponent.htmlToData('default');
            const hdKey = bitcoinjs.bip32.fromBase58(keyPair.base58, network);
            const singleKey = hdKey.derivePath(path);
            $(`#public-key-value-${containerUUID}`).val((singleKey.publicKey || '').toString('hex'));
        } catch (err) {
            console.error(err);
            openToasty('Check Path', err.message, true);
        }
    }

    function _getKeyFromDefaultStorageById(keyId) {
        const keyData = keyManagerComponent.htmlToData('default');
        return keyData.keys.find(key => key.id === keyId);
    }

    return {
        changeSelectedKey,
        checkHDPath
    }
}();