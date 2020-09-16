process.title = "Dnitro - Starting bot...";

const robots = {
    proxyscraper: require('./robots/proxyscraper'),
    cluster: require('./robots/cluster'),
    bruteforce: require('./robots/app'),
    messagebot: require('./robots/bot')
}

async function start() {
    
    robots.proxyscraper.start()
    
    setTimeout(() => {
        robots.proxyscraper.verify()
    }, 2000);
    await robots.cluster.start()
    setTimeout(() => {
        robots.messagebot.start()
    }, 2500);
    setTimeout(() => {
        robots.bruteforce.start()
    }, 3000);
}

start()