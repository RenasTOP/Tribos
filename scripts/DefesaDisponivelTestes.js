// Função para verificar se estamos na tela correta
function checkScreen(userScreen, userMode) {
    const currentLocation = window.location.href;
    const url = new URL(currentLocation);
    const gameScreen = url.searchParams.get('screen');
    const gameMode = url.searchParams.get('mode');
    return gameScreen === userScreen && gameMode === userMode;
}

// Função para executar o script
function fnExecuteScript() {
    var isTroopsOverviewScreen = checkScreen('overview_villages', 'units');
    if (isTroopsOverviewScreen) {
        alert('Script is running on the correct page.');
        fnCalculateTroopCount();
    } else {
        UI.ErrorMessage('Script must be run from the Troops Overview screen.', 5000);
    }
}

// Função para coletar dados de tropas
function fnGetTroopCount() {
    const villageTroopInfo = [];
    // Acessar as linhas da tabela de unidades
    const rows = $('#units_table tbody tr');
    
    // Se não encontrar as linhas da tabela, retorna um alerta
    if (rows.length === 0) {
        alert('No rows found in the units table.');
    }
    
    rows.each(function () {
        const rowData = { troops: [] };
        $(this).find('td').each(function (index) {
            // Excluindo as primeiras duas colunas
            if (index > 0) {
                const troopCount = parseInt($(this).text() || '0', 10);
                rowData.troops.push(troopCount);
            }
        });

        villageTroopInfo.push(rowData);
    });

    alert('Troops collected: ' + JSON.stringify(villageTroopInfo)); // Exibir os dados coletados
    return villageTroopInfo;
}

// Função para calcular e exibir a contagem de tropas
function fnCalculateTroopCount() {
    const villageTroops = fnGetTroopCount();
    
    // Verifica se houve coleta de dados
    if (villageTroops.length === 0) {
        alert('No troops data collected.');
        return;
    }

    const summary = {
        offense: 0,
        defense: 0,
    };

    villageTroops.forEach(village => {
        // Considerando que as tropas ofensivas e defensivas estão nas colunas correspondentes
        summary.offense += village.troops[1] + village.troops[3];  // Exemplo de tropas ofensivas
        summary.defense += village.troops[0] + village.troops[2];  // Exemplo de tropas defensivas
    });

    // Exibir o resumo das tropas
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
