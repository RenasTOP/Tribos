/*
 * Script Name: Troop Templates Manager
 * Version: v1.2.4
 * Last Updated: 2024-09-23
 * Author: RedAlert (Script)| Renas (Templates)
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord) | renas (Discord)
 * Approved: t14103184
 * Approved Date: 2020-07-17
 * Mod: JawJaw
 */

// Globals
var TROOP_TEMPLATES = {
    '1000 lanças': {
        spear: 1000,
        sword: 0,
        axe: 0,
        archer: 0,
        spy: 0,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 0,
        catapult: 0,
        archerOnly: false,
        buildType: 'defense',
    },
    'Ataque c/ Arcos': {
        spear: 0,
        sword: 1,
        axe: 5697,
        archer: 0,
        spy: 100,
        light: 2615,
        marcher: 300,
        heavy: 1,
        ram: 400,
        catapult: 100,
        archerOnly: true,
        buildType: 'offense',
    },
    'Ataque Normal': {
        spear: 0,
        sword: 1,
        axe: 5771,
        archer: 0,
        spy: 100,
        light: 3109,
        marcher: 0,
        heavy: 1,
        ram: 450,
        catapult: 0,
        archerOnly: false,
        buildType: 'offense',
    },
    'Ataque Normal c/ Catas': {
        spear: 0,
        sword: 1,
        axe: 5597,
        archer: 0,
        spy: 100,
        light: 3015,
        marcher: 0,
        heavy: 1,
        ram: 400,
        catapult: 100,
        archerOnly: false,
        buildType: 'offense',
    },
    'Ataque +10% POP': {
        spear: 0,
        sword: 1,
        axe: 6357,
        archer: 0,
        spy: 100,
        light: 3425,
        marcher: 0,
        heavy: 0,
        ram: 400,
        catapult: 100,
        archerOnly: false,
        buildType: 'offense',
    },
    'Ataque +20% POP': {
        spear: 0,
        sword: 1,
        axe: 6941,
        archer: 0,
        spy: 100,
        light: 3754,
        marcher: 0,
        heavy: 1,
        ram: 500,
        catapult: 100,
        archerOnly: false,
        buildType: 'offense',
    },
    'Ataque Bonus Estábulo': {
        spear: 0,
        sword: 1,
        axe: 4637,
        archer: 0,
        spy: 100,
        light: 3255,
        marcher: 0,
        heavy: 1,
        ram: 400,
        catapult: 100,
        archerOnly: false,
        buildType: 'offense',
    },
    'Ataque Bonus Oficina': {
        spear: 0,
        sword: 1,
        axe: 4790,
        archer: 0,
        spy: 100,
        light: 2573,
        marcher: 0,
        heavy: 1,
        ram: 1075,
        catapult: 0,
        archerOnly: false,
        buildType: 'offense',
    },
    'Defesa Front (Archers)': {
        spear: 3018,
        sword: 3018,
        axe: 0,
        archer: 3018,
        spy: 1100,
        light: 0,
        marcher: 0,
        heavy: 1500,
        ram: 0,
        catapult: 50,
        archerOnly: true,
        buildType: 'defense',
    },
    'Defesa Back (Archers)': {
        spear: 5300,
        sword: 5300,
        axe: 0,
        archer: 5300,
        spy: 250,
        light: 0,
        marcher: 0,
        heavy: 700,
        ram: 0,
        catapult: 8,
        archerOnly: true,
        buildType: 'defense',
    },
    'Defesa Back +10% (Archers)': {
        spear: 6100,
        sword: 6100,
        axe: 0,
        archer: 6100,
        spy: 250,
        light: 0,
        marcher: 0,
        heavy: 700,
        ram: 0,
        catapult: 8,
        archerOnly: true,
        buildType: 'defense',
    },
    'Defesa Front': {
        spear: 4532,
        sword: 4532,
        axe: 0,
        archer: 0,
        spy: 1100,
        light: 0,
        marcher: 0,
        heavy: 1500,
        ram: 0,
        catapult: 50,
        archerOnly: false,
        buildType: 'defense',
    },
    'Defesa Back': {
        spear: 7950,
        sword: 7950,
        axe: 0,
        archer: 0,
        spy: 250,
        light: 0,
        marcher: 0,
        heavy: 700,
        ram: 0,
        catapult: 8,
        archerOnly: false,
        buildType: 'defense',
    },


};

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;
if (typeof DISABLE_DEFAULT_TEMPLATES !== 'boolean')
    DISABLE_DEFAULT_TEMPLATES = false;
if (typeof USER_TROOPS_TEMPLATES !== 'undefined')
    DISABLE_DEFAULT_TEMPLATES === false
        ? (TROOP_TEMPLATES = { ...TROOP_TEMPLATES, ...USER_TROOPS_TEMPLATES })
        : (TROOP_TEMPLATES = { ...USER_TROOPS_TEMPLATES });

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'troopTemplatesManager',
        name: 'Troop Templates Manager',
        version: 'v1.3',
        author: 'RedAlert (script)| Renas (Templates)',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/troops-template-manager.285658/',
    },
    translations: {
        en_DK: {
            'Troop Templates Manager': 'Troop Templates Manager',
            Help: 'Help',
            'Redirecting...': 'Redirecting...',
            'There was an error!': 'There was an error!',
            'Account Manager and Premium Account are needed for this script to work!':
                'Account Manager and Premium Account are needed for this script to work!',
            'Archer templates are now hidden!':
                'Archer templates are now hidden!',
            'Spear fighters': 'Spear fighters',
            Swordsmen: 'Swordsmen',
            Axemen: 'Axemen',
            Archers: 'Archers',
            Scouts: 'Scouts',
            'Light cavalry': 'Light cavalry',
            'Mounted archers': 'Mounted archers',
            'Heavy cavalry': 'Heavy cavalry',
            Rams: 'Rams',
            Catapults: 'Catapults',
            'You chose the template: ': 'You chose the template: ',
        },
        fr_FR: {
            'Troop Templates Manager': 'Gestionnaire de modÃ¨le de troupe',
            Help: 'Aide',
            'Redirecting...': 'Redirection...',
            'There was an error!': 'Une erreur est survenue !',
            'Account Manager and Premium Account are needed for this script to work!':
                'Gestionnaire de compte et Compte premium sont nÃ©cessaire pour que ce script fonctionne !',
            'Archer templates are now hidden!':
                'ModÃ¨les archers sont maintenant cachÃ©s!',
            'Spear fighters': 'Lanciers',
            Swordsmen: 'P.E',
            Axemen: 'Guerriers Ã  la hache',
            Archers: 'Archers',
            Scouts: 'Scouts',
            'Light cavalry': 'Cavaliers lÃ©gers',
            'Mounted archers': 'Archers montÃ©s',
            'Heavy cavalry': 'Cavaliers lourds',
            Rams: 'BÃ©liers',
            Catapults: 'Catapultes',
            'You chose the template: ': 'Tu as choisi le template: ',
        },
        pt_BR: {
            'Troop Templates Manager': 'Gerenciador de Modelos de Tropa',
            Help: 'Ajuda',
            'Redirecting...': 'Redirecionando...',
            'There was an error!': 'Houve Um Erro!',
            'Account Manager and Premium Account are needed for this script to work!':
                'Conta Premiu e Gerente de conta sÃ£o nescessario pata que este script funciona!',
            'Archer templates are now hidden!':
                ' Os aquivos do Archer agora estÃ£o ocultos!',
            'Spear fighters': 'Lanceiros',
            Swordsmen: 'Espadachins',
            Axemen: 'Barbaros',
            Archers: 'Arqueiros',
            Scouts: 'Exploradores',
            'Light cavalry': 'Cavalaria Leve',
            'Mounted archers': 'Arqueiro a Cavalo',
            'Heavy cavalry': 'Cavalaria Pesada',
            Rams: 'Arietes',
            Catapults: 'Catapultas',
            'You chose the template: ': 'VocÃª escolheu o Modelo',
        },
    },
    allowedMarkets: [],
    allowedScreens: ['am_troops'],
    allowedModes: ['template'],
    isDebug: DEBUG,
    enableCountApi: true,
};

$.getScript(
    `https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        // Initialize Library
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();
        const { isPA, isAM } = twSDK.getGameFeatures();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');

        const color1 = '#ff0019';
        const color2 = '#1409e8';

        // Entry Point
        (function () {
            try {
                if (isPA && isAM) {
                    if (isValidScreen && isValidMode) {
                        initTroopsTemplateManager();
                    } else {
                        UI.InfoMessage(twSDK.tt('Redirecting...'));
                        twSDK.redirectTo('am_troops&mode=template');
                    }
                } else {
                    UI.ErrorMessage(
                        twSDK.tt(
                            'Account Manager and Premium Account are needed for this script to work!'
                        )
                    );
                }
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo} Error:`, error);
            }
        })();

        // Initialize Troops Template Manager
        function initTroopsTemplateManager() {
            const templates = renderTemplates();

            const content = `
                <div class="rattm-flex">
                    ${templates}
                </div>
            `;

            const customStyle = `
                .rattm-flex {
                    position: relative;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                    grid-gap: 15px;
                    margin-bottom: 15px;
                }

                .rattm-box .title {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-weight: bold;
                    background-color: rgb(195,177,136);
                    background-image: linear-gradient(to right, rgb(136,122,90), rgb(195,177,136), rgb(136,122,90));
                    border: 1px solid rgb(106,96,74);
                    height: 28px;
                    line-height: 28px;
                    padding: 2px 3px;
                }

                .rattm-box {
                    position: relative;
                    cursor: pointer;
                }

                .rattm-box .ra-table-container {
                    margin-bottom: 40px;
                }

                .rattm-box .ra-table td {
                    text-align: left;
                }

                .rattm-box .template-farm-space {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                }

                .rattm-box.active-box .title {
                    background-color: #21881e !important;
                    background-image: none;
                    color: #fff;
                }

                .troops-build-icon {
                    display: inline-block;
                    margin-right: 10px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                }

                .troops-build-offense {
                    background-color: ${color1};
                }

                .troops-build-defense {
                    background-color: ${color2};
                }
            `;

            // render the scripts UI
            twSDK.renderBoxWidget(
                content,
                'raTroopTemplatesManager',
                'ra-troops-templates-manager',
                customStyle
            );

            // Hide archer only troop templates on non-archer worlds
            setTimeout(function () {
                if (!twSDK.isArcherWorld()) {
                    jQuery('.rattm-box[data-archer="true"]').css(
                        'display',
                        'none'
                    );
                    UI.SuccessMessage(
                        twSDK.tt('Archer templates are now hidden!'),
                        2000
                    );
                }
            }, 100);

            // register action handlers
            fillTemplate();
        }

        // Handle Fill Template
        function fillTemplate() {
            jQuery('.btn-set-troops-template').on('click', function () {
                const chosenTroopsTemplate = jQuery(this).attr('data-template');
                const templateName = jQuery(this).attr('data-name');

                const [
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
                ] = chosenTroopsTemplate.split(',');

                // Add visual helpers
                jQuery('.rattm-box').removeClass('active-box');
                jQuery(`.rattm-box[data-name="${templateName}"]`).addClass(
                    'active-box'
                );
                UI.SuccessMessage(
                    twSDK.tt('You chose the template: ') +
                        `<b>${templateName}</b>`,
                    500
                );

                // Fill all unit troops
                jQuery('#spear').val(spear);
                jQuery('#sword').val(sword);
                jQuery('#axe').val(axe);
                jQuery('#spy').val(spy);
                jQuery('#light').val(light);
                jQuery('#heavy').val(heavy);
                jQuery('#ram').val(ram);
                jQuery('#catapult').val(catapult);

                // Fill template name
                jQuery('#template_name').val(templateName);

                // Archer world only
                if (twSDK.isArcherWorld()) {
                    jQuery('#archer').val(archer);
                    jQuery('#marcher').val(marcher);
                }

                // Tell AM to recalc troops pop
                Accountmanager.calcPop();
            });
        }

        // Helper: Render Templates
        function renderTemplates() {
            let template = '';

            for (const [templateName, templateData] of Object.entries(
                TROOP_TEMPLATES
            )) {
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
                    archerOnly,
                    buildType,
                } = templateData;

                const renderTroops = renderBoxTroops(
                    spear,
                    sword,
                    axe,
                    archer,
                    spy,
                    light,
                    marcher,
                    heavy,
                    ram,
                    catapult
                );
                const farmSpace = calculateFarmSpace(
                    spear,
                    sword,
                    axe,
                    archer,
                    spy,
                    light,
                    marcher,
                    heavy,
                    ram,
                    catapult
                );

                template += `
                    <div class="rattm-box border-frame-gold-red btn-set-troops-template" data-template="${spear}, ${sword}, ${axe}, ${archer}, ${spy}, ${light}, ${marcher}, ${heavy}, ${ram}, ${catapult}" data-archer="${archerOnly}" data-type="${buildType}" data-name="${templateName}">
                        <div class="title">
                            <span class="troops-build-icon troops-build-${buildType}"></span> ${templateName}
                        </div>
                        <div class="status-specific">
                            <div class="ra-table-container">
                                <table class="ra-table" width="100%">
                                    ${renderTroops}
                                </table>
                            </div>
                            <div class="template-farm-space title">
                                ${twSDK.formatAsNumber(farmSpace)}
                            </div>
                        </div>
                    </div>
                `;
            }

            return template;
        }

        // Helper: Calculate farm space
        function calculateFarmSpace(
            spear,
            sword,
            axe,
            archer,
            spy,
            light,
            marcher,
            heavy,
            ram,
            catapult
        ) {
            let totalFarmSpace = 0;
            totalFarmSpace += spear * twSDK.unitsFarmSpace.spear;
            totalFarmSpace += sword * twSDK.unitsFarmSpace.sword;
            totalFarmSpace += axe * twSDK.unitsFarmSpace.axe;
            totalFarmSpace += archer * twSDK.unitsFarmSpace.archer;
            totalFarmSpace += spy * twSDK.unitsFarmSpace.spy;
            totalFarmSpace += light * twSDK.unitsFarmSpace.light;
            totalFarmSpace += marcher * twSDK.unitsFarmSpace.marcher;
            totalFarmSpace += heavy * twSDK.unitsFarmSpace.heavy;
            totalFarmSpace += ram * twSDK.unitsFarmSpace.ram;
            totalFarmSpace += catapult * twSDK.unitsFarmSpace.catapult;
            return totalFarmSpace;
        }

        // Helper: Render Box Troops
        function renderBoxTroops(
            spear,
            sword,
            axe,
            archer,
            spy,
            light,
            marcher,
            heavy,
            ram,
            catapult
        ) {
            let boxTroops = '';

            if (spear !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_spear.png">
                            <strong>${spear}</strong> ${twSDK.tt(
                    'Spear fighters'
                )}
                        </td>
                    </tr>
                `;
            }
            if (sword !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_sword.png">
                            <strong>${sword}</strong> ${twSDK.tt('Swordsmen')}
                        </td>
                    </tr>
                `;
            }
            if (axe !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_axe.png">
                            <strong>${axe}</strong> ${twSDK.tt('Axemen')}
                        </td>
                    </tr>
                `;
            }
            if (archer !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_archer.png">
                            <strong>${archer}</strong> ${twSDK.tt('Archers')}
                        </td>
                    </tr>
                `;
            }
            if (spy !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_spy.png">
                            <strong>${spy}</strong> ${twSDK.tt('Scouts')}
                        </td>
                    </tr>
                `;
            }
            if (light !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_light.png">
                            <strong>${light}</strong> ${twSDK.tt(
                    'Light cavalry'
                )}
                        </td>
                    </tr>
                `;
            }
            if (marcher !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_marcher.png">
                            <strong>${marcher}</strong> ${twSDK.tt(
                    'Mounted archers'
                )}
                        </td>
                    </tr>
                `;
            }
            if (heavy !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_heavy.png">
                            <strong>${heavy}</strong> ${twSDK.tt(
                    'Heavy cavalry'
                )}
                        </td>
                    </tr>
                `;
            }
            if (ram !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_ram.png">
                            <strong>${ram}</strong> ${twSDK.tt('Rams')}
                        </td>
                    </tr>
                `;
            }
            if (catapult !== 0) {
                boxTroops += `
                    <tr>
                        <td>
                            <img src="/graphic/unit/unit_catapult.png">
                            <strong>${catapult}</strong> ${twSDK.tt(
                    'Catapults'
                )}
                        </td>
                    </tr>
                `;
            }

            return boxTroops;
        }
    }
);
