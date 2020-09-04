
module.exports = function(RED) {
    const { Headers } = require('node-fetch');
    const fetch = require('node-fetch');
    const md5 = require('md5');
    function hspGet(config) {
        RED.nodes.createNode(this, config);
        let hsp = RED.nodes.getNode(config.hsp);

        setInterval(async () => {
            let response = await fetch(`http://${hsp.host}/status.cgi`);
            let data = await response.json();

            let msg = {};
            msg.payload = {
                start: data.prg,
                weekProgramStart: data.wprg,
                mode: data.mode,
                isTemp: data.is_temp,
                setTemp: data.sp_temp,
                ecoMode: data.eco_mode,
                nonce: data.meta.nonce,
                error: data.error.length <= 0 ? false : data.error,
                meta: {
                    softwareVersion: data.meta.sw_version,
                    language: data.meta.language,
                    type: data.meta.typ,
                    serialNumber: data.meta.sn
                },
                ignitions: data.ignitions,
                onTime: data.on_time,
                consumption: data.consumption,
                maintenance: data.maintenance_in,
                cleaning: data.cleaning_in,
                zone: data.zone
            };
            this.send(msg);
        }, hsp.interval*1000);
    }
    RED.nodes.registerType('hsp-get', hspGet)

    function hspSet(config) {
        RED.nodes.createNode(this, config);
        let hsp = RED.nodes.getNode(config.hsp);

        this.on('input', async (msg) => {
            let nonce = await hspGetNonce(hsp.host);
            let hash = hspCalculatePin(nonce, hsp.pin);

            const setData = {};
            setData[config.entity] = msg.payload;

            const dataToSend = JSON.stringify(setData);
            const header = hspCreateRequestHeader(hsp, dataToSend, hash);

            let res = await fetch(`http://${hsp.host}/status.cgi`, {
                headers: header,
                method: 'POST',
                body: dataToSend
            }).then(d => d.json());

            let _msg = {};
            _msg.payload = {
                start: data.prg,
                weekProgramStart: data.wprg,
                mode: res.mode,
                isTemp: res.is_temp,
                setTemp: res.sp_temp,
                ecoMode: res.eco_mode,
                nonce: res.meta.nonce,
                error: res.error.length <= 0 ? false : res.error,
                meta: {
                    softwareVersion: res.meta.sw_version,
                    language: res.meta.language,
                    type: res.meta.typ,
                    serialNumber: res.meta.sn
                },
                ignitions: res.ignitions,
                onTime: res.on_time,
                consumption: res.consumption,
                maintenance: res.maintenance_in,
                cleaning: res.cleaning_in,
                zone: res.zone
            };
            this.send(_msg);

        });
    }
    RED.nodes.registerType('hsp-set', hspSet)

    function hspConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;
        this.pin = n.pin;
        this.name = n.name;
        this.interval = n.interval;
    }
    RED.nodes.registerType('hsp', hspConfigNode)

    function hspCreateRequestHeader(config, data, pin)
    {
        return new Headers({
            'Host':	config.host,
            'Accept':	'*/*',
            'Proxy-Connection':	'keep-alive',
            'X-BACKEND-IP':	'https://app.hsp.com',
            'Accept-Language': 'de-DE;q=1.0, en-DE;q=0.9',
            'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5',
            'token': '32bytes',
            'Content-Type': 'application/json',
            'User-Agent': 'ios',
            'Connection':	'keep-alive',
            'X-HS-PIN': pin,
        });
    }
    async function hspGetNonce(ip) {
        let response = await fetch(`http://${ip}/status.cgi`);
        let data = await response.json();
        return data.meta.nonce;

    }
    function hspCalculatePin(nonce, pin) {
        return md5(nonce+md5(pin));
    }
}

