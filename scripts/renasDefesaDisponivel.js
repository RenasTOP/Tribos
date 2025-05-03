(function () {
    // Verifique se a variável discordWebhookUrl já foi declarada
    if (typeof discordWebhookUrl === 'undefined') {
        const discordWebhookUrl = 'https://discord.com/api/webhooks/1368315883667329076/_sCI2rqZgxVoTCZ71H-mWbmXWakXfQoYuiloVlmIGByJAM1yiismFRwYMSyNlovSjaFT'; // Substitua pelo seu webhook do Discord
    }

    // Função para enviar os dados das tropas para o Discord
    function sendTroopsToDiscord(defTroops) {
        const message = {
            content: "Tropas Defensivas no seu vilarejo:",
            embeds: [
                {
                    title: "Detalhes das Tropas Defensivas",
                    fields: [
                        { name: "Lanceiros", value: defTroops.spear || "0", inline: true },
                        { name: "Espadachins", value: defTroops.sword || "0", inline: true },
                        { name: "Batedores", value: defTroops.spy || "0", inline: true },
                        { name: "Cavalaria Pesada", value: defTroops.heavy || "0", inline: true },
                        { name: "Catapultas", value: defTroops.catapult || "0", inline: true },
                        { name: "Paladinos", value: defTroops.paladin || "0", inline: true }
                    ],
                    color: 3066993
                }
            ]
        };

        $.ajax({
            url: discordWebhookUrl,
            method: 'POST',
            data: JSON.stringify(message),
            contentType: 'application/json',
            success: function() {
                UI.SuccessMessage("Tropas enviadas para o Discord com sucesso!");
            },
            error: function() {
                UI.ErrorMessage("Erro ao enviar tropas para o Discord.");
            }
        });
    }

    // Modificar a interface para incluir o botão de envio para o Discord
    function buildUI() {
        const unitAmounts =
            JSON.parse(
                localStorage.getItem(
                    `${scriptConfig.scriptData.prefix}_data`
                )
            ) || DEFAULT_NUKE;
        const { defVillages, nukes } = calculateCurrentStack();

        let tableRows = ``;
        Object.keys(DEFAULT_NUKE).forEach((unit) => {
            tableRows += `
                <tr>
                    <td class="ra-tac" width="40%">
                        <img src="/graphic/unit/unit_${unit}.png">
                    </td>
                    <td class="ra-tac" width="60%">
                        <input type="text" pattern="\d*" class="ra-input unit_${unit}" data-unit="${unit}" value="${
                unitAmounts[unit] || 0
            }" />
                    </td>
                </tr>
            `;
        });

        const content = `
            <div class="ra-mb15">
                <table class="ra-table ra-table-v3 ra-unit-amounts" width="100%">
                    <tbody>
                        <tr>
                            <td width="70%">
                                <b>${twSDK.tt('Defense Villages')}</b>
                            </td>
                            <td class="ra-tac">${defVillages}</td>
                        </tr>
                        <tr>
                            <td width="70%">
                                <b>${twSDK.tt('Nukes needed to clear')}</b>
                            </td>
                            <td class="ra-tac">${nukes}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="ra-mb15">
                <table class="ra-table ra-table-v3 ra-unit-amounts" width="100%">
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            <div class="ra-mb15">
                <label for="raCheckFetchIncomings" class="ra-label">
                    <input type="checkbox" checked id="raCheckFetchIncomings"> ${twSDK.tt(
            'Take into account incoming support'
        )}
                </label>
            </div>
            <div class="ra-mb15">
                <label for="raNightBonus" class="ra-label">
                    <input type="checkbox" id="raNightBonus"> ${twSDK.tt(
            'Enable night bonus'
        )}
                </label>
            </div>
            <div class="ra-mb15">
                <a href="javascript:void(0);" id="raCalculateHealthCheckBtn" class="btn">
                    ${twSDK.tt('Check Stack Health')}
                </a>
                <a href="javascript:void(0);" id="raResetConfigBtn" class="btn">
                    ${twSDK.tt('Reset')}
                </a>
            </div>
            <div class="ra-mb15" id="raHealthCheckResult" style="display:none;"></div>
            <div class="ra-mb15">
                <a href="javascript:void(0);" id="raSendToDiscordBtn" class="btn">
                    ${twSDK.tt('Send Defenses to Discord')}
                </a>
            </div>
        `;

        const customStyle = `
            .ra-input { padding: 5px; width: 80%; text-align: center; font-size: 14px; }
            .ra-mt5 { margin-top: 5px; display: inline-block; }
            .ra-alert-box { border-width: 2px; border-radius: 4px; background: #fff3d3; padding: 5px; }
            .ra-danger { border-color: #ff0000; }
            .ra-success { border-color: #219b24; }
        `;

        twSDK.renderFixedWidget(
            content,
            'raDefenseHealthCheck',
            'ra-defense-health-check',
            customStyle
        );

        // Ação do botão "Send Defenses to Discord"
        jQuery('#raSendToDiscordBtn').on('click', function (e) {
            e.preventDefault();

            // Coletar as tropas defensivas
            const defTroops = countTotalTroops({});
            sendTroopsToDiscord(defTroops);
        });

        setTimeout(() => {
            const nonEmptyValues = Object.values(unitAmounts).filter(
                (item) => item !== 0
            );
            if (nonEmptyValues.length) {
                jQuery('#raCalculateHealthCheckBtn').trigger('click');
            }
        }, 1);
    }

})();
