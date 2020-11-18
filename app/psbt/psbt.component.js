const psbtComponent = function () {

    const PHASES = ['create', 'update', 'sign', 'combine', 'finalize', 'extract']

    function setCurrentPhase(containerUUID, phase) {
        try {
            phase = phase || $(`#psbt-phase-${containerUUID}`).val();
            _updateUIForPhase(containerUUID, phase);
            $(`#psbt-phase-${containerUUID}`).val(phase);
            psbtComponent.setRole(containerUUID, phase);

            const phaseContainerUUID = _buildContainerUUIDForPhase(containerUUID);
            const psbtDataHtml = psbtDataComponent.createNew({
                containerUUID: `inner-${phaseContainerUUID}`
            });

            $(`#psbt-${phase}-${containerUUID}`).html(psbtDataHtml);

            const psbtBase64 = $(`#psbt-data-${phase}-${containerUUID}`).val() || '';
            if (psbtBase64) {
                const network = networkComponent.htmlToData('default');
                const psbt = bitcoinjs.Psbt.fromBase64(psbtBase64, {
                    network
                });
                psbtComponent.dataToHtml(phaseContainerUUID, {
                    psbt
                });
                psbtComponent.setRole(phaseContainerUUID, phase);
            }

            $(`#psbt-progress-${containerUUID}`).width(`${((PHASES.indexOf(phase) + 1)/PHASES.length)*100}%`);
            $(`#psbt-progress-phase-${containerUUID}`).text(phase);

        } catch (err) {
            console.error(err);
            openToasty('PSBT Phase', err.message, true);
        }
    }

    function openPsbtFromStringModal(containerUUID, psbtStringType = 'base64') {
        $('#modal-title').text(`PSBT from ${psbtStringType}`);
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        $('#modal-body').append('<textarea id="psbtString" rows="10" style="width: 100%"></textarea>');

        $('#modal-confirm-button').click(function () {
            try {
                const phase = $(`#psbt-phase-${containerUUID}`).val();
                const phaseContainerUUID = _buildContainerUUIDForPhase(containerUUID);

                const psbtString = ($('#psbtString').val() || '').trim();
                if (!psbtString) {
                    psbtComponent.dataToHtml(phaseContainerUUID, {});
                    psbtComponent.setRole(phaseContainerUUID, phase);
                    return;
                }
                const network = networkComponent.htmlToData('default');
                const psbt = psbtStringType === 'base64' ? bitcoinjs.Psbt.fromBase64(psbtString, {
                    network
                }) : bitcoinjs.Psbt.fromHex(psbtString, {
                    network
                });
                console.log('psbt inport:', psbt);

                psbtComponent.dataToHtml(phaseContainerUUID, {
                    psbt
                });
                psbtComponent.setRole(phaseContainerUUID, phase);


                $(`#psbt-data-${phase}-${containerUUID}`).val(psbt.toBase64());

                if (phase === 'create' || phase === 'update') {
                    const signedInput = (psbt.data.inputs || []).find(input => input.partialSig && input.partialSig.length);
                    const finalizedInput = (psbt.data.inputs || [])
                        .find(input => (input.finalScriptSig && input.finalScriptSig.length) ||
                            (input.finalScriptWitness && input.finalScriptWitness.length));
                    if (signedInput || finalizedInput) {
                        gotoPhase(containerUUID, 'sign', psbtString);
                        openToasty(`PSBT from ${psbtStringType}`, `Found at least one  ${finalizedInput ? 'finalized' : 'signed'} input. Moving to 'Sign' phase!`);
                        return;
                    }
                }
            } catch (err) {
                console.error(err);
                openToasty(`PSBT from ${psbtStringType}`, err.message, true);
            }
        });
    }

    function openPsbtToStringModal(containerUUID, psbtStringType = 'base64') {
        $('#modal-title').text(`PSBT to ${psbtStringType}`);
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        $('#modal-body').append(`<textarea id="psbtString" rows="10" style="width: 100%"></textarea>`);
        try {
            const phase = $(`#psbt-phase-${containerUUID}`).val();

            if (!PHASES.includes(phase)) {
                throw new Error(`Unknown phase '${phase}'!`);
            }
            const psbtBase64 = _fetchPsbtBase64ForPhase(containerUUID, phase);
            const network = networkComponent.htmlToData('default');
            if (psbtStringType === 'json') {
                const psbt = bitcoinjs.Psbt.fromBase64(psbtBase64, {
                    network
                });

                function x(k, v) {
                    if (v instanceof Array && (typeof v[0] === 'number'))
                        return safeBuffer.Buffer.from(v).toString('hex');
                    return v;
                }
                $(`#psbtString`).val(JSON.stringify(psbt, x, 2));
            } else if (psbtStringType === 'hex') {
                const psbtHex = bitcoinjs.Psbt.fromBase64(psbtBase64, {
                    network
                }).toHex();
                $(`#psbtString`).val(psbtHex);
            } else {
                $(`#psbtString`).val(psbtBase64);
            }

        } catch (err) {
            console.error(err);
            openToasty(`PSBT to ${psbtStringType}`, err.message, true);
        }
    }

    function openSignInputsModal(containerUUID) {
        $('#modal-title').text('Sign Inputs');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        try {
            const phase = $(`#psbt-phase-${containerUUID}`).val();
            if (!PHASES.includes(phase)) {
                throw new Error(`Unknown phase '${phase}'!`);
            }
            const phaseContainerUUID = _buildContainerUUIDForPhase(containerUUID);

            let psbtBase64 = _fetchPsbtBase64ForPhase(containerUUID, phase);
            if (!psbtBase64) {
                const psbt = psbtComponent.htmlToData(phaseContainerUUID);
                psbtBase64 = psbt.toBase64();
            }

            const signInputUUID = uuidv4();
            const signInputHtml = signInputComponent.createNew({
                containerUUID: signInputUUID
            });

            $('#modal-body').html(`<div id="sign-input-container-${signInputUUID}">${signInputHtml}</div>`);
            const keyData = keyManagerComponent.htmlToData('default');
            signInputComponent.dataToHtml(signInputUUID, {
                psbtBase64,
                keys: keyData.keys
            });
            $('#modal-extra-buttons').html(signInputComponent.createExternalMenu({
                containerUUID: signInputUUID
            }));

            signInputComponent.setRole(signInputUUID, phase);

            $('#modal-confirm-button').click(function () {
                try {
                    const signedInputData = signInputComponent.htmlToData(signInputUUID);
                    const network = networkComponent.htmlToData('default');
                    psbtComponent.dataToHtml(phaseContainerUUID, {
                        psbt: bitcoinjs.Psbt.fromBase64(signedInputData.psbtBase64, {
                            network
                        })
                    });
                    psbtComponent.setRole(phaseContainerUUID, phase);
                    $(`#psbt-data-${phase}-${containerUUID}`).val(signedInputData.psbtBase64 || '');
                } catch (err) {
                    console.error(err);
                    openToasty('Sign Inputs', err.message, true);
                }
            });
        } catch (err) {
            console.error(err);
            openToasty('PSBT Signatures', err.message, true);
        }
    }

    function openCombinePsbtsModal(containerUUID) {
        $('#modal-title').text('Combine PSBT');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        $('#modal-body').append('<textarea id="psbtBase64" rows="10" style="width: 100%"></textarea>');

        try {
            const phase = $(`#psbt-phase-${containerUUID}`).val();

            if (!PHASES.includes(phase)) {
                throw new Error(`Unknown phase '${phase}'!`);
            }
            const currentPsbtBase64 = _fetchPsbtBase64ForPhase(containerUUID, phase);
            const network = networkComponent.htmlToData('default');
            const currentPsbt = currentPsbtBase64 ? bitcoinjs.Psbt.fromBase64(currentPsbtBase64, {
                network
            }) : null;

            $('#modal-confirm-button').click(function () {
                try {
                    const psbtBase64 = $('#psbtBase64').val();
                    const psbt = psbtBase64 ? bitcoinjs.Psbt.fromBase64(psbtBase64, {
                        network
                    }) : null;
                    if (!psbt) {
                        throw new Error('No PSBT Data provided');
                    }
                    const combinedPsbt = currentPsbt.combine(psbt);

                    const phaseContainerUUID = _buildContainerUUIDForPhase(containerUUID);
                    psbtComponent.dataToHtml(phaseContainerUUID, {
                        psbt: combinedPsbt
                    });
                    psbtComponent.setRole(phaseContainerUUID, phase);
                    $(`#psbt-data-combine-${containerUUID}`).val(combinedPsbt.toBase64());
                } catch (err) {
                    console.error(err);
                    openToasty('Combine PSBT', err.message, true);
                }
            });
        } catch (err) {
            console.error(err);
            openToasty('Combine PSBT', err.message, true);
        }
    }

    function openFinalizeModal(containerUUID) {
        $('#modal-title').text('Finalize Inputs');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        try {
            const phase = $(`#psbt-phase-${containerUUID}`).val();
            if (phase !== 'finalize') {
                $('#modal-body').html(`<div>You are not in the 'Finalize' phase!</div>`);
                throw new Error(`You are not in the 'Finalize' phase!`);
            }
            const psbtBase64 = _fetchPsbtBase64ForPhase(containerUUID, phase);

            const signInputUUID = uuidv4();
            const signInputHtml = signInputComponent.createNew({
                containerUUID: signInputUUID
            });

            $('#modal-body').html(`<div id="finalize-input-container-${signInputUUID}">${signInputHtml}</div>`);
            signInputComponent.dataToHtml(signInputUUID, {
                psbtBase64
            });
            $('#modal-extra-buttons').html(signInputComponent.createExternalMenu({
                containerUUID: signInputUUID
            }));

            signInputComponent.setRole(signInputUUID, phase);

            $('#modal-confirm-button').click(function () {
                try {
                    const network = networkComponent.htmlToData('default');
                    const phaseContainerUUID = _buildContainerUUIDForPhase(containerUUID);
                    const finalizedData = signInputComponent.htmlToData(signInputUUID);
                    const finalizedPsbt = bitcoinjs.Psbt.fromBase64(finalizedData.psbtBase64, {
                        network
                    });
                    psbtComponent.dataToHtml(phaseContainerUUID, {
                        psbt: finalizedPsbt
                    });
                    psbtComponent.setRole(phaseContainerUUID, phase);

                    $(`#psbt-data-${phase}-${containerUUID}`).val(finalizedData.psbtBase64 || '');
                } catch (err) {
                    console.error(err);
                    openToasty('Finalize Inputs', err.message, true);
                }
            });
        } catch (err) {
            console.error(err);
            openToasty('Finalize Inputs', err.message, true);
        }
    }

    function openTransactionModal(containerUUID, viewMode = 'hex') {
        $('#modal-title').text('Extract Transaction');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        try {
            const network = networkComponent.htmlToData('default');
            const phase = $(`#psbt-phase-${containerUUID}`).val();
            const psbtBase64 = _fetchPsbtBase64ForPhase(containerUUID, phase);
            const psbt = bitcoinjs.Psbt.fromBase64(psbtBase64, {
                network
            });
            const tx = psbt.extractTransaction();
            if (viewMode === 'hex') {
                $('#modal-body').html('<textarea id="txHex" rows="10" style="width: 100%"></textarea>');
                $(`#txHex`).val(tx.toHex());
            } else {
                const newContainerUUID = uuidv4();
                $(`#modal-body`).html(transactionComponent.createNew({
                    containerUUID: newContainerUUID
                }));
                transactionComponent.initInOutLists(newContainerUUID);
                transactionComponent.dataToHtml(newContainerUUID, {
                    tx
                });
                transactionComponent.setReadOnly(newContainerUUID, true);
            }

        } catch (err) {
            console.error(err);
            openToasty('Extract Transaction', err.message, true);
        }
    }

    function clear(containerUUID) {
        const container = $(`#psbt-container-${containerUUID}`);
        const parentContainerId = container.parent().attr('id');
        container.remove();

        $(`#${parentContainerId}`).html(psbtComponent.createNew({
            containerUUID
        }));
        psbtComponent.setCurrentPhase(containerUUID, 'create');
    }

    function gotoPhase(containerUUID, targetPhase, targetData) {
        try {
            const phase = $(`#psbt-phase-${containerUUID}`).val();

            if (!PHASES.includes(phase)) {
                throw new Error(`Unknown phase '${phase}'!`);
            }
            if (!PHASES.includes(targetPhase)) {
                throw new Error(`Unknown phase '${targetPhase}'!`);
            }
            const psbtBase64 = _fetchPsbtBase64ForPhase(containerUUID, phase);
            $(`#psbt-data-${phase}-${containerUUID}`).val(psbtBase64);
            $(`#psbt-data-${targetPhase}-${containerUUID}`).val(targetData || psbtBase64);

            setCurrentPhase(containerUUID, targetPhase);

            $(`#psbt-actions-${targetPhase}-${containerUUID}`).click();
        } catch (err) {
            console.error(err);
            openToasty('Go to next phase', err.message, true);
        }
    }

    function gotoNextPhase(containerUUID) {
        try {
            const phase = $(`#psbt-phase-${containerUUID}`).val();

            if (!PHASES.includes(phase)) {
                throw new Error(`Unknown phase '${phase}'!`);
            }
            const nextPhase = PHASES[PHASES.indexOf(phase) + 1];

            if (!PHASES.includes(nextPhase)) {
                throw new Error(`Unknown phase '${nextPhase}'!`);
            }
            const psbtBase64 = _fetchPsbtBase64ForPhase(containerUUID, phase);
            $(`#psbt-data-${phase}-${containerUUID}`).val(psbtBase64);
            $(`#psbt-data-${nextPhase}-${containerUUID}`).val(psbtBase64);

            setCurrentPhase(containerUUID, nextPhase);

            $(`#psbt-actions-${nextPhase}-${containerUUID}`).click();
        } catch (err) {
            console.error(err);
            openToasty('Go to next phase', err.message, true);
        }
    }

    function gotoPreviousPhase(containerUUID) {
        try {
            const phase = $(`#psbt-phase-${containerUUID}`).val();

            if (!PHASES.includes(phase)) {
                throw new Error(`Unknown phase '${phase}'!`);
            }
            const prevPhase = PHASES[PHASES.indexOf(phase) - 1];

            if (!PHASES.includes(prevPhase)) {
                throw new Error(`Unknown phase '${prevPhase}'!`);
            }
            setCurrentPhase(containerUUID, prevPhase);
            $(`#psbt-actions-${prevPhase}-${containerUUID}`).click();
        } catch (err) {
            console.error(err);
            openToasty('Go to previous phase', err.message, true);
        }
    }

    function _updateUIForPhase(containerUUID, phase) {
        if (!PHASES.includes(phase)) {
            throw new Error(`Unknown phase '${phase}'`);
        }
        if (phase === 'create') {
            $(`#psbt-goto-prev-${containerUUID}`).hide();
        } else {
            $(`#psbt-goto-prev-${containerUUID}`).show();
        }
        if (phase === 'extract') {
            $(`#psbt-goto-next-${containerUUID}`).hide();
        } else {
            $(`#psbt-goto-next-${containerUUID}`).show();
        }

        _updateNavigationPhases(containerUUID, phase);
    }

    function _updateNavigationPhases(containerUUID, phase) {
        phase = phase || $(`#psbt-phase-${containerUUID}`).val();
        if (!PHASES.includes(phase)) {
            throw new Error(`Unknown phase '${phase}'`);
        }
        let foundPhase = false;
        PHASES.forEach(p => {
            if (p === phase) {
                $(`#psbt-phase-${p}-navigation-${containerUUID}`).removeClass('btn-success btn-secondary').addClass('btn-primary');
                foundPhase = true;
            } else if (foundPhase) {
                $(`#psbt-phase-${p}-navigation-${containerUUID}`).removeClass('btn-primary btn-success').addClass('btn-secondary');
            } else {
                $(`#psbt-phase-${p}-navigation-${containerUUID}`).removeClass('btn-primary btn-secondary').addClass('btn-success');
            }
        })
    }

    function _buildContainerUUIDForPhase(containerUUID) {
        const phase = $(`#psbt-phase-${containerUUID}`).val();

        if (!PHASES.includes(phase)) {
            throw new Error(`Unknown phase '${phase}'!`);
        }
        return `${phase}-phase-container-${containerUUID}`;
    }

    function _fetchPsbtBase64ForPhase(containerUUID, phase) {
        if (phase === 'create' || phase === 'update') {
            const psbt = psbtComponent.htmlToData(_buildContainerUUIDForPhase(containerUUID));
            return psbt.toBase64();
        }
        return $(`#psbt-data-${phase}-${containerUUID}`).val() || '';
    }

    return {
        openPsbtFromStringModal,
        openPsbtToStringModal,
        openSignInputsModal,
        openCombinePsbtsModal,
        openTransactionModal,
        openFinalizeModal,
        setCurrentPhase,
        clear,
        gotoNextPhase,
        gotoPreviousPhase,
        gotoPhase
    }
}();