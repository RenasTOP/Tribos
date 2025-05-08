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
    margin: 20px auto;
    padding: 8px 16px;
    background: linear-gradient(to bottom, #f2e5b6 0%, #d6c58a 100%);
    border: 1px solid #b59e4c;
    border-radius: 6px;
    color: #383020;
    font-weight: bold;
    font-size: 14px;
    text-shadow: 0 1px 0 rgba(255,255,255,0.6);
    cursor: pointer;
  }
  #sendToDiscord.btn-twf:hover {
    background: linear-gradient(to bottom, #e7d49f 0%, #c9b16f 100%);
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
    const playerName = game_data.player.name;  
    const currentGroup = jQuery('strong.group-menu-item').text();

    const webhooks = {
        "Renas":       "https://discord.com/api/webhooks/1369789428687437864/mgzZHBaglV2aL8EDCn6VASjml9zlGzI1FsJN6Tqeg6pP4PvG7OL0gQ4gXPyUY0c-4odh",
        "RapMonsters": "https://discord.com/api/webhooks/1369789438107979966/Owsj9tvKKxjWfAgocLVBBygcwZIFQrUTr3fWQSaaf62kwSmjqM5KA8lyxW9KIJTWFOxt",
        "AfonsoM93": "https://discord.com/api/webhooks/1369795976587382846/132Cy07b5nAgMJA_-C-Hd_hvm8uBk3I2IxLOEPgb6VNdEpyCu8nUuXs2tSTyBI5u8WDw",
        "Albinha": "https://discord.com/api/webhooks/1369789441631060130/FTTG-02iwk8fR4w1A3nE5gS-l0ixeijtU1Mgm3ANIBB4UVx9gfLQDI31tX2HxYqopNfH",
        "- Pocoyo": "https://discord.com/api/webhooks/1369795215879176202/waWEy6NElz00MRp3tLu01-OGMC4_HWs-csGOqldu6SHGvK-UskTMWEs26en2LPK2g4ct",
        "lipelighting": "https://discord.com/api/webhooks/1369789444848353320/620CDqVc5JGFkytVv-WTAQtkGZSyYm_qTbEZernC32X9JtabPjzXsol9JxgRUWiXB87-",
        "bataunit": "https://discord.com/api/webhooks/1369796210289938534/Ct380z2h9k4hbyUVjw2uqOrNtgJ7iGFflG7pGQaC9dAyP588piG9R1x0EF9BxCPWgWxc",
        "Beyond The Veil": "https://discord.com/api/webhooks/1369817923597762672/RrD_lTJ218Q8zVSkfzOE_YdIuXYIRLEuNlu4-unvz6btl3iBqCDPCH_02dziAJLoIV5u",
        "Elon Musk": "https://discord.com/api/webhooks/1369796216157634670/VQmIUZIZYHka5i8oX2gh24ef4ziFslWeGR2keQH8TqlBJpYh8LeH1iA0PyLpwvI4HeqI",
        "Bostinhatp": "https://discord.com/api/webhooks/1369796239776026717/-fHcrEYhbzS-X-9yiz4gAJib_D8o1RlYLz2swtXsmoypi8FVaKLQhrTC5rKOEtItll8N",
        "brutus28": "https://discord.com/api/webhooks/1369795694457524224/4XcbEIJTG9PzOYh1ED4bw8_-iDqFpDw5K55QA5rPqi-2SPguJB5YPj8u2rWBflcykDfq",
        "piano": "https://discord.com/api/webhooks/1369795696948936825/As77S8-9Knyyhkai1O37adrP3z9qlekVMiaH4j4Epzlh4A0d-KT0utkbwcpXiyoaAGjM",
        "SalazarJáVosComeu": "https://discord.com/api/webhooks/1369795695921598484/JKEAT1WLde4PmDpYQN0vODiROADiKWUXKrEz9yXr1SJAf4Q5GeFZnaJEK_BRirr-eyi9",
        "- Chernobyl Disaster.": "https://discord.com/api/webhooks/1369795699096424660/2oaB8kt4IqbDoNdJLvda7hDD8K0JGVNAYJyOGmx2i7KnB3RbbKp4Ccv8gZ2Nsh8ixG6g",
        "COMMON": "https://discord.com/api/webhooks/1369796240753033317/Rn9i2tquW1_M6o2CFWCKUFk8ThZxxqsHubqcM6mrCHQ6ZHI-jNDU0A6Oq9zjNmrp5GhU",
        "coolbyte": "https://discord.com/api/webhooks/1369796239633416213/C7XPozwE2WX4kTm_K654ks5_bbIezcxqRlFY9lQPINjZNOwQfVO0AhQVwS3WGZVmW4_8",
        "Cristo": "https://discord.com/api/webhooks/1369796215943860325/c2z7DkIbu4DVxJosarnZ5oKEI4HII2XWi2biwoeKvAdHPr6P1W7UOejjlmLQK3UtD6qg",
        "diabrete69": "https://discord.com/api/webhooks/1369817916987670559/OvBBuj6qjs_0NWPvZdk1fmoFCujXZCqNvqhfm78GClOkF-On_-nv7LFE8YIRUb3Ph6Lj",
        "Dom Adolfo 88": "https://discord.com/api/webhooks/1369789782091108472/YHf_Yv4BJCeMss-mKDdBZDKAD9Q_RQRqZN-gF_1KSqxWRR3-aFFJYd1vVgACaWXnhBh8",
        "Donald Trump": "https://discord.com/api/webhooks/1369814952130383872/lzlztfxn9GtnjNkqpN-UOlIe2UsUOeelXqRkS3JVj6KmiY3SpzMXLcilzFu3TR4OSWgg",
        "Doritooz": "https://discord.com/api/webhooks/1369789451760308234/R6lVEQyOYYziqCOGKSDtDpupB43ZIVb6rLfKw6BNEGSMnobjZ6A0P0MwHjHRCqByM7F4",
        "dudas1000": "https://discord.com/api/webhooks/1369828497698193508/zgx1cSBzFe0ygTK4gg6qch91rfPtQe7n-uY23js8U5cg3QcK-7HKtLlk7U5Ipw8GKwsx",
        "facethekings": "https://discord.com/api/webhooks/1369828382593912862/LOxpGibQ-4v1nBQI0EVijwHtjlsQvL7sAXyYQr8VdCqL8mwP7lxxiU_XbDDBi9U4UVB6",
        "falach016": "https://discord.com/api/webhooks/1369828423043907624/ZmrjVrWgPw0l_E76CbZtmv-OmnibXXRSMKuxm_v8rt5XOo9WyayRNGlmHwxON5Ig7MRL",
        "FoReVeR AlOnE *-*": "https://discord.com/api/webhooks/1369828306244993106/UgyyjDFvUufdkujgy6HcqD06M6JpMVqtz2BiPFzf1MYbE_FwwhAdlXPUp1JWNx5HM8e6",
        "frogirogy": "https://discord.com/api/webhooks/1369828345641963662/kQ9SblppbVnpL3-LHQbsX6V3VPYgrMep6JZh1TbCNErlJRcI6ZP9YHt_fXgTHkolw65I",
        "Fryxion": "https://discord.com/api/webhooks/1369814955846799541/L6PipQ9qs7VV8Us491DwxutxezCGIj5ojP6baMGBSy5rtD8c8uoYnqnbWrcn_991O-re",
        "-GauntChaff08-": "https://discord.com/api/webhooks/1369795220191055872/R3g6t_hFV_AS1TmDs_0YxehSPlFcJJ0hT7rfUHmY1-z86fS-C7IaQqb_l2G3xsRT1Gik",
        "Geremilo": "https://discord.com/api/webhooks/1369795230802640938/DMVGkIJyuIUSDnAy9N0KEAOukI6sQxsabxAL-353W-vDDePQchGeLQVi0_4Ek9WUFwZc",
        "GetManekt": "https://discord.com/api/webhooks/1369789456315322458/55JaPWS3x7sAcIOAjNtYxvsPHZSdWMn2mXuE4fiLPjOgYUFN2BdBp_sJjX_zBq9HiB49",
        "giutas2": "https://discord.com/api/webhooks/1369814959587852399/imBrT6i7E3cOPtdp7db8r6qKh5fxsBUknLv7Y-4AH_5BL27sOGGnoI-wjNP304tmezmg",
        "hulra": "https://discord.com/api/webhooks/1369814964487065670/TWCVULxs3SH9D4TjVUd-RNeBO_9Vcd9ojgmLVC-wy2k_Oby0NLK865WrIF2hxvo52wO_",
        "- Hyper": "https://discord.com/api/webhooks/1369789786029821992/uVwDVwsMAcTn3wtjdlQQOcUHsBNP0_nrOQB2byaQeLDN9ZzfudPMx7CZaALsRmQngEfL",
        "inhuman": "https://discord.com/api/webhooks/1369795225488461927/G8vuhVnZkQv0aOFbiUw57PnFxYebh-RhUPevhwzpTCHB5quExERJPc8jhULhcyKgaHI2",
        "IronFlux": "https://discord.com/api/webhooks/1369828250741768302/u9wzPkmAp2fDKw8j3bzqsbYqzl7a56aGPtnnL61LU_g8T154j-tjtbTB5-EwNk8FDWCF",
        "janela23": "https://discord.com/api/webhooks/1369820945899982961/k8cPGnBhj9b0Rj6dNo10QeneYDlXI0UIbDsYunI3w_nEsVp2VxmDYl4ZxYhgEFdWpwSE",
        "João Morgado": "https://discord.com/api/webhooks/1369814971638218872/A6mFy2mqw2tTZtf16DQ4YXq9NgouAuHvdFuer8bEIPuacUJEtzA88cO5tHSm8vhrTdow",
        "Lies": "https://discord.com/api/webhooks/1369814971638218872/A6mFy2mqw2tTZtf16DQ4YXq9NgouAuHvdFuer8bEIPuacUJEtzA88cO5tHSm8vhrTdow",
        "Vibings 4 Fun": "https://discord.com/api/webhooks/1369814971638218872/A6mFy2mqw2tTZtf16DQ4YXq9NgouAuHvdFuer8bEIPuacUJEtzA88cO5tHSm8vhrTdow",
        "Play The Rules": "https://discord.com/api/webhooks/1369814971638218872/A6mFy2mqw2tTZtf16DQ4YXq9NgouAuHvdFuer8bEIPuacUJEtzA88cO5tHSm8vhrTdow",
        "Morgana Le Fay": "https://discord.com/api/webhooks/1369814971638218872/A6mFy2mqw2tTZtf16DQ4YXq9NgouAuHvdFuer8bEIPuacUJEtzA88cO5tHSm8vhrTdow",
        "JONSIE": "https://discord.com/api/webhooks/1369795226851344475/uyOWSGtAl8E4pykxEmmDxP3ppG4bXxJiADrFUZu5fIMImE1V8G_mYMlrHw3jULDmcDvy",
        "KaiZen": "https://discord.com/api/webhooks/1369815208054489088/iWJZN5A0x_HNzS7lesfy0dEg7fqPGo6phSWvES0xCbwsSFmAgwitewXfukDZIUDhPyjv",
        "Kapinha do Povo": "https://discord.com/api/webhooks/1369795228902621284/R1nW0rHNFhIT4PyNfn-Hsf6YKCdDZuHezT01jzgaap0ulvC_XntUALfIuV0Pq9UyPL_b",
        "krawk": "https://discord.com/api/webhooks/1369795222833332344/EtYHu7WMjD6xw9iKbyPdh2NXCB2R9hDzioU6KgWE3s57ZcaUhIKyVNHmeA8QdT9NjEyS",
        "Mac-bride77": "https://discord.com/api/webhooks/1369815204149596190/Gpra5Z4OxeNHpsMy9dlioDXAzb8ubbgT5G4OJVrE4ETiZQUm5_cGHY0pyYNoZF49py_4",
        "ManoBreak": "https://discord.com/api/webhooks/1369815211653206047/7zsypaY18_3Y_Tna3MyfpyiwcDtTcVbmHG8gRrmsd4OGzsyf-bbpYxSk7R6ktlPUE24G",
        "mario5pt": "https://discord.com/api/webhooks/1369815215369228330/blWqJ06v3Z5rs4aoykfJH8egIa3UKYSrtfssi9-i5PjV54NMnO4KENSNVwAgVoolNPJJ",
        "maste2435": "https://discord.com/api/webhooks/1369815396164567140/zpzVltriRRL0iF0YySyS9t_M0SIdJFKBBy55o6_xEcvKv4gvzyXdgpA9ccXSoI7V7J2G",
        "Master Roshi": "https://discord.com/api/webhooks/1369795218093641748/3pu2atmJWnRLI8_Ip491HM3UF47u9RTkXaceWm4K9cBhla4_aSRnhTUPDamD5tZiUgoh",
        "Modivas": "https://discord.com/api/webhooks/1369795211412377600/jVr5pwAv-rKVh_v_SbeluDu0oXWtVmHE6WkkO5bWMqktikM6SKm299HzJNYBQsYWbHoZ",
        "Moita29": "https://discord.com/api/webhooks/1369795213861589196/OTA271Gn_PplWZhhyyBiKAN7sXaobsQmZf0rtstQtiprodnjkOHQbm8GibGPaUTcXnj6",
        "MotorSport": "https://discord.com/api/webhooks/1369815524405415939/XYOs80LNHeAC5aqv1b-ZOyCVqFrKQu6E4VKXwge1WAbk96O2DUNhtupS0AelfTjzNXjH",
        "- Neurologic.": "https://discord.com/api/webhooks/1369815533763039262/YK40ZdBQgYwt0LRAtQko_y3oyIG1avm4NVfqsJrEKdGpCzYPZQfV9QF8KKgTFLR9P1-3",
        "-N i n g u é M ?": "https://discord.com/api/webhooks/1369815537819058227/oDyrxdz8GmVJRK3ch9eopZPcstDBZ8kXGA8sC08kpMPBbTd6m8v668-xSg54d8z1D3Cj",
        "No limits": "https://discord.com/api/webhooks/1369795692524208228/Y12ZIg5gLpA00rjEXpDIgYaUsw_tMb12GpDF4IJnUvDmDM-l5v0lEmf7T4ZK8gODEYTQ",
        "N00BSTYL3": "https://discord.com/api/webhooks/1369795687088390194/finoN1NVZQ_YxJGPonB7YygbV2EsmQAUlYCwbZLyd65vZuT8KOyf8cDn_8ozAzIX1e-m",
        "O Santificado": "https://discord.com/api/webhooks/1369789434165461084/xuPug48pT7VJX96aSblqIYneK9cV-E2kE763oYNdthlKzEhhvvnZxLI_vIxVObCL_psk",
        "OldPlayer": "https://discord.com/api/webhooks/1369795192407851178/pZaV4HpCApIchSIE4_Z4b2WSx6xPTxyIemPnZJan5-M_RZHBZ5m5yBCziw4EPXUzKTXI",
        "p2bartolo": "https://discord.com/api/webhooks/1369789448174309426/mkNflZ-Ke2wOzG1VHinIFd-I8qx1vBXep6Pjoiv7h9QMDPTylK-AZHZQs_UqHmLgbnni",
        "Pink Floyd": "https://discord.com/api/webhooks/1369795208321175603/8DroF8WpEYrPCSpwgJ2d2woxgd0cZp9APsdfJWa0-0nltBFhY2v1R5u8PWgz0jueJ1ZA",
        "ptbruno": "https://discord.com/api/webhooks/1369815221425668198/HXtg2nfkdqF7FMSA5M-gU0KL2sxxUQ3-KXI_xzp7EOg98Utja27nkFcRnUEzYq3lssoK",
        "rCkSeTemSerginho": "https://discord.com/api/webhooks/1369795688937947156/r6lNjNjs1xeSmdAjFs7z9E_zVOq9I9V0VvdRt6CEky52h-l26-EjwMH8UZgz-P8YHYu9",
        "romano2001": "https://discord.com/api/webhooks/1369820940464029696/6fIenh8JfZhQ4K8g8UPWcSujDPXaI5F7pQ9VjhkRjI7DO01rR6MTCEdbHFYza8Y3Kuwk",
        "Sacana Nervoso": "https://discord.com/api/webhooks/1369815723890704457/Wsy0J4s_iZ3mqDlvupNx_vamRFBa9CNGwwIFE-85l9rI0u5facUfVkRToje83aDgZ4W6",
        "Scartzz1": "https://discord.com/api/webhooks/1369795206676746341/sujDSfPCFbEiwLz9JhXM7krH8wvF4ix9GEUcssWk-a1VGON79kFpfqWaXf8Zk7XT7puE",
        "Senhor Nestum": "https://discord.com/api/webhooks/1369815734011822131/k4Dquwh57G5GfKoKPqShLACb1_i4KsnQz4jmEOkplc6zb4EG1zRULxNZTLosTqygWuoU",
        "shirime": "https://discord.com/api/webhooks/1369815727229636760/VgCmImVqQB-3PrU-xr7k5LgOZAm3SHPVFmCS1QCMuuSTS2qiShfmKIISilDmi4uwrRri",
        "Skaias": "https://discord.com/api/webhooks/1369795690909270138/tm9oaqcZD60ATv6yPfkGvtrPpQdzhFQ8L2xcFgCZ68CHWK5mos6vAtBAdWi8VfbmqHJw",
        "SpoTottaWeed": "https://discord.com/api/webhooks/1369815730828345406/SGUVaYTzUqFvaKj2XqZ9WZhn-Snvi4MCShhLQ_D68WwEYXMEKUx9w3v5tIhvzV5VJ2ud",
        "isto é só haters": "https://discord.com/api/webhooks/1369789784205299933/ZIlMUNtbimgtERqPTyv8Lvmjk4b_d9lNscoa_WKrO-OMOvD_8kN3n5JpMrK_3mgeKic1",
        "telmoq": "https://discord.com/api/webhooks/1369815545767002186/zPpz1zy74V7i7kUNaqlNyRmqFZ3EgjBwU6vyIlPXttbuWGWFWu9tEA9QLuuhFI45fFlv",
        "texmex07": "https://discord.com/api/webhooks/1369816234924834957/NWazCRaWaMzWit1ugejWaoCXfChcR4IAVS-sB7dvkfK64-ZPeQ3IOrHOppfftx3d_Tn9",
        "The Scorpion": "https://discord.com/api/webhooks/1369815541665108120/BO38gNSr-9Z24OQShRIMxwpLtoPcfEB9F_8YMlfh2DbW32IqvwWCv0lLQ1Zqmm3_oI7m",
        "tiago10b": "https://discord.com/api/webhooks/1369796215067250698/23Mo6nzfuoJ2eW63u74j74BQpdoruGd5tXemH0dagKyWA-wSlExNqezlhZz2strs4mAh",
        "Alluro": "https://discord.com/api/webhooks/1369817937774645298/csaEdJq80XNb5EgneOSQO_CBIxJkSDk_ZoefVFDHydnTHeADS6vN7ZUTaTlSwd2smNQf",
        "TorradasComManteiga": "https://discord.com/api/webhooks/1369817932972036146/rsqK3GLPRAbkl-t7CVDqrXh-tD1PC2e9yp13h9r8KRwJUL4ZWtwxgu5KLcBbP3m_nxJs",
        "treis": "https://discord.com/api/webhooks/1369795702082769046/guzeEjgYTCMe3pNKD7WQGYK5lAdbn_BCJOg1ToIbsgXhkLI9SdPiphKBp6oAyLx9iN9D",
        "Tzu.75": "https://discord.com/api/webhooks/1369817928790446110/pqTyE0ijIkp7-CoLGqY4BVpDhWxedPABKWTDiXSsGftT9hjZEwKYdtlVEhwAZWVNUJmV",
        "zxcvbnmqwertyuiop": "https://discord.com/api/webhooks/1369815737941627051/SuCRLxj6wiSay8xeMw5FpgNaKRS0XI-V47tzeIh2i1RFrF2B2vW-73pA1IIVJi7aR6ut",
    };

    const defaultWebhookURL = "https://discord.com/api/webhooks/1368315883667329076/_sCI2rqZgxVoTCZ71H-mWbmXWakXfQoYuiloVlmIGByJAM1yiismFRwYMSyNlovSjaFT";

    let webhookURL = webhooks[playerName];
    if (!webhookURL) {
        alert(`❌ Player "${playerName}" não encontrado no nosso sistema, por favor alerta a liderança no Discord da TWF.`);
        webhookURL = defaultWebhookURL;
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
  success: function() {
    alert("✅ Defesa compartilhada com a liderança!");
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.error("Erro ao enviar para o Discord:", textStatus, errorThrown, jqXHR.responseText);
    alert("❌ Não foi possível partilhar a defesa: " + errorThrown);
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
