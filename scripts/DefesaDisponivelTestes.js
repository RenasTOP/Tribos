// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'ownHomeTroopsCount',
        name: 'Own Home Troops Count',
        version: 'v2 (versão TWF)',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink: 'https://forum.tribalwars.net/index.php?threads/own-home-troops-count.286618/'
    },
    translations: {
        pt_PT: {
            'Own Home Troops Count': 'Contagem de Tropa em Casa',
            'Offensive Troops': 'Tropas de Ataque',
            'Defensive Troops': 'Tropas Defensivas',
            'Export Troop Counts': 'Exportar Contagem de Tropas',
            'There was an error!': 'Ocorreu um erro inesperado!',
            'Premium Account is required for this script to run!': 'É necessário ter conta Premium para usar este script!',
            'Redirecting...': 'Redirecionando...',
            Help: 'Ajuda'
        }
    },
    allowedMarkets: [],
    allowedScreens: ['overview_villages'],
    allowedModes: ['combined'],
    isDebug: DEBUG,
    enableCountApi: true
};

// Load twSDK
$.getScript(`https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`, async function () {
    // Initialize Library
    await twSDK.init(scriptConfig);
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
                    UI.InfoMessage(twSDK.tt('Redirecting...'));
                    twSDK.redirectTo('overview_villages&mode=combined');
                }
            } else {
                UI.ErrorMessage(twSDK.tt('Premium Account is required for this script to run!'));
            }
        } catch (error) {
            UI.ErrorMessage(twSDK.tt('There was an error!'));
            console.error(`${scriptInfo} Error:`, error);
        }
    })();

    // Render: Build the user interface
    function buildUI() {
        const homeTroops = collectTroopsAtHome();
        const totalTroopsAtHome = getTotalHomeTroops(homeTroops);
        const bbCode = getTroopsBBCode(totalTroopsAtHome);
        const content = prepareContent(totalTroopsAtHome, bbCode);

        // Render the widget with collected data
        twSDK.renderBoxWidget(content, scriptConfig.scriptData.prefix, 'ra-own-home-troops-count');

        // Add Discord button
        const discordButton = `
            <button id="sendToDiscord" class="btn-twf">
                <img src="https://i.imgur.com/8n7jRL9.png" alt="TWF">
                Partilhar defesa disponível no ticket
            </button>
        `;
        // Remove any existing button
        jQuery('#sendToDiscord').remove();

        // Add new button
        jQuery('.ra-own-home-troops-count').append(discordButton);

        // Button click handler
        jQuery('#sendToDiscord').on('click', () => {
            sendDefensiveTroopsToDiscord(totalTroopsAtHome);
        });

        // Delay to handle non-archer and non-paladin worlds
        setTimeout(() => {
            if (!game_data.units.includes('archer')) {
                jQuery('.archer-world').hide();
            }
            if (!game_data.units.includes('knight')) {
                jQuery('.paladin-world').hide();
            }
        }, 100);
    }

    // Function to send defensive troops to Discord
    function sendDefensiveTroopsToDiscord(totalTroopsAtHome) {
        const playerName = game_data.player.name;
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
                        { name: "🗂️ **Grupo Atual**", value: currentGroup, inline: false },
                        { name: "<:lanceiro:1368839513891409972> **Lanceiros**", value: `${totalTroopsAtHome.spear}`, inline: true },
                        { name: "<:espadachim:1368839514746785844> **Espadachins**", value: `${totalTroopsAtHome.sword}`, inline: true },
                        { name: "<:batedor:1368839512423137404> **Batedores**", value: `${totalTroopsAtHome.spy}`, inline: true },
                        { name: "<:pesada:1368839517997498398> **Cavalaria Pesada**", value: `${totalTroopsAtHome.heavy}`, inline: true },
                        { name: "<:catapulta:1368839516441280573> **Catapultas**", value: `${totalTroopsAtHome.catapult}`, inline: true },
                        { name: "<:paladino:1368332901728391319> **Paladinos**", value: `${totalTroopsAtHome.knight}`, inline: true }
                    ]
                }
            ]
        };

        // Send the data to the Discord webhook
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
            spear, sword, axe, archer, spy, light, marcher, heavy, ram, catapult, knight, snob
        } = totalTroopsAtHome;

        return `
            <div class="ra-mb15">
                <h4>${twSDK.tt('Offensive Troops')}</h4>
                <table width="100%" class="ra-table">
                    <thead>
                        <tr>
                            <th width="14.2%"><img src="/graphic/unit/unit_axe.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_light.webp"></th>
                            <th width="14.2%" class="archer-world"><img src="/graphic/unit/unit_marcher.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_ram.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_catapult.webp"></th>
                            <th width="14.2%" class="paladin-world"><img src="/graphic/unit/unit_knight.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_snob.webp"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${twSDK.formatAsNumber(axe)}</td>
                            <td>${twSDK.formatAsNumber(light)}</td>
                            <td class="archer-world">${twSDK.formatAsNumber(marcher)}</td>
                            <td>${twSDK.formatAsNumber(ram)}</td>
                            <td>${twSDK.formatAsNumber(catapult)}</td>
                            <td class="paladin-world">${twSDK.formatAsNumber(knight)}</td>
                            <td>${twSDK.formatAsNumber(snob)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="ra-mb15">
                <h4>${twSDK.tt('Defensive Troops')}</h4>
                <table width="100%" class="ra-table">
                    <thead>
                        <tr>
                            <th width="14.2%"><img src="/graphic/unit/unit_spear.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_sword.webp"></th>
                            <th width="14.2%" class="archer-world"><img src="/graphic/unit/unit_archer.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_spy.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_heavy.webp"></th>
                            <th width="14.2%"><img src="/graphic/unit/unit_catapult.webp"></th>
                            <th width="14.2%" class="paladin-world"><img src="/graphic/unit/unit_knight.webp"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${twSDK.formatAsNumber(spear)}</td>
                            <td>${twSDK.formatAsNumber(sword)}</td>
                            <td class="archer-world">${twSDK.formatAsNumber(archer)}</td>
                            <td>${twSDK.formatAsNumber(spy)}</td>
                            <td>${twSDK.formatAsNumber(heavy)}</td>
                            <td>${twSDK.formatAsNumber(catapult)}</td>
                            <td class="paladin-world">${twSDK.formatAsNumber(knight)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h4>${twSDK.tt('Export Troop Counts')}</h4>
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
        homeTroops.forEach(obj => {
            totalTroopsAtHome.spear += obj.spear || 0;
            totalTroopsAtHome.sword += obj.sword || 0;
            totalTroopsAtHome.axe += obj.axe || 0;
            totalTroopsAtHome.archer += obj.archer || 0;
            totalTroopsAtHome.spy += obj.spy || 0;
            totalTroopsAtHome.light += obj.light || 0;
            totalTroopsAtHome.heavy += obj.heavy || 0;
            totalTroopsAtHome.ram += obj.ram || 0;
            totalTroopsAtHome.catapult += obj.catapult || 0;
            totalTroopsAtHome.knight += obj.knight || 0;
            totalTroopsAtHome.snob += obj.snob || 0;
        });

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
            bbCode += `[unit]${key}[/unit] [b]${twSDK.formatAsNumber(value)}[/b] ${getUnitLabel(key)}\n`;
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
            spear: 'Lanceiros',
            sword: 'Espadachins',
            axe: 'Vikings',
            archer: 'Arqueiros',
            spy: 'Batedores',
            light: 'Cavalaria Leve',
            marcher: 'Arqueiros Montados',
            heavy: 'Cavalaria Pesada',
            ram: 'Aríetes',
            catapult: 'Catapultas',
            knight: 'Paladinos',
            snob: 'Nobres'
        };
        return unitLabel[key] || '';
    }
});
