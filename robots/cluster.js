//Cluster
module.exports = {

    start: function() {

        var cluster = require('cluster');
        var app = require('./app');
        const logger = require(__dirname + '/util/logger');
        cluster.schedulingPolicy = cluster.SCHED_RR;

        if (cluster.isMaster) {
            var cpuCount = require('os').cpus().length;
            for (var i = 0; i < cpuCount; i += 1) {
                cluster.fork();
            }
        } else {
            app(cluster);
        }

        cluster.on('fork', function(worker) {
            //console.log('[Cluster] Core %d up!', worker.id);
        });

    }
};