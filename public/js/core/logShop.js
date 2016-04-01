/**
 * Created by Administrator on 2016/3/17.
 * 商店购买个人日志
 */
var FormTV = 0;
function logShopData(fromTV){
    FormTV = (fromTV > 0) ? 1 : 0;
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
            url: "http://" + window.location.host + "/logShop/board",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
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
                {name: 'ShopList', type: 'string'},
                {name: 'ShopType', type: 'string'},
                {name: 'ShopNum', type: 'string'},
                {name: 'ShopRMB', type: 'string'},
                {name: 'ShopDimond', type: 'string'},
                {name: 'ShopGold', type: 'string'},
                {name: 'ShopBuyNum', type: 'string'},
                {name: 'ShopDate', type: 'string'}
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
                autoScroll : true,
                height: 700,
                columns: [
                    {text: '序列 ', width: 80, dataIndex: 'ShopList'},
                    {text: '商品名称类型', width: 80, dataIndex: 'ShopType'},
                    {text: '总出售数量', width: 80, dataIndex: 'ShopNum'},
                    {text: '总额（RMB）', width: 80, dataIndex: 'ShopRMB'},
                    {text: '总额(钻石)', width: 80, dataIndex: 'ShopDimond'},
                    {text: '总额(金币)', width: 80, dataIndex: 'ShopGold'},
                    {text: '购买次数', width: 80, dataIndex: 'ShopBuyNum'},
                    {text: '日期', width: 70, dataIndex: 'ShopDate'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};