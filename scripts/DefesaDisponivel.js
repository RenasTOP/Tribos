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

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'ownHomeTroopsCount',
        name: 'Own Home Troops Count',
        version: 'v1.3.1',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/own-home-troops-count.286618/',
    },
    translations: {
        en_DK: {
            'Own Home Troops Count': 'Own Home Troops Count',
            Help: 'Help',
            'Redirecting...': 'Redirecting...',
            'There was an error!': 'There was an error!',
            'Premium Account is required for this script to run!':
                'Premium Account is required for this script to run!',
            'Offensive Troops': 'Offensive Troops',
            'Defensive Troops': 'Defensive Troops',
            'Export Troop Counts': 'Export Troop Counts',
            'Spear fighters': 'Spear fighters',
            Swordsmen: 'Swordsmen',
            Axemen: 'Axemen',
            Archers: 'Archers',
            Scouts: 'Scouts',
            'Light cavalry': 'Light cavalry',
            'Mounted archers': 'Mounted archers',
            'Heavy cavalry': ' Heavy cavalry',
            Rams: 'Rams',
            Catapults: 'Catapults',
            Paladin: 'Paladin',
            Noblemen: 'Noblemen',
            'Current Group:': 'Current Group:',
            'Save Settings': 'Save Settings',
            Settings: 'Settings',
            'Spears amount': 'Spears amount',
            'Swords amount': 'Swords amount',
            'Archers amount': 'Archers amount',
            'Heavy cavalry amount': 'Heavy cavalry amount',
            'Settings saved!': 'Settings saved!',
            Packets: 'Packets',
        },
        it_IT: {
            'Own Home Troops Count': 'Contatruppe in casa',
            Help: 'Aiuto',
            'Redirecting...': 'Redirecting...',
            'There was an error!': 'There was an error!',
            'Premium Account is required for this script to run!':
                'Ã‰ necessario un account premium per utilizzare questo script!',
            'Offensive Troops': 'Truppe Offensive',
            'Defensive Troops': 'Truppe Difensive',
            'Export Troop Counts': 'Esporta conteggio truppe',
            'Spear fighters': 'Lancieri',
            Swordsmen: 'Spadaccini',
            Axemen: 'Guerrieri con ascia',
            Archers: 'Arcieri',
            Scouts: 'Esploratori',
            'Light cavalry': 'Cavalleria leggera',
            'Mounted archers': 'Arcieri a cavallo',
            'Heavy cavalry': 'Cavalleria pesante',
            Rams: 'Arieti',
            Catapults: 'Catapulte',
            Paladin: 'Paladini',
            Noblemen: 'Nobili',
            'Current Group:': 'Gruppo Corrente:',
            'Save Settings': 'Salva le impostazioni',
            Settings: 'Impostazioni',
            'Spears amount': 'QuantitÃ  Lancieri',
            'Swords amount': 'QuantitÃ  Spadaccini',
            'Archers amount': 'QuantitÃ  Arcieri',
            'Heavy cavalry amount': 'QuantitÃ  Cavalleria pesante',
            'Settings saved!': 'Impostazioni salvate!',
            Packets: 'Packets',
        },
        fr_FR: {
            'Own Home Troops Count': 'Comptage des troupes dans le village',
            Help: 'Aide',
            'Redirecting...': 'Redirecting...',
            'There was an error!': 'There was an error!',
            'Premium Account is required for this script to run!':
                "Un compte Premium est requis pour que ce script s'exÃ©cute!",
            'Offensive Troops': 'Troupes offensives',
            'Defensive Troops': 'Troupes dÃ©fensives',
            'Export Troop Counts': 'Export Troop Counts',
            'Spear fighters': 'Lanciers',
            Swordsmen: 'P.E',
            Axemen: 'Hache',
            Archers: 'Archer',
            Scouts: 'Scouts',
            'Light cavalry': 'Cavalerie lÃ©gÃ¨re',
            'Mounted archers': 'Archer montÃ©',
            'Heavy cavalry': ' Cavalerie lourde',
            Rams: 'BÃ©lier',
            Catapults: 'Catapulte',
            Paladin: 'Paladin',
            Noblemen: 'Noble',
            'Current Group:': 'Groupe actuel:',
            'Save Settings': 'Enregistrer les paramÃ¨tres',
            Settings: 'ParamÃ¨tres',
            'Spears amount': 'Montant lanciers',
            'Swords amount': 'Montant P.E',
            'Archers amount': 'Montant Archer',
            'Heavy cavalry amount': 'Montant cavalerie lourde',
            'Settings saved!': 'ParamÃ¨tres sauvegardÃ©s!',
            Packets: 'Paquets',
        },
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
        // Initialize Library
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');

        // Data Store Config
        var DEFAULT_STATE = {
            spear: 500,
            sword: 500,
            archer: 500,
            heavy: 250,
        };

        // Script business logic
        (function () {
            try {
                if (game_data.features.Premium.active) {
                    if (isValidScreen && isValidMode) {
                        buildUI(DEFAULT_STATE);
                    } else {
                        UI.InfoMessage(twSDK.tt('Redirecting...'));
                        twSDK.redirectTo('overview_villages&mode=combined');
                    }
                } else {
                    UI.ErrorMessage(
                        twSDK.tt(
                            'Premium Account is required for this script to run!'
                        )
                    );
                }
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo} Error:`, error);
            }
        })();

 // Render: Build the user interface
function buildUI(state) {
    const homeTroops = collectTroopsAtHome();
    const totalTroopsAtHome = getTotalHomeTroops(homeTroops);
    const packetAmounts = calculatePacketAmounts(
        totalTroopsAtHome,
        state
    );
    const packetsInfo = buildPacketsInfo(packetAmounts);
    const bbCode = getTroopsBBCode(totalTroopsAtHome);
    const content = prepareContent(
        totalTroopsAtHome,
        bbCode,
        packetsInfo
    );

    twSDK.renderBoxWidget(
        content,
        scriptConfig.scriptData.prefix,
        'ra-own-home-troops-count'
    );

    // Adiciona o botão "Send to Discord"
    const discordButton = `<button id="sendToDiscord" class="button">Send to Discord</button>`;
    jQuery('.ra-own-home-troops-count').append(discordButton);

    // Adiciona evento de clique ao botão
    jQuery('#sendToDiscord').click(function () {
        sendToDiscord(totalTroopsAtHome); // Envia os dados para o Discord
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
// Função para enviar para o Discord
function sendToDiscord(totalTroopsAtHome) {
    const playerName = game_data.player.name;  // Captura o nome do jogador
    const webhookURL = "https://discord.com/api/webhooks/1368315883667329076/_sCI2rqZgxVoTCZ71H-mWbmXWakXfQoYuiloVlmIGByJAM1yiismFRwYMSyNlovSjaFT"; // Substitua com o seu URL de webhook do Discord
    const troopsData = {
        content: `
**Own Home Troops Count (Atualizado em: ${getServerTime()})**

**👤 Player:** ${playerName}

**⚔️ Offensive Troops:**
- <:viking:1368839522225487932> **Vikings**: ${totalTroopsAtHome.axe}
- <:leve:1368839509977993256> **Cavalaria Leve**: ${totalTroopsAtHome.light}
- <:ariete:1368839511261577216> **Aríetes**: ${totalTroopsAtHome.ram}
- <:catapulta:1368839516441280573> **Catapultas**: ${totalTroopsAtHome.catapult}

**🛡️ Defensive Troops:**
- <:lanceiro:1368839513891409972> **Lanceiros**: ${totalTroopsAtHome.spear}
- <:espadachim:1368839514746785844> **Espadachins**: ${totalTroopsAtHome.sword}
- <:batedor:1368839512423137404> **Batedores**: ${totalTroopsAtHome.spy}
- <:pesada:1368839517997498398> **Cavalaria Pesada**: ${totalTroopsAtHome.heavy}
- <:catapulta:1368839516441280573> **Catapultas**: ${totalTroopsAtHome.catapult}
- <:paladino:1368332901728391319> **Paladinos**: ${totalTroopsAtHome.knight}
        `
    };

    // Envia os dados para o Discord
    $.ajax({
        url: webhookURL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(troopsData),
        success: function () {
            alert("Troops information sent to Discord!");
        },
        error: function () {
            alert("There was an error sending the data to Discord.");
        }
    });
}
        // Helper: Prepare UI
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
                    <h4>${twSDK.tt('Offensive Troops')}</h4>
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
                    <h4>${twSDK.tt('Defensive Troops')}</h4>
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
                <div class="ra-mb15">
                    <h4>${twSDK.tt('Packets')}</h4>
                    ${packetsInfo}
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
            let bbCode = `[b]${twSDK.tt(
                'Own Home Troops Count'
            )} (${getServerTime()})[/b]\n`;
            bbCode += `[b]${twSDK.tt(
                'Current Group:'
            )}[/b] ${currentGroup}\n\n`;
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

        // Helper: Get unit label by unit key
        function getUnitLabel(key) {
            const unitLabel = {
                spear: twSDK.tt('Spear fighters'),
                sword: twSDK.tt('Swordsmen'),
                axe: twSDK.tt('Axemen'),
                archer: twSDK.tt('Archers'),
                spy: twSDK.tt('Scouts'),
                light: twSDK.tt('Light cavalry'),
                marcher: twSDK.tt('Mounted archers'),
                heavy: twSDK.tt('Heavy cavalry'),
                ram: twSDK.tt('Rams'),
                catapult: twSDK.tt('Catapults'),
                knight: twSDK.tt('Paladin'),
                snob: twSDK.tt('Noblemen'),
            };

            if (unitLabel[key] !== undefined) {
                return unitLabel[key];
            } else {
                return '';
            }
        }

        // Helper: Calculate Packet Amounts
        function calculatePacketAmounts(troops, packetSizes) {
            const { spear, sword, archer, heavy } = troops;
            return {
                spearPacket: parseInt(spear / packetSizes.spear),
                swordPacket: parseInt(sword / packetSizes.sword),
                archerPacket: parseInt(archer / packetSizes.archer),
                heavyPacket: parseInt(heavy / packetSizes.heavy),
            };
        }

        // Helper: Build Packets info
        function buildPacketsInfo(packetAmounts) {
            const { spearPacket, swordPacket, archerPacket, heavyPacket } =
                packetAmounts;

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
                            <td>${twSDK.formatAsNumber(spearPacket)}</td>
                            <td>${twSDK.formatAsNumber(swordPacket)}</td>
                            <td class="archer-world">${twSDK.formatAsNumber(
                                archerPacket
                            )}</td>
                            <td>${twSDK.formatAsNumber(heavyPacket)}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
    }
);
