//ProxyScraper
module.exports = {

    /***********************************************************************************************************************************************
     * 
     *  PROXY SCRAPER
     * 
     *  Função start: 
     *  A função importa 2 modulos (HTTPS e FS) e cria um ficheiro chamado good_proxies.txt encrevendo no ficheiro 0 bytes.
     *  De seguida faz um HTTP GET RESQUEST para uma api pública do proxyscrape.com e guarda o resultado (Ips e Portas) no ficheiro raw_proxies.txt 
     * 
     ***********************************************************************************************************************************************/



    start: function() {
        process.title = "Dnitro - Getting proxies...";

        const https = require('https');
        const fs = require('fs');

        fs.writeFile('bin/scraped_proxies/good_proxies.txt', '', function() {})
        const file = fs.createWriteStream("bin/scraped_proxies/raw_proxies.txt");
        const request = https.get("https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=all&anonymity=all", function(response) {
            response.pipe(file);
            console.log("[Proxy Scraper] Proxies scraped with success!");
        });
    },

    /***********************************************************************************************************************************************
    *
    *   PROXY SCRAPER
    * 
    *   Função verify:
    *   A função importa 2 modulos (FS e PROXY_CHECKER) e chama a função do modulo proxychecker com a propriedade checkProxiesFromFile com o caminho
    *   para o ficheiro gerado pela função start com o nome raw_proxies.txt
    *   
    *   De seguida apliquei um filtro para apenas retornar as proxies com status: 200 (OK) e guardando no ficheiro good_proxies.txt também já gerado
    *   anteriormente pela função start.
    * 
    ***********************************************************************************************************************************************/
    verify: function() {
        process.title = "Dnitro - Checking proxies...";

        const fs = require('fs');
        var proxyChecker = require('proxy-checker');

        proxyChecker.checkProxiesFromFile(
            'bin/scraped_proxies/raw_proxies.txt', {
                url: 'http://scratchpads.eu',
            },
            function(host, port, ok, statusCode, err) {

                if (statusCode == "200") {
                    //console.log(host + ':' + port + ' => ' + ok + ' (status: ' + statusCode + ', err: ' + err + ')');

                    var proxy = host + ':' + port + '\n';

                    fs.appendFile('bin/scraped_proxies/good_proxies.txt', proxy, function(err) {
                        if (err) return console.log(err);
                    });
                }
            }
        );
    }
};