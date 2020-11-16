function addItemToDataList(listName, value = '') {
    const dataList = htmlToDataList(listName);
    dataList.push(value);
    dataListToHtml(listName, dataList);
}

function htmlToDataList(listName) {
    const dataList = [];
    $('.list-item-' + listName).each(function () {
        dataList.push(this.value);
    });
    return dataList;
}

function dataListToHtml(listName, dataList) {
    $(`#${listName}`).empty();
    dataList.forEach((item, i) => {
        $(`#${listName}`).append(buildDataListItem(listName, item, i));
    });
}

function removeDataItem(listName, poz) {
    const dataList = htmlToDataList(listName);
    if (poz >= dataList.length) {
        return;
    }
    dataList.splice(poz, 1);
    dataListToHtml(listName, dataList);
}

function buildDataListItem(listName, value, poz) {
    return `<div class="form-group row">
                <div class="col-sm-12">
                    <div class="input-group">
                        <textarea id="list-item-${listName}-${poz}" value="${value}" rows="2"
                            class="form-control asm list-item-${listName} read-only-disable-${listName}" >${value}</textarea>
                        <div class="input-group-append">
                            <button onclick="removeDataItem('${listName}', ${poz})" type="button" class="btn btn-danger btn-sm read-only-hide-${listName}" >
                                <i class="fas fa-trash-alt "></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
}