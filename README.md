# HSP nodes for node-red
This package contains to Nodes "HSP set" and "HSP get". Required informations are `host`, `ip`, `pin` and `interval`.

# Node Information
The "HSP get" node returns required informations in this schema:

```json
    msg.payload = {
        mode: data.mode,
        isTemp: data.is_temp,
        setTemp: data.sp_temp,
        ecoMode: data.eco_mode,
        nonce: data.meta.nonce,
        error: data.error,
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
```

The "HSP set" node can write informations to our stove, there are 3 options on the node which you can write to
```
    set temperature   =>   Requires an number as msg.payload value
    set weekprogram   =>   Requires a boolean as msg.payload value
    set on            =>   Requires a boolean as msg.payload (true = on, false = off)
```


#Example Flow:

```
[{"id":"e506ab4.ad73d58","type":"tab","label":"Flow 1","disabled":false,"info":""},{"id":"367c23cd.b1eacc","type":"debug","z":"e506ab4.ad73d58","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":370,"y":220,"wires":[]},{"id":"7a801e30.3d2a2","type":"function","z":"e506ab4.ad73d58","name":"","func":"msg.payload = true;\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":280,"y":300,"wires":[["9d14d9ee.eee7b8"]]},{"id":"9a69f1ba.125d1","type":"inject","z":"e506ab4.ad73d58","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":110,"y":300,"wires":[["7a801e30.3d2a2"]]},{"id":"582c7d88.13d5c4","type":"hsp-get","z":"e506ab4.ad73d58","name":"","hsp":"6623b4ad.42610c","x":120,"y":220,"wires":[["367c23cd.b1eacc"]]},{"id":"9d14d9ee.eee7b8","type":"hsp-set","z":"e506ab4.ad73d58","name":"","hsp":"6623b4ad.42610c","entity":"sp_temp","x":440,"y":300,"wires":[["d2d4c632.2568f8"]]},{"id":"d2d4c632.2568f8","type":"debug","z":"e506ab4.ad73d58","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":650,"y":300,"wires":[]},{"id":"6623b4ad.42610c","type":"hsp","z":"","name":"HSP-6","host":"10.10.48.134","pin":"2749","interval":"60"}]
```

#Changelog 

##1.0
Initial Release

#

