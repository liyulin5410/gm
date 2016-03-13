/**
 * Created by shine on 2015/8/20.
 */

module.exports = {
    "port": 3000,

    webDbUrl: "mongodb://ddloft:neoc22f@120.76.65.177:27017/userAccount",

    server: [
        {
            serverId: 1,
            startServer: "2015-8-28",
            url: "120.76.65.177",
            port: 8000,
            "gameDBUrl": "mongodb://seaworld:neoc22f@120.76.65.177:27017/seaworld_1",
            "gmDBUrl": "mongodb://seaworld_gm:neoc22f@120.76.65.177:27017/seaworld_gm_1"
        },
        {
            serverId: 2,
            startServer: "2015-7-10",
            url: "10.0.0.201",
            port: 8000,
            "gameDBUrl": "mongodb://seaworld:neoc22f@120.76.65.177:27017/seaworld_2",
            "gmDBUrl": "mongodb://seaworld_gm:neoc22f@120.76.65.177:27017/seaworld_gm_2"
        },
        {
            serverId: 3,
            startServer: "2015-11-16",
            url: "115.28.1.58",
            port: 8000,
            "gameDBUrl": "mongodb://seaworld:neoc22f@120.76.65.177:27017/seaworld_3",
            "gmDBUrl": "mongodb://seaworld_gm:neoc22f@120.76.65.177:27017/seaworld_gm_3"
        },
        {
            serverId: 5,
            startServer: "2015-11-16",
            url: "127.0.0.1",
            port: 8000,
            "gameDBUrl": "mongodb://127.0.0.1:27017/seaworld_5",
            "gmDBUrl": "mongodb://127.0.0.1:27017/seaworld_gm_5"
        }
    ],

    maxServerId: 2,
    appIds: ["1001"],
    operators: ["diandian"]
};
