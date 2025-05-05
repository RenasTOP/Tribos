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
        name: 'Own Home Troops Count',
        version: 'v1.3.1',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink: 'https://forum.tribalwars.net/index.php?threads/own-home-troops-count.286618/',
    },
    allowedMarkets: [],
    allowedScreens: ['overview_villages'],
    allowedModes: ['combined'],
    isDebug: DEBUG,
    enableCountApi: true,
};

// Função para construir a interface
function buildUI(state) {
    const homeTroops = collectTroopsAtHome();
    const totalTroopsAtHome = getTotalHomeTroops(homeTroops);
    const packetAmounts = calculatePacketAmounts(totalTroopsAtHome, state);
    const packetsInfo = buildPacketsInfo(packetAmounts);
    const content = prepareContent(totalTroopsAtHome, packetsInfo);

    twSDK.renderBoxWidget(content, scriptConfig.scriptData.prefix, 'ra-own-home-troops-count');

    // Botão para partilhar defesa
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
        jQuery(this).css({'background-color': '#4f324e'});
    }, function () {
        jQuery(this).css({'background-color': '#3e2a47'});
    });

    // Envia as tropas defensivas para o Discord
    jQuery('#sendToDiscord').click(function () {
        sendDefensiveTroopsToDiscord(totalTroopsAtHome); // Envia as tropas defensivas
    });

    setTimeout(() => {
        if (!game_data.units.includes('archer')) jQuery('.archer-world').hide();
        if (!game_data.units.includes('knight')) jQuery('.paladin-world').hide();
    }, 100);
}

// Função para enviar apenas as tropas defensivas para o Discord
function sendDefensiveTroopsToDiscord(totalTroopsAtHome) {
    const playerName = game_data.player.name;  // Captura o nome do jogador
    const webhookURL = "https://discord.com/api/webhooks/1368315883667329076/_sCI2rqZgxVoTCZ71H-mWbmXWakXfQoYuiloVlmIGByJAM1yiismFRwYMSyNlovSjaFT"; // Substitua com o seu URL de webhook do Discord
    
    const embedData = {
        content: `**Tropa Defensiva (Atualizado em: ${getServerTime()})**\n**Jogador:** ${playerName}`,
        embeds: [
            {
                title: "**🛡️ TROPA DEFENSIVA**",
                fields: [
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
                        [unitType]: parseInt(jQuery(this).find(`td:eq(${index})`).text())
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
