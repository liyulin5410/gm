function paidRetention(){
    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height:35,
        region: 'center',
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side',
            width : 200,
            style : 'margin-left:15px;'
        },
        layout : 'column',
        items:[
            {
                xtype : 'datefield',
                fieldLabel: '查询日期',
                labelWidth: 55,
                width: 200,
                name: 'starttime',
                format: 'Y-m-d',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -30),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                //labelWidth: 55,
                width: 145,
                name: 'endtime',
                format: 'Y-m-d',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -1),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style:'margin-left:20px;',
                text:'查询',
                handler : function(){
                    submit();
                }
            }
        ]
    });

    logForm.render('condition');
    function submit(){
        //if (!logForm.getForm().isValid()) return;
        var args = logForm.getForm().getValues();

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/paidRetention/stats",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                console.log(json);
                drawTable( json );
            },
            failure: function(){
                Ext.Msg.alert("错误", "没有找到相关记录");
            }
        });
    }

    function drawTable( dataFromServer ){
        Ext.getDom('dataRegion').innerHTML = '';
        Ext.define('LogDataStruct', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'serverId', type:'string'},
                {name: 'dateTime', type:'string'},
                {name: 'numOfPaidUsers', type: 'string'},
                {name: 'numOfRetentedUsers1later', type: 'string'},
                {name: 'numOfRetentedUsers2later', type: 'string'},
                {name: 'numOfRetentedUsers3later', type: 'string'},
                {name: 'numOfRetentedUsers4later', type: 'string'},
                {name: 'numOfRetentedUsers5later', type: 'string'},
                {name: 'numOfRetentedUsers6later', type: 'string'},
                {name: 'numOfRetentedUsers7later', type: 'string'},
                {name: 'numOfRetentedUsers10later', type: 'string'},
                {name: 'numOfRetentedUsers14later', type: 'string'},
                {name: 'numOfRetentedUsers18later', type: 'string'},
                {name: 'numOfRetentedUsers21later', type: 'string'},
                {name: 'numOfRetentedUsers30later', type: 'string'}
            ]
        });

        var store = Ext.create('Ext.data.JsonStore', {
            model: LogDataStruct,
            data: dataFromServer
        });


        initLogList();

        function initLogList(){
            var logList = Ext.create('Ext.grid.Panel', {
                store: store,
                viewConfig  : {
                    enableTextSelection:true
                },
                loadMask: true,
                columnLines:true,
                frame: true,
                tripeRows:true,
                autoScroll : true,
                height: 700,
                columns: [
                    {text: '服务器', width: 80, dataIndex: 'serverId'},
                    {text: '日期', width: 100, dataIndex: 'dateTime'},
                    {text: '充值人数', width: 70,  dataIndex: 'numOfPaidUsers'},
                    {text: '1日', width: 100,  dataIndex: 'numOfRetentedUsers1later'},
                    {text: '2日', width: 100,  dataIndex: 'numOfRetentedUsers2later'},
                    {text: '3日', width: 100,  dataIndex: 'numOfRetentedUsers3later'},
                    {text: '4日', width: 100,  dataIndex: 'numOfRetentedUsers4later'},
                    {text: '5日', width: 100,  dataIndex: 'numOfRetentedUsers5later'},
                    {text: '6日', width: 100,  dataIndex: 'numOfRetentedUsers6later'},
                    {text: '7日', width: 100,  dataIndex: 'numOfRetentedUsers7later'},
                    {text: '10日', width: 100,  dataIndex: 'numOfRetentedUsers10later'},
                    {text: '14日', width: 100,  dataIndex: 'numOfRetentedUsers14later'},
                    {text: '18日', width: 100,  dataIndex: 'numOfRetentedUsers18later'},
                    {text: '21日', width: 100,  dataIndex: 'numOfRetentedUsers21later'},
                    {text: '30日', width: 100,  dataIndex: 'numOfRetentedUsers30later'}
                ],
                 width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};
