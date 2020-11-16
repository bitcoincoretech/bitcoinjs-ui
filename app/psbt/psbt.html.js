psbtComponent.createNew = function createNew(op) {
    return `
            <div id="psbt-container-${op.containerUUID}">
                <input id="psbt-phase-${op.containerUUID}" hidden>
                <input id="psbt-data-create-${op.containerUUID}" hidden>
                <input id="psbt-data-update-${op.containerUUID}" hidden>
                <input id="psbt-data-sign-${op.containerUUID}" hidden>
                <input id="psbt-data-combine-${op.containerUUID}" hidden>
                <input id="psbt-data-extract-${op.containerUUID}" hidden>
                <input id="psbt-data-finalize-${op.containerUUID}" hidden>
                <div class="row border bg-light rounded">
                    <div class="col-md-2 col-sm-6">
                        <button id="psbt-phase-create-navigation-${op.containerUUID}"  onclick="psbtComponent.gotoPhase('${op.containerUUID}', 'create')"
                            type="button" class="btn btn-primary btn-sm w-75">
                            <span class="badge badge-light float-left mt-1">1</span>
                            Create
                        </button>
                        <i class="fa fa-arrow-right float-right mt-2"></i>
                    </div>
                    <div class="col-md-2 col-sm-6">
                        <button id="psbt-phase-update-navigation-${op.containerUUID}"  onclick="psbtComponent.gotoPhase('${op.containerUUID}', 'update')"
                            type="button" class="btn btn-secondary btn-sm w-75">
                            <span class="badge badge-light float-left mt-1">2</span>
                            Update
                        </button>
                        <i class="fa fa-arrow-right float-right mt-2"></i>
                    </div>
                    <div class="col-md-2 col-sm-6">
                        <button id="psbt-phase-sign-navigation-${op.containerUUID}"  onclick="psbtComponent.gotoPhase('${op.containerUUID}', 'sign')"
                            type="button" class="btn btn-secondary btn-sm w-75">
                            <span class="badge badge-light float-left mt-1">3</span>
                            Sign
                        </button>
                        <i class="fa fa-arrow-right float-right mt-2"></i>
                    </div>
                    <div class="col-md-2 col-sm-6">
                        <button id="psbt-phase-combine-navigation-${op.containerUUID}"  onclick="psbtComponent.gotoPhase('${op.containerUUID}', 'combine')"
                            type="button" class="btn btn-secondary btn-sm w-75">
                            <span class="badge badge-light float-left mt-1">4</span>
                            Combine
                        </button>
                        <i class="fa fa-arrow-right float-right mt-2"></i>
                    </div>
                    <div class="col-md-2 col-sm-6">
                        <button id="psbt-phase-finalize-navigation-${op.containerUUID}"  onclick="psbtComponent.gotoPhase('${op.containerUUID}', 'finalize')"
                            type="button" class="btn btn-secondary btn-sm w-75">
                            <span class="badge badge-light float-left mt-1">5</span>
                            Finalize
                        </button>
                        <i class="fa fa-arrow-right float-right mt-2"></i>
                    </div>
                    <div class="col-md-2 col-sm-6">
                        <button id="psbt-phase-extract-navigation-${op.containerUUID}"  onclick="psbtComponent.gotoPhase('${op.containerUUID}', 'extract')"
                            type="button" class="btn btn-secondary btn-sm w-100">
                            <span class="badge badge-light float-left mt-1">6</span>
                            Extract
                        </button>
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="col-sm-12">
                        <div class="progress">
                            <div id="psbt-progress-${op.containerUUID}"  class="progress-bar bg-info">
                                <span id="psbt-progress-phase-${op.containerUUID}"></span>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div class="row mt-3">
                    <div class="col-sm-12">
                        <div id="psbt-actions-${op.containerUUID}" class="carousel slide" data-ride="carousel" data-interval="false">

                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <div id="psbt-create-${op.containerUUID}"></div>
                                </div>
                                <div class="carousel-item">
                                    <div id="psbt-update-${op.containerUUID}"></div>
                                </div>
                                <div class="carousel-item">
                                    <div id="psbt-sign-${op.containerUUID}"></div>
                                </div>
                                <div class="carousel-item">
                                    <div id="psbt-combine-${op.containerUUID}"></div>
                                </div>
                                <div class="carousel-item">
                                    <div id="psbt-finalize-${op.containerUUID}"></div>
                                </div>
                                <div class="carousel-item">
                                    <div  id="psbt-extract-${op.containerUUID}"></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    

                    <div class="col-sm-12 mt-5" hidden>
                        <div class="row">
                            <div class="col-sm-12">
                                <a id="psbt-actions-create-${op.containerUUID}" data-target="#psbt-actions-${op.containerUUID}" data-slide-to="0" href="#">Create</a>
                                <a id="psbt-actions-update-${op.containerUUID}" data-target="#psbt-actions-${op.containerUUID}" data-slide-to="1" href="#">Update</a>
                                <a id="psbt-actions-sign-${op.containerUUID}" data-target="#psbt-actions-${op.containerUUID}" data-slide-to="2" href="#">Sign</a>
                                <a id="psbt-actions-combine-${op.containerUUID}" data-target="#psbt-actions-${op.containerUUID}" data-slide-to="3" href="#">Combine</a>
                                <a id="psbt-actions-finalize-${op.containerUUID}" data-target="#psbt-actions-${op.containerUUID}" data-slide-to="4" href="#">Finalize</a>
                                <a id="psbt-actions-extract-${op.containerUUID}" data-target="#psbt-actions-${op.containerUUID}" data-slide-to="5" href="#">Extract</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `
}

psbtComponent.createExternalMenu = function createExternalMenu(op) {
    return `
            <div class="mr-5 button120">
                <button id="psbt-goto-prev-${op.containerUUID}" onclick="psbtComponent.gotoPreviousPhase('${op.containerUUID}')" type="button" class="btn btn-secondary button120">
                    <span class="badge badge-light float-left mt-1">
                        <i class="fa fa-caret-left "></i>
                    </span>
                    Back
                </button>
            </div>

            <div class="btn-group dropup ml-5 button120">
                <button onclick="psbtComponent.openPsbtFromStringModal('${op.containerUUID}')" type="button" class="btn btn-info"  data-toggle="modal" data-target="#modal-dialog">
                    Import
                </button>
                <button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown">
                    <span class="caret"></span>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" onclick="psbtComponent.openPsbtFromStringModal('${op.containerUUID}', 'hex')" data-toggle="modal" data-target="#modal-dialog"
                     href="#">From Hex</a>
                    <a class="dropdown-item" onclick="psbtComponent.openPsbtFromStringModal('${op.containerUUID}', 'base64')" data-toggle="modal" data-target="#modal-dialog"
                        href="#">From Base64</a>
                </div>
            </div>

            <div class="btn-group dropup ml-3 mr-5 button120">
                <button onclick="psbtComponent.openPsbtToStringModal('${op.containerUUID}', 'base64')" type="button" class="btn btn-info "  data-toggle="modal" data-target="#modal-dialog">
                    Export
                </button>
                <button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown">
                    <span class="caret"></span>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" onclick="psbtComponent.openPsbtToStringModal('${op.containerUUID}', 'json')" data-toggle="modal" data-target="#modal-dialog"
                        href="#">To JSON</a>
                    <a class="dropdown-item" onclick="psbtComponent.openPsbtToStringModal('${op.containerUUID}', 'hex')" data-toggle="modal" data-target="#modal-dialog"
                     href="#">To Hex</a>
                    <a class="dropdown-item" onclick="psbtComponent.openPsbtToStringModal('${op.containerUUID}', 'base64')" data-toggle="modal" data-target="#modal-dialog"
                        href="#">To Base64</a>
                </div>
            </div>

            <button data-toggle="modal" data-target="#modal-dialog"
                onclick="psbtComponent.openSignInputsModal('${op.containerUUID}')" type="button" 
                class="btn btn-info d-none role-create-${op.containerUUID} role-update-${op.containerUUID}">
                Signature Config
            </button>
        
            <button data-toggle="modal" data-target="#modal-dialog"
                onclick="psbtComponent.openSignInputsModal('${op.containerUUID}')" type="button" 
                class="btn btn-warning d-none button120 role-sign-${op.containerUUID}">
                Sign
                <i class="fas fa-signature ml-1"></i>
            </button>
            <button data-toggle="modal" data-target="#modal-dialog"
                onclick="psbtComponent.openSignInputsModal('${op.containerUUID}')" type="button" 
                class="btn btn-info d-none role-combine-${op.containerUUID}">
                View Signatures
            </button>
            <button data-toggle="modal" data-target="#modal-dialog"
                onclick="psbtComponent.openCombinePsbtsModal('${op.containerUUID}')" type="button" 
                class="btn btn-primary button120 ml-3 d-none role-combine-${op.containerUUID}">
                Combine
                <i class="far fa-object-group ml-1"></i>
            </button>
            <button data-toggle="modal" onclick="psbtComponent.openFinalizeModal('${op.containerUUID}')" type="button" 
                class="btn btn-success button120 d-none role-finalize-${op.containerUUID}"  data-toggle="modal" data-target="#modal-dialog">
                Finalize 
                <i class="fas fa-check ml-1"></i>
            </button>

            <div class="btn-group dropup d-none role-extract-${op.containerUUID}">
                <button data-toggle="modal" onclick="psbtComponent.openTransactionModal('${op.containerUUID}', 'hex')" type="button" 
                    class="btn btn-success button120" data-toggle="modal" data-target="#modal-dialog">
                    Extract
                </button>
                <button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-toggle="dropdown">
                    <span class="caret"></span>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" onclick="psbtComponent.openTransactionModal('${op.containerUUID}', 'view')" data-toggle="modal" data-target="#modal-dialog"
                        href="#">View Transaction</a>
                    <a class="dropdown-item" onclick="psbtComponent.openTransactionModal('${op.containerUUID}', 'hex')" data-toggle="modal" data-target="#modal-dialog"
                     href="#">Transaction Hex</a>
                </div>
            </div>
          
            <button onclick="psbtComponent.clear('${op.containerUUID}')" type="button" class="btn btn-light ml-3 mr-5 button120"">
                Clear
                <i class="fas fa-eraser"></i>
            </button>
           
            <div class="ml-5 button120">
                <button id="psbt-goto-next-${op.containerUUID}"  onclick="psbtComponent.gotoNextPhase('${op.containerUUID}')" type="button" class="btn btn-secondary button120">
                    Next
                    <span class="badge badge-light float-right mt-1">
                        <i class="fa fa-caret-right "></i>
                    </span>
                </button>
            </div>
            
    `;
}

psbtComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    psbtDataComponent.dataToHtml(containerUUID, data);
}

psbtComponent.htmlToData = function htmlToData(containerUUID) {
    const psbtData = psbtDataComponent.htmlToData(containerUUID);
    const network = networkComponent.htmlToData('default');
    const psbt = new bitcoinjs.Psbt({
        network
    });
    psbt.version = psbtData.version;
    psbt.locktime = psbtData.locktime;

    psbtData.inputs.forEach(input => {
        psbt.addInput(input);
    });

    psbtData.outputs.forEach(output => {
        psbt.addOutput(output);
    });

    return psbt;
}

psbtComponent.setRole = function setRole(containerUUID, role) {
    $(`.role-create-${containerUUID}`).addClass('d-none');
    $(`.role-update-${containerUUID}`).addClass('d-none');
    $(`.role-sign-${containerUUID}`).addClass('d-none');
    $(`.role-combine-${containerUUID}`).addClass('d-none');
    $(`.role-finalize-${containerUUID}`).addClass('d-none');
    $(`.role-extract-${containerUUID}`).addClass('d-none');

    $(`.role-${role}-${containerUUID}`).removeClass('d-none');

    // psbtDataComponent.setRole(containerUUID, role);
}