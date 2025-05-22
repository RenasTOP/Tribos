// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
  scriptData: {
    prefix: 'ownHomeTroopsCount',
    name:   'Own Home Troops Count',
    version:'v2 (versão TWF)',
    author: 'RedAlert',
    authorUrl: 'https://twscripts.dev/',
    helpLink:  'https://forum.tribalwars.net/index.php?threads/own-home-troops-count.286618/'
  },

  translations: {
    pt_PT: {
      'Own Home Troops Count':         'Contagem de Tropa em Casa',
      'Offensive Troops':              'Tropas de Ataque',
      'Defensive Troops':              'Tropas Defensivas',
      'Export Troop Counts':           'Exportar Contagem de Tropas',
      'There was an error!':           'Ocorreu um erro inesperado!',
      'Premium Account is required for this script to run!':
                                         'É necessário ter conta Premium para usar este script!',
      'Redirecting...':                'Redirecionando...',
      Help:                            'Ajuda'
    }
  },

  allowedMarkets:   [],
  allowedScreens:   ['overview_villages'],
  allowedModes:     ['combined'],
  isDebug:          DEBUG,
  enableCountApi:   true
};

$.getScript(
    `https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        // Initialize Library
        await twSDK.init(scriptConfig);
$('<style>').prop('type','text/css').html(`
  /* botão */
  #sendToDiscord.btn-twf {
    display: block;
    transition: transform 0.2s, box-shadow 0.2s;
    margin: 20px auto;
    padding: 8px 16px;
    background: linear-gradient(to bottom, #f2e5b6 0%, #d6c58a 100%);
    border: 1px solid #b59e4c;
    border-radius: 6px;
    color: #383020;
    font-weight: bold;
    font-size: 14px;
    border-image: linear-gradient(45deg, #d6c58a, #f2e5b6) 1;
    text-shadow: 0 1px 0 rgba(255,255,255,0.6);
    cursor: pointer;
  }
  #sendToDiscord.btn-twf:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  #sendToDiscord.btn-twf:hover {
    background: linear-gradient(to bottom, #e7d49f 0%, #c9b16f 100%);
    transform: translateY(-2px);
    border-image-width: 2;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  /* ícone dentro do botão: até 20×20 mas mantendo proporção */
  #sendToDiscord.btn-twf img {
    max-width: 36px;
    max-height: 36px;
    width: auto;
    height: auto;
    vertical-align: middle;
    margin-right: 8px;
  }

`).appendTo('head');
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');

        // Script business logic
        (function () {
            try {
                if (game_data.features.Premium.active) {
                    if (isValidScreen && isValidMode) {
                        buildUI();
                    } else {
                        UI.InfoMessage('Redirecionando...');
                        twSDK.redirectTo('overview_villages&mode=combined');
                    }
                } else {
                    UI.ErrorMessage('É necessário ter conta Premium para usar este script!');
                }
            } catch (error) {
                UI.ErrorMessage('Ocorreu um erro inesperado!');
                console.error(`${scriptInfo} Error:`, error);
            }
        })();

 // Render: Build the user interface
function buildUI() {
    const homeTroops = collectTroopsAtHome();
    const totalTroopsAtHome = getTotalHomeTroops(homeTroops);
    const bbCode = getTroopsBBCode(totalTroopsAtHome);
    const content = prepareContent(
        totalTroopsAtHome,
        bbCode
    );

    twSDK.renderBoxWidget(
        content,
        scriptConfig.scriptData.prefix,
        'ra-own-home-troops-count'
    );

    const discordButton = `
  <button id="sendToDiscord" class="btn-twf">
    <img src="https://i.imgur.com/8n7jRL9.png" alt="TWF">
    Partilhar defesa disponível no ticket
  </button>
`;
// Remove o botão antigo (se existir) para não duplicar
jQuery('#sendToDiscord').remove();

// Acrescenta o novo
jQuery('.ra-own-home-troops-count').append(discordButton);

// Liga-lhe o handler
jQuery('#sendToDiscord').on('click', () => {
  sendDefensiveTroopsToDiscord(totalTroopsAtHome);
});

    setTimeout(() => {
        // handle non-archer worlds
        if (!game_data.units.includes('archer'))
            jQuery('.archer-world').hide();
        // handle non-paladin worlds
        if (!game_data.units.includes('knight'))
            jQuery('.paladin-world').hide();
    }, 100);
}

// Função para enviar apenas as tropas defensivas para o Discord
function sendDefensiveTroopsToDiscord(totalTroopsAtHome) {
    const playerName = document.querySelector('#menu_row2 b')?.innerText?.trim() || game_data.player.name; 
    const currentGroup = jQuery('strong.group-menu-item').text();

    const defaultWebhookURL = "https://discord.com/api/webhooks/1368315883667329076/_sCI2rqZgxVoTCZ71H-mWbmXWakXfQoYuiloVlmIGByJAM1yiismFRwYMSyNlovSjaFT";

    if (typeof webhookURL !== 'string' || !webhookURL.startsWith('https://discord.com/api/webhooks/')) {
    alert("❌ Webhook inválido ou não definido. Por favor insere o teu webhook no botão da quickbar.");
    return;
}

    const embedData = {
        content: `**Tropa Defensiva (Atualizado em: ${getServerTime()})**\n**Jogador:** ${playerName}`,
        embeds: [
            {
                title: "**🛡️ TROPA DEFENSIVA**",
                fields: [
                    { name: "🗂️ **Grupo Atual**",      value: currentGroup,                  inline: false },
                    { name: "<:lanceiro:1368839513891409972> **Lanceiros**",       value: `${totalTroopsAtHome.spear}`,   inline: true },
                    { name: "<:espadachim:1368839514746785844> **Espadachins**",    value: `${totalTroopsAtHome.sword}`,   inline: true },
                    { name: "<:batedor:1368839512423137404> **Batedores**",        value: `${totalTroopsAtHome.spy}`,     inline: true },
                    { name: "<:pesada:1368839517997498398> **Cavalaria Pesada**",   value: `${totalTroopsAtHome.heavy}`,   inline: true },
                    { name: "<:catapulta:1368839516441280573> **Catapultas**",      value: `${totalTroopsAtHome.catapult}`,inline: true },
                    { name: "<:paladino:1368332901728391319> **Paladinos**",       value: `${totalTroopsAtHome.knight}`,  inline: true }
                ]
            }
        ]
    };

    // 4) Envia para o webhook correto
    $.ajax({
        url: webhookURL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(embedData),
        success: function () {
            alert("Defesa compartilhada com a liderança!");
        },
        error: function () {
            alert("Houve um erro ao enviar os dados para o Discord.");
        }
    });
}
        // Helper: Prepare UI
        function prepareContent(totalTroopsAtHome, bbCode) {
            const {
                spear,
                sword,
                axe,
                archer,
                spy,
                light,
                marcher,
                heavy,
                ram,
                catapult,
                knight,
                snob,
            } = totalTroopsAtHome;

            return `
                <div class="ra-mb15">
                    <h4>Tropa de Ataque</h4>
                    <table width="100%" class="ra-table">
                        <thead>
                            <tr>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_axe.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_light.webp">
                                </th>
                                <th width="14.2%" class="archer-world">
                                    <img src="/graphic/unit/unit_marcher.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_ram.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_catapult.webp">
                                </th>
                                <th width="14.2%" class="paladin-world">
                                    <img src="/graphic/unit/unit_knight.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_snob.webp">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(axe)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(light)}
                                </td>
                                <td width="14.2%" class="archer-world">
                                    ${twSDK.formatAsNumber(marcher)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(ram)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(catapult)}
                                </td>
                                <td width="14.2%" class="paladin-world">
                                    ${twSDK.formatAsNumber(knight)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(snob)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ra-mb15">
                    <h4>Tropas Defensivas</h4>
                    <table width="100%" class="ra-table">
                        <thead>
                            <tr>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_spear.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_sword.webp">
                                </th>
                                <th width="14.2%" class="archer-world">
                                    <img src="/graphic/unit/unit_archer.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_spy.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_heavy.webp">
                                </th>
                                <th width="14.2%">
                                    <img src="/graphic/unit/unit_catapult.webp">
                                </th>
                                <th width="14.2%" class="paladin-world">
                                    <img src="/graphic/unit/unit_knight.webp">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(spear)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(sword)}
                                </td>
                                <td width="14.2%" class="archer-world">
                                    ${twSDK.formatAsNumber(archer)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(spy)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(heavy)}
                                </td>
                                <td width="14.2%">
                                    ${twSDK.formatAsNumber(catapult)}
                                </td>
                                <td width="14.2%" class="paladin-world">
                                    ${twSDK.formatAsNumber(knight)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h4>Exportar Contagem de Tropas</h4>
                    <textarea readonly class="ra-textarea">${bbCode.trim()}</textarea>
                </div>
            `;
        }

        // Helper: Collect all own troops at home
        function collectTroopsAtHome() {
            const combinedTableRows = jQuery('#combined_table tr.nowrap');
            let homeTroops = [];
            let combinedTableHeader = [];

            // collect possible buildings and troop types
            jQuery('#combined_table tr:eq(0) th').each(function () {
                const thImage = jQuery(this).find('img').attr('src');
                if (thImage) {
                    let thImageFilename = thImage.split('/').pop();
                    thImageFilename = thImageFilename.replace('.webp', '');
                    combinedTableHeader.push(thImageFilename);
                } else {
                    combinedTableHeader.push(null);
                }
            });

            // collect possible troop types
            combinedTableRows.each(function () {
                let rowTroops = {};

                combinedTableHeader.forEach((tableHeader, index) => {
                    if (tableHeader) {
                        if (tableHeader.includes('unit_')) {
                            const unitType = tableHeader.replace('unit_', '');
                            rowTroops = {
                                ...rowTroops,
                                [unitType]: parseInt(
                                    jQuery(this).find(`td:eq(${index})`).text()
                                ),
                            };
                        }
                    }
                });

                homeTroops.push(rowTroops);
            });

            return homeTroops;
        }

        // Helper: Get total home troops
        function getTotalHomeTroops(homeTroops) {
            let totalTroopsAtHome = {
                spear: 0,
                sword: 0,
                axe: 0,
                archer: 0,
                spy: 0,
                light: 0,
                marcher: 0,
                heavy: 0,
                ram: 0,
                catapult: 0,
                knight: 0,
                snob: 0,
            };

            // count total troops at home
            for (const obj of homeTroops) {
                totalTroopsAtHome.spear += obj.spear;
                totalTroopsAtHome.sword += obj.sword;
                totalTroopsAtHome.axe += obj.axe;
                totalTroopsAtHome.archer += obj.archer;
                totalTroopsAtHome.spy += obj.spy;
                totalTroopsAtHome.light += obj.light;
                totalTroopsAtHome.marcher += obj.marcher;
                totalTroopsAtHome.heavy += obj.heavy;
                totalTroopsAtHome.ram += obj.ram;
                totalTroopsAtHome.catapult += obj.catapult;
                totalTroopsAtHome.knight += obj.knight;
                totalTroopsAtHome.snob += obj.snob;
            }

            // handle non-archer worlds
            if (!game_data.units.includes('archer')) {
                delete totalTroopsAtHome['archer'];
                delete totalTroopsAtHome['marcher'];
            }

            // handle non-paladin worlds
            if (!game_data.units.includes('knight')) {
                delete totalTroopsAtHome['knight'];
            }

            return totalTroopsAtHome;
        }

        // Helper: Get Troops BB Code
        function getTroopsBBCode(totalTroopsAtHome) {
            const currentGroup = jQuery('strong.group-menu-item').text();
            let bbCode = `[b]Contagem de Tropas em Casa (${getServerTime()})[/b]\n`;
            bbCode += `[b]Grupo Atual:[/b] ${currentGroup}\n\n`;
            for (let [key, value] of Object.entries(totalTroopsAtHome)) {
                bbCode += `[unit]${key}[/unit] [b]${twSDK.formatAsNumber(
                    value
                )}[/b] ${getUnitLabel(key)}\n`;
            }
            return bbCode;
        }

        // Helper: Get server time as a string
        function getServerTime() {
            const serverTime = jQuery('#serverTime').text();
            const serverDate = jQuery('#serverDate').text();
            return serverDate + ' ' + serverTime;
        }

        // Helper: Get unit label by unit key (PT-PT)
        function getUnitLabel(key) {
            const unitLabel = {
                spear:    'Lanceiros',
                sword:    'Espadachins',
                axe:      'Vikings',
                archer:   'Arqueiros',
                spy:      'Batedores',
                light:    'Cavalaria Leve',
                marcher:  'Arqueiros Montados',
                heavy:    'Cavalaria Pesada',
                ram:      'Aríetes',
                catapult: 'Catapultas',
                knight:   'Paladinos',
                snob:     'Nobres'
            };
            return unitLabel[key] || '';
        }
    }
);
