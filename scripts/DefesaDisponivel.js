/*
 * Script Name: Own Home Troops Count
 * Version: v1.3.1
 * Last Updated: 2025-04-23
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: t14504684
 * Approved Date: 2021-01-28
 * Mod: JawJaw
 */

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'ownHomeTroopsCount',
        name: 'Contagem de Tropas em Casa',
        version: 'v1.3.1',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/own-home-troops-count.286618/',
    },
    allowedMarkets: [],
    allowedScreens: ['overview_villages'],
    allowedModes: ['combined'],
    isDebug: DEBUG,
    enableCountApi: true,
};

$.getScript(
    `https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        // Inicializa a Biblioteca
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');

        // Configuração dos Dados
        var DEFAULT_STATE = {
            spear: 500,
            sword: 500,
            archer: 500,
            heavy: 250,
        };

        // Lógica do Script
        (function () {
            try {
                if (game_data.features.Premium.active) {
                    if (isValidScreen && isValidMode) {
                        buildUI(DEFAULT_STATE);
                    } else {
                        UI.InfoMessage("Redirecionando...");
                        twSDK.redirectTo('overview_villages&mode=combined');
                    }
                } else {
                    UI.ErrorMessage("Conta Premium é necessária para que este script funcione!");
                }
            } catch (error) {
                UI.ErrorMessage("Houve um erro!");
                console.error(`${scriptInfo} Error:`, error);
            }
        })();

        // Renderizar: Criar a interface do usuário
        function buildUI(state) {
            const homeTroops = collectTroopsAtHome();
            const totalTroopsAtHome = getTotalHomeTroops(homeTroops);
            const packetAmounts = calculatePacketAmounts(totalTroopsAtHome, state);
            const packetsInfo = buildPacketsInfo(packetAmounts);
            const bbCode = getTroopsBBCode(totalTroopsAtHome);
            const content = prepareContent(totalTroopsAtHome, bbCode, packetsInfo);

            twSDK.renderBoxWidget(content, scriptConfig.scriptData.prefix, 'ra-own-home-troops-count');

            const discordButton = `<button id="sendToDiscord" class="button" style="background-color: #3e2a47; color: white; padding: 12px 24px; border: 2px solid #b38b60; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; font-family: 'Arial', sans-serif; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);">Partilhar defesa com a liderança</button>`;
            jQuery('.ra-own-home-troops-count').append(discordButton);

            jQuery('#sendToDiscord').css({
                'display': 'block',
                'margin': '20px auto',
                'text-align': 'center',
                'border-radius': '8px',
                'transition': 'all 0.3s ease',
            });

            jQuery('#sendToDiscord').hover(function () {
                jQuery(this).css({
                    'background-color': '#4f324e',
                });
            }, function () {
                jQuery(this).css({
                    'background-color': '#3e2a47',
                });
            });

            jQuery('#sendToDiscord').click(function () {
                sendDefensiveTroopsToDiscord(totalTroopsAtHome); // Envia as tropas defensivas para o Discord
            });

            setTimeout(() => {
                if (!game_data.units.includes('archer')) jQuery('.archer-world').hide();
                if (!game_data.units.includes('knight')) jQuery('.paladin-world').hide();
            }, 100);
        }

        function sendDefensiveTroopsToDiscord(totalTroopsAtHome) {
            const playerName = game_data.player.name;
            const webhookURL = "https://discord.com/api/webhooks/1368315883667329076/_sCI2rqZgxVoTCZ71H-mWbmXWakXfQoYuiloVlmIGByJAM1yiismFRwYMSyNlovSjaFT";

            const embedData = {
                content: `**Tropa Defensiva (Atualizado em: ${getServerTime()})**\n**Jogador:** ${playerName}`,
                embeds: [
                    {
                        title: "**🛡️ TROPA DEFENSIVA**",
                        fields: [
                            { name: "Lanceiros", value: `${totalTroopsAtHome.spear}`, inline: true },
                            { name: "Espadachins", value: `${totalTroopsAtHome.sword}`, inline: true },
                            { name: "Batedores", value: `${totalTroopsAtHome.spy}`, inline: true },
                            { name: "Cavalaria Pesada", value: `${totalTroopsAtHome.heavy}`, inline: true },
                            { name: "Catapultas", value: `${totalTroopsAtHome.catapult}`, inline: true },
                            { name: "Paladinos", value: `${totalTroopsAtHome.knight}`, inline: true }
                        ]
                    }
                ]
            };

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

        function prepareContent(totalTroopsAtHome, bbCode, packetsInfo) {
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
                    <h4>Tropas Ofensivas</h4>
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
                                <td width="14.2%">${spear.toLocaleString()}</td>
                                <td width="14.2%">${sword.toLocaleString()}</td>
                                <td width="14.2%" class="archer-world">${archer.toLocaleString()}</td>
                                <td width="14.2%">${ram.toLocaleString()}</td>
                                <td width="14.2%">${catapult.toLocaleString()}</td>
                                <td width="14.2%" class="paladin-world">${knight.toLocaleString()}</td>
                                <td width="14.2%">${snob.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ra-mb15">
                    <h4>Tropas Defensivas</h4>
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
                                <td width="14.2%">${spear.toLocaleString()}</td>
                                <td width="14.2%">${sword.toLocaleString()}</td>
                                <td width="14.2%" class="archer-world">${archer.toLocaleString()}</td>
                                <td width="14.2%">${spy.toLocaleString()}</td>
                                <td width="14.2%">${heavy.toLocaleString()}</td>
                                <td width="14.2%">${catapult.toLocaleString()}</td>
                                <td width="14.2%" class="paladin-world">${knight.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ra-mb15">
                    <h4>Pacotes</h4>
                    ${packetsInfo}
                </div>
                <div>
                    <h4>Exportar Contagem de Tropas</h4>
                    <textarea readonly class="ra-textarea">${bbCode.trim()}</textarea>
                </div>
            `;
        }
    }
);
        // Helper: Coletar todas as tropas em casa
function collectTroopsAtHome() {
    const combinedTableRows = jQuery('#combined_table tr.nowrap');
    let homeTroops = [];
    let combinedTableHeader = [];

    // Coletar possíveis edifícios e tipos de tropas
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

    // Coletar tipos possíveis de tropas
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

// Helper: Obter as tropas totais em casa
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

    // Contar as tropas totais em casa
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

    // Gerenciar mundos sem arqueiros
    if (!game_data.units.includes('archer')) {
        delete totalTroopsAtHome['archer'];
        delete totalTroopsAtHome['marcher'];
    }

    // Gerenciar mundos sem paladinos
    if (!game_data.units.includes('knight')) {
        delete totalTroopsAtHome['knight'];
    }

    return totalTroopsAtHome;
}

// Helper: Obter o código BB das tropas
function getTroopsBBCode(totalTroopsAtHome) {
    const currentGroup = jQuery('strong.group-menu-item').text();
    let bbCode = `[b]Contagem de Tropas em Casa (${getServerTime()})[/b]\n`;
    bbCode += `[b]Grupo Atual:[/b] ${currentGroup}\n\n`;
    for (let [key, value] of Object.entries(totalTroopsAtHome)) {
        bbCode += `[unit]${key}[/unit] [b]${value.toLocaleString()}[/b] ${getUnitLabel(key)}\n`;
    }
    return bbCode;
}

// Helper: Obter a hora do servidor como uma string
function getServerTime() {
    const serverTime = jQuery('#serverTime').text();
    const serverDate = jQuery('#serverDate').text();
    return serverDate + ' ' + serverTime;
}

// Helper: Obter o rótulo da unidade pelo nome da chave
function getUnitLabel(key) {
    const unitLabel = {
        spear: 'Lanceiros',
        sword: 'Espadachins',
        axe: 'Guerrilheiros com Machado',
        archer: 'Arqueiros',
        spy: 'Batedores',
        light: 'Cavalaria Leve',
        marcher: 'Arqueiros Montados',
        heavy: 'Cavalaria Pesada',
        ram: 'Arietes',
        catapult: 'Catapultas',
        knight: 'Paladinos',
        snob: 'Nobres',
    };

    if (unitLabel[key] !== undefined) {
        return unitLabel[key];
    } else {
        return '';
    }
}

// Helper: Calcular a quantidade de pacotes
function calculatePacketAmounts(troops, packetSizes) {
    const { spear, sword, archer, heavy } = troops;
    return {
        spearPacket: parseInt(spear / packetSizes.spear),
        swordPacket: parseInt(sword / packetSizes.sword),
        archerPacket: parseInt(archer / packetSizes.archer),
        heavyPacket: parseInt(heavy / packetSizes.heavy),
    };
}

// Helper: Construir informações dos pacotes
function buildPacketsInfo(packetAmounts) {
    const { spearPacket, swordPacket, archerPacket, heavyPacket } = packetAmounts;

    return `
        <table class="ra-table" width="100%">
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
                        <img src="/graphic/unit/unit_heavy.webp">
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${spearPacket.toLocaleString()}</td>
                    <td>${swordPacket.toLocaleString()}</td>
                    <td class="archer-world">${archerPacket.toLocaleString()}</td>
                    <td>${heavyPacket.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    `;
}
