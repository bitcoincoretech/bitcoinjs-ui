const hdKeyComponent = function () {

    function changeSourceType(containerUUID, sourceType) {
        sourceType = sourceType || $(`#hd-key-import-mode-${containerUUID}`).val() || 'base58';
        $(`#hd-key-import-mode-${containerUUID}`).val(sourceType);

        if (sourceType === 'base58') {
            $(`#hd-key-base58-${containerUUID}-row`).removeClass('d-none');
            $(`#hd-key-seed-${containerUUID}-row`).addClass('d-none');
        } else {
            $(`#hd-key-base58-${containerUUID}-row`).addClass('d-none');
            $(`#hd-key-seed-${containerUUID}-row`).removeClass('d-none');
        }
    }

    function importBase58(containerUUID) {
        try {
            const network = networkComponent.htmlToData('default');
            const base58 = ($(`#hd-key-base58-${containerUUID}`).val() || '').trim();
            const hdKey = bitcoinjs.bip32.fromBase58(base58, network);
            $(`#hd-public-key-value-${containerUUID}`).val(hdKey.publicKey.toString('hex'));
            $(`#hd-fingerprint-value-${containerUUID}`).val(hdKey.fingerprint.toString('hex'));
        } catch (err) {
            console.error(err);
            openToasty('Import Base64 HD', err.message, true);
        }
    }

    function importSeed(containerUUID) {
        const network = networkComponent.htmlToData('default');
        const seed = $(`#hd-key-seed-${containerUUID}`).val();

        const x = bitcoinjs.bip32.fromSeed(base58, network);
        console.log('base58', x);
    }

    return {
        changeSourceType,
        importBase58,
        importSeed
    }
}();