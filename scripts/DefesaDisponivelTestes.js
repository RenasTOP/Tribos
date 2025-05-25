// Script Configuração
var strVersion = 'v1.0';
var unitDesc = {
    spear: 'Spear fighters',
    sword: 'Swordsmen',
    axe: 'Axemen',
    archer: 'Archers',
    spy: 'Scouts',
    light: 'Light cavalry',
    marcher: 'Mounted archers',
    heavy: 'Heavy cavalry',
    ram: 'Rams',
    catapult: 'Catapults',
    knight: 'Paladin',
    snob: 'Noblemen',
};

if (typeof unitConfig == 'undefined') {
    unitConfig = fnCreateUnitConfig();
}

// Função para verificar se estamos na tela correta
function checkScreen(userScreen, userMode) {
    const currentLocation = window.location.href;
    const url = new URL(currentLocation);
    const gameScreen = url.searchParams.get('screen');
    const gameMode = url.searchParams.get('mode');
    if (gameScreen === userScreen && gameMode === userMode) {
        return true;
    }
    return false;
}

// Função para executar o script
function fnExecuteScript() {
    var isTroopsOverviewScreen = checkScreen('overview_villages', 'units');
    if (isTroopsOverviewScreen) {
        fnCalculateTroopCount();
    } else {
        UI.ErrorMessage(
            'Script must be run from the Troops Overview screen.',
            5000
        );
    }
}

// Função para coletar dados de tropas
function fnGetTroopCount() {
    var gameVersion = parseFloat(game_data.version.split(' ')[1].replace('release_', ''));
    var colCount = $('#units_table thead th').length - 2;
    var villageTroopInfo = [];
    
    $('#units_table > tbody').each(function (row) {
        $(this).find('tr:last').remove();
    });

    $('#units_table tbody').each(function (row, eleRow) {
        var villageData = { troops: Array(12).fill(0) };
        var coords = $(eleRow).find('td:eq(0)').text().match(/\d+\|\d+/g);
        coords = coords ? coords[coords.length - 1].match(/(\d+)\|(\d+)/) : null;
        villageData.x = parseInt(coords[1], 10);
        villageData.y = parseInt(coords[2], 10);
        villageData.coords = coords[0];

        $(eleRow).find('td:gt(0):not(:has(>a))').each(function (cell, eleCell) {
            if (Math.floor(cell / colCount) != 1) {
                if (Math.floor(cell / colCount) != 0) {
                    villageData.troops[(cell % colCount) - 1] += parseInt($(eleCell).text() || '0', 10);
                }
            }
        });

        villageTroopInfo.push(villageData);
    });

    return villageTroopInfo;
}

// Função para calcular e exibir a contagem de tropas
function fnCalculateTroopCount() {
    const villageTroops = fnGetTroopCount();
    const summary = {
        offense: 0,
        defense: 0,
    };

    villageTroops.forEach(village => {
        summary.offense += village.troops[1] + village.troops[3];  // Exemplo de tropa ofensiva
        summary.defense += village.troops[0] + village.troops[2];  // Exemplo de tropa defensiva
    });

    // Exibição das contagens
    const troopsContent = `
        <h3>Tropa Ofensiva</h3>
        <p>${summary.offense} Troops</p>
        <h3>Tropa Defensiva</h3>
        <p>${summary.defense} Troops</p>
    `;

    // Adicionar no HTML da página
    const popupContent = preparePopupContent(troopsContent);
    Dialog.show('content', popupContent);
}

// Função para preparar o conteúdo da popup
function preparePopupContent(popupBody) {
    const popupHeader = `<div class="ra-body">`;
    const popupFooter = `</div>`;

    let popupContent = `
        ${popupHeader}
        ${popupBody}
        ${popupFooter}
    `;
    
    return popupContent;
}

(async function () {
    if (!game_data.features.Premium.active) {
        UI.ErrorMessage('Premium Account is required for this script!', 6000);
    } else {
        fnExecuteScript();
    }
})();
