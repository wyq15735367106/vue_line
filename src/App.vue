<template>
  <div id="app" ref="app" style="height:100%; width:100%;">
    <div style="background: #000;color:#fff;display: flex;text-align: center;padding: 10px 10px;">
      <p style="flex: 1;" :class="{ sele: isActive == 1 }" @click="ChangePeriod(4, 1)">1Min</p>
      <p
        style="flex: 1;"
        class="5M"
        :class="{ sele: isActive == 2 }"
        @click="ChangePeriod(5, 2)"
      >5Min</p>
      <p
        style="flex: 1;"
        class="5M"
        :class="{ sele: isActive == 3 }"
        @click="ChangePeriod(6, 3)"
      >15Min</p>
      <p
        style="flex: 1;"
        class="1D"
        :class="{ sele: isActive == 4 }"
        @click="ChangePeriod(0, 4)"
      >Day</p>
      <p
        style="flex: 1;"
        class="1D"
        :class="{ sele: isActive == 5 }"
        @click="ChangePeriod(1, 5)"
      >Week</p>
      <p
        style="flex: 1;"
        class="1D"
        :class="{ sele: isActive == 6 }"
        @click="ChangePeriod(2, 6)"
      >Month</p>
      <p
        style="flex: 1;"
        class="5M"
        :class="{ sele: isActive == 7 }"
        @click="ChangeKLineArea('', 7)"
      >Time</p>
    </div>
    <div style="background-color: #000;display: flex;">
      <button style="flex: 1;" class="VOL" @click="ChangeIndex(1, 'VOL')">VOL</button>
      <button style="flex: 1;" class="MACD" @click="ChangeIndex(1, 'MACD')">MACD</button>
      <button style="flex: 1;" class="KDJ" @click="ChangeIndex(1, 'KDJ')">KDJ</button>
      <button style="flex: 1;" class="RSI" @click="ChangeIndex(1, 'RSI')">RSI</button>
      <button style="flex: 1;" class="BOLL" @click="ChangeIndex(0, 'BOLL')">BOLL</button>
      <button style="flex: 1;" class="BIAS" @click="ChangeIndex(1, 'BIAS')">BIAS</button>
      <button style="flex: 1;" class="BBI" @click="ChangeIndex(0, 'EMPTY')">EMPTY</button>
      <button style="flex: 1;" class="MA" @click="ChangeIndex(0, 'MA')">MA</button>
    </div>
    <div id="kline" ref="kline" style="height:800px;width:100%"></div>
    <!-- <div>
            <button class="MACD" @click="ChangeIndex(1,'MACD')" >MACD</button>
            <button class="KDJ" @click="ChangeIndex(1,'KDJ')">KDJ</button>
            <button class="BIAS" @click="ChangeIndex(1,'BIAS')">BIAS</button>
            <button class="BOLL" @click="ChangeIndex(0,'BOLL')">BOLL</button>
            <button class="BBI" @click="ChangeIndex(0,'EMPTY')">EMPTY</button>
            <button class="RSI" @click="ChangeIndex(1,'RSI')">RSI</button>
            <button class="MA" @click="ChangeIndex(0,'MA')">MA</button>
            <button class="VOL" @click="ChangeIndex(1,'VOL')">VOL</button>
    </div>-->

    <div style="display:block;">
      <button class="S1000009" @click="ChangeSymbol('btcusdt')">btcusdt</button>
      <button class="S1000000" @click="ChangeSymbol('ethusdt')">ethusdt</button>
      <button class="whitestyle" @click="ChangeStyle('white')">白色配色</button>
      <button class="blackstyle" @click="ChangeStyle('black')">黑色配色</button>
    </div>
  </div>
</template>
<style>
.sele {
  color: #6ebfd8;
}
.jschart-drawing {
  width: 100% !important;
}
#kline {
  width: 100% !important;
}
</style>

<script>
import $ from "jquery";
import HQChart from "hqchart";
import "hqchart/src/jscommon/umychart.resource/css/tools.css";
import "hqchart/src/jscommon/umychart.resource/font/iconfont.css";
import pako from "pako";

// import Chart from "./jscommon/umychart.vue/umychart.vue.js";
// var HQChart = { Chart: Chart };
// 更新
function DefaultData() {}

DefaultData.GetKLineOption = function () {
  //K线配置信息
  var option = {
    Type: "历史K线图", //创建图形类型

    //窗口指标
    Windows: [
      { Index: "EMPTY", Modify: false, Change: false, TitleHeight: 0 },
      {
        Index: "VOL",
        Modify: false,
        Change: false,
        IsShowTitleArraw: false,
        IsShowIndexName: false,
        IndexParamSpace: 10,
      },
      //{Index:"RSI", Modify:false,Change:false},
    ],

    IsAutoUpdate: false, //是自动更新数据(不自动更新由外部更新)
    IsApiPeriod: true, //使用Api计算周期
    IsShowRightMenu: false, //右键菜单

    CorssCursorTouchEnd: true,
    //StepPixel:5,        //移动一个K线需要的手势移动的像素(默认4)
    //ZoomStepPixel:8,    //缩放一次,2个手指需要移动的间距像素(默认5)

    //K线设置
    KLine: {
      DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
      Right: 0, //复权 0 不复权 1 前复权 2 后复权
      Period: 4, //周期 0 日线 1 周线 2 月线 3 年线
      MaxReqeustDataCount: 1000, //数据个数
      MaxRequestMinuteDayCount: 10, //分钟数据取5天
      PageSize: 50, //一屏显示多少数据
      IsShowTooltip: false, //是否显示 div K线提示信息 (手机端要填false)
      DrawType: 0, //K线类型 0=实心K线柱子 1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积图
      RightSpaceCount: 3,
    },

    EnableFlowCapital: {
      BIT: false,
    },

    DragDownload: {
      Minute: { Enable: true }, //开启分钟数据拖拽下载
      Day: { Enable: true }, //开启日线数据拖拽下载
    },

    //标题设置
    KLineTitle: {
      IsShowName: true, //不显示股票名称
      IsShowSettingInfo: true, //不显示周期/复权
    },

    //边框
    Border: {
      Left: 1, //左边间距
      Right: 1, //右边间距
      Bottom: 0, //底部间距
      Top: 1, //顶部间距
    },

    //子框架设置
    Frame: [
      {
        SplitCount: 3,
        IsShowLeftText: true,
        SplitType: 1,
        Height: 8,
        Custom: [{ Type: 0, Position: "right" }],
      },

      { SplitCount: 2, IsShowLeftText: false, SplitType: 1, Height: 2 },
      //{SplitCount:2,IsShowLeftText:false}
    ],

    //扩展图形
    ExtendChart: [
      { Name: "KLineTooltip" }, //手机端tooltip
    ],
  };

  return option;
};

var WHITE_STYLE = null;
var BLOCK_STYLE = null;

export default {
  name: "KLineChart",
  //外部传入的参数
  props: [
    "DefaultSymbol", //默认股票
  ],

  data() {
    let data = {
      Symbol: "btcusdt.BIT",
      OriginalSymbol: "btcusdt",
      isActive: 1,
      Chart: null, //图形控件
      Option: DefaultData.GetKLineOption(), //设置

      //WSUrl:'ws:118.126.82.129:2365/Token',
      WSUrl: "wss://api.huobiasia.vip/ws",
      Socket: null,
      LastSubString: null, //最后一个订阅的数据
    };

    return data;
  },

  created: function () {
    var log = this.GetURLParams("log");
    {
      HQChart.Chart.JSConsole.Chart.Log = function () {}; //不输出图形日志
      HQChart.Chart.JSConsole.Complier.Log = function () {}; //不输出指标脚本执行日志
    }

    //处理默认传入的参数
    if (this.DefaultSymbol) {
      this.OriginalSymbol = this.DefaultSymbol; //默认股票
      this.Symbol = this.OriginalSymbol + ".BIT";
    }

    this.InitalWhiteStyle(); //初始化白色风格
    this.InitalBlackStyle(); //初始化黑色风格
  },

  mounted: function () {
    console.log(`[KLineChart::mounted]`);

    window.onresize = () => {
      this.OnSize();
    };
    this.OnSize(); //子组件的mounted在父组件的mounted之前执行了
    this.CreateKLineChart();
  },

  methods: {
    //////////////////////////////////////////////////////////////////////////////
    //对外接口//周期切换
    ChangePeriod(period, tu) {
      //var symbol=this.Symbol;
      this.Chart.ChangePeriod(period, { KLine: { DrawType: 0 } });
      this.isActive = tu;
    },
    //切换指标  windowIndex=窗口索引, name=指标名字
    ChangeIndex(windowIndex, name) {
      this.Chart.ChangeIndex(windowIndex, name);
    },
    //切换股票
    ChangeSymbol(symbol) {
      if (this.OriginalSymbol == symbol) return;

      this.OriginalSymbol = symbol;
      this.Symbol = symbol + ".BIT";
      this.Chart.ChangeSymbol(this.Symbol);
    },
    //分时面积图
    ChangeKLineArea(on, tu) {
      this.Chart.ChangePeriod(4, { KLine: { DrawType: 4 }, Reload: true });
      this.isActive = 7;
      // $(this).html("color")
    },

    Destruct() {
      //页面关闭的时候 销毁hqchart实例 和 ws连接
      if (this.Chart) this.Chart.StopAutoUpdate();
      if (this.Socket) this.Socket.close();
    },

    ChangeStyle(styleName) {
      var style = null;
      if (styleName == "black") style = BLOCK_STYLE;
      else if (styleName == "white") style = WHITE_STYLE;
      else return;

      HQChart.Chart.JSChart.SetStyle(style); //设置全局颜色配置
      this.$refs.kline.style.backgroundColor = style.BGColor; //修改div背景色
      this.Chart.ReloadResource({ Resource: null, Draw: true, Update: true }); //动态更新颜色配置
    },

    ///////////////////////////////////////////////////////////////////////////////////
    //内部接口

    GetURLParams: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    },

    OnSize() {
      var app = this.$refs.app;
      var height = app.offsetHeight;
      var width = app.offsetWidth;
      console.log(`[KLineChart::OnSize] width=${width} height=${height}`);

      //获取屏幕大小 动态设置K线的div大小
      var kline = this.$refs.kline;
      kline.style.width = width + "px";
      kline.style.height = height - 90 + "px";

      if (this.Chart) this.Chart.OnSize();
    },

    InitalBlackStyle() {
      //黑色风格
      var resource = HQChart.Chart.HQChartStyle.GetStyleConfig(
        HQChart.Chart.STYLE_TYPE_ID.BLACK_ID
      );
      BLOCK_STYLE = JSON.parse(JSON.stringify(resource));
      var blackStyle = BLOCK_STYLE;

      blackStyle.BGColor = "rgb(12,23,37)"; //背景
      blackStyle.FrameTitleBGColor = "rgb(16,28,45)"; //指标标题背景
      blackStyle.FrameSplitTextColor = "rgb(101,117,138)"; //刻度颜色

      //K线颜色
      blackStyle.UpBarColor = "rgb(210,73,99)";
      blackStyle.UpTextColor = blackStyle.UpBarColor;
      blackStyle.DownBarColor = "rgb(37,175,142)";
      blackStyle.DownTextColor = blackStyle.DownBarColor;

      //指标线段颜色
      blackStyle.Index.LineColor[0] = "rgb(88,106,126)";
      blackStyle.Index.LineColor[1] = "rgb(222,217,167)";
      blackStyle.Index.LineColor[2] = "rgb(113,161,164)";

      //最新价格刻度颜色
      blackStyle.FrameLatestPrice.UpBarColor = "rgb(210,73,99)";
      blackStyle.FrameLatestPrice.DownBarColor = "rgb(37,175,142)";

      //面积图颜色
      blackStyle.CloseLineColor = "rgb(113,121,133)"; //收盘价线颜色
      blackStyle.CloseLineAreaColor = [
        "rgba(36,41,57,0.8)",
        "rgba(22,34,53,0.3)",
      ]; //收盘价面积图颜色

      return blackStyle;
    },

    InitalWhiteStyle() {
      //白色
      var resource = HQChart.Chart.JSChart.GetResource();
      WHITE_STYLE = JSON.parse(JSON.stringify(resource)); //白色使用默认内置的颜色

      var whiteStyle = WHITE_STYLE;
      whiteStyle.BGColor = "rgb(255,255,255)"; //背景

      //K线颜色
      whiteStyle.UpBarColor = "rgb(210,73,99)";
      whiteStyle.UpTextColor = whiteStyle.UpBarColor;
      whiteStyle.DownBarColor = "rgb(37,175,142)";
      whiteStyle.DownTextColor = whiteStyle.DownBarColor;

      //指标线段颜色
      whiteStyle.Index.LineColor[0] = "rgb(88,106,126)";
      whiteStyle.Index.LineColor[1] = "rgb(222,217,167)";
      whiteStyle.Index.LineColor[2] = "rgb(113,161,164)";

      //最新价格刻度颜色
      whiteStyle.FrameLatestPrice.UpBarColor = "rgb(210,73,99)";
      whiteStyle.FrameLatestPrice.DownBarColor = "rgb(37,175,142)";

      //面积图颜色
      whiteStyle.CloseLineColor = "rgb(186,191,197)"; //收盘价线颜色
      whiteStyle.CloseLineAreaColor = [
        "rgba(245,245,245,0.8)",
        "rgba(245,245,245,0.3)",
      ]; //收盘价面积图颜色

      return whiteStyle;
    },

    //创建走势图
    CreateKLineChart() {
      if (this.Chart) return;

      //黑色风格
      var blackStyle = BLOCK_STYLE;
      this.$refs.kline.style.backgroundColor = blackStyle.BGColor;
      HQChart.Chart.JSChart.SetStyle(blackStyle);

      //局部修改颜色
      //var resource=HQChart.JSChart.GetResource(); //获取全局资源
      //resource.FrameSplitTextFont='30px 微软雅黑';

      let chart = HQChart.Chart.JSChart.Init(this.$refs.kline);
      this.Option.Symbol = this.Symbol;
      this.Option.NetworkFilter = this.NetworkFilter;
      chart.SetOption(this.Option);
      this.Chart = chart;

      //   HQChart.Chart.MARKET_SUFFIX_NAME.GetMarketStatus = (symbol) => {
      //     return 2;
      //   };
      HQChart.Chart.MARKET_SUFFIX_NAME.GetBITDecimal = (symbol) => {
        return this.GetBITDecimal(symbol);
      };
    },

    //数字货币价格对应的小数位数
    GetBITDecimal(symbol) {
      if (symbol == "BTCUSDT.BIT") return 2;
    },

    NetworkFilter(data, callback) {
      console.log("[KLineChart::NetworkFilter] data", data);
      switch (data.Name) {
        case "KLineChartContainer::ReqeustHistoryMinuteData": //分钟全量数据下载
          this.RequestHistoryMinuteData(data, callback);
          break;
        case "KLineChartContainer::RequestFlowCapitalData": //数字货币不会调用
          this.RequestFlowCapitalData(data, callback);
          break;
        case "KLineChartContainer::RequestHistoryData": //日线全量数据下载
          this.RequestHistoryData(data, callback);
          break;
        case "KLineChartContainer::RequestDragMinuteData": //拖拽分钟数据下载
          this.RequestDragMinuteData(data, callback);
          break;
        case "KLineChartContainer::RequestDragDayData": //拖拽日线数据下载
          this.RequestDragDayData(data, callback);
          break;
      }
    },

    RequestFlowCapitalData(
      data,
      callback //请求流通股本
    ) {
      data.PreventDefault = true;
      var hqChartData = { code: 0, stock: [] }; //如果没有数据就填空
      callback(hqChartData);
    },

    //心跳包
    SendWSHeartMessage() {
      if (this.Socket) {
        var pong = { pong: new Date().getTime() };
        this.Socket.send(JSON.stringify(pong));
      }
    },

    //取消订阅上一次的信息
    SendUnSubscribeMessage() {
      if (!this.LastSubString || !this.Socket) return;

      var message = JSON.stringify({ unsub: this.LastSubString }); //取消上次订阅的信息
      this.Socket.send(message);
      this.LastSubString = null; //清空最后一个订阅信息
    },

    RequestWSData(data, recvCallback) {
      if (!this.Socket) {
        this.Socket = new WebSocket(this.WSUrl); //创建连接
        this.Socket.onopen = (event) => {
          console.log(event);
          var message = JSON.stringify(data.SendData);
          this.Socket.send(message);
          if (data.SendData.sub) this.LastSubString = data.SendData.sub;
        };
      } else {
        this.SendUnSubscribeMessage();
        var message = JSON.stringify(data.SendData);
        this.Socket.send(message);
        if (data.SendData.sub) this.LastSubString = data.SendData.sub; //保存最后一个订阅信息
      }

      this.Socket.onmessage = (event) => {
        var reader = new FileReader();
        reader.addEventListener("loadend", (e) => {
          //console.log(e);
          let ploydata = new Uint8Array(e.target.result);
          let msg = pako.inflate(ploydata, { to: "string" });
          //console.log("[KLineChart::RequestWSData] recv ws data ",msg)
          var recvData = JSON.parse(msg);
          console.log(recvData);
          if (recvData.ping) {
            this.SendWSHeartMessage(); //回复服务器心跳包
          } else if (recvData.unsubbed) {
            //取消订阅成功
          } else if (recvData.subbed) {
            //订阅成功
          } else {
            recvCallback(recvData, data);
          }
        });

        reader.readAsArrayBuffer(event.data, "utf-8");
      };

      this.Socket.onerror = (evnet) => {
        console.log(event);
      };
    },

    //生成请求数据
    GeneratePostData(symbol, period) {
      //1min, 5min, 15min, 30min, 60min,4hour,1day,1week, 1mon
      var MAP_PERIOD = new Map([
        [4, "1min"],
        [5, "5min"],
        [6, "15min"],
        [0, "1day"],
        [1, "1week"],
        [2, "1mon"],
      ]);

      var strPeriod = MAP_PERIOD.get(period);

      var reqData = {
        req: `market.${symbol}.kline.${strPeriod}`,
        symbol: symbol,
        period: strPeriod,
      };
      var subData = {
        sub: `market.${symbol}.kline.${strPeriod}`,
        symbol: symbol,
        period: strPeriod,
      };

      return { Req: reqData, Sub: subData };
    },

    //请求分钟历史数据
    RequestHistoryMinuteData(data, callback) {
      data.PreventDefault = true;
      var symbol = data.Request.Data.symbol;
      var period = data.Self.Period; //周期

      var postData = this.GeneratePostData(this.OriginalSymbol, period);

      var obj = {
        SendData: postData.Req,
        Symbol: symbol,
        OriginalSymbol: this.OriginalSymbol,
        Period: period,
        Callback: callback,
      };

      this.RequestWSData(obj, (recvData, data) => {
        this.RecvHistoryMinuteData(recvData, data);
      });
    },

    //接收历史分钟数据
    RecvHistoryMinuteData(recvData, data) {
      console.log(recvData);
      if (recvData.rep != data.SendData.req) return;

      var hqChartData = { code: 0, data: [] };
      hqChartData.symbol = data.Symbol;
      hqChartData.name = data.OriginalSymbol;

      if (recvData.data) {
        var yClose = null; //前收盘
        for (var i in recvData.data) {
          var item = recvData.data[i];

          //时间戳转换
          var dateTime = new Date();
          dateTime.setTime(item.id * 1000);
          var date =
            dateTime.getFullYear() * 10000 +
            (dateTime.getMonth() + 1) * 100 +
            dateTime.getDate();
          var time = dateTime.getHours() * 100 + dateTime.getMinutes();

          var newItem = [
            date,
            yClose,
            item.open,
            item.high,
            item.low,
            item.close,
            item.vol,
            item.amount,
            time,
          ];

          yClose = item.close;
          hqChartData.data.push(newItem);
        }
      }

      data.Callback(hqChartData);

      this.SubscribeMinuteRealtimeData(data);
    },

    //订阅最新分钟K线数据
    SubscribeMinuteRealtimeData(data) {
      //订阅最新数据
      var postData = this.GeneratePostData(data.OriginalSymbol, data.Period);
      var obj = {
        SendData: postData.Sub,
        Symbol: data.Symbol,
        OriginalSymbol: data.OriginalSymbol,
        Period: data.Period,
      };

      this.RequestWSData(obj, (recvData, data) => {
        this.RecvMinuteRealtimeData(recvData, data);
      });
    },

    RecvMinuteRealtimeData(recvData, data) {
      //   console.log(recvData);
      if (recvData.ch != data.SendData.sub) return;

      var internalChart = this.Chart.JSChartContainer;
      var period = internalChart.Period;
      var symbol = internalChart.Symbol;
      if (symbol != data.Symbol || period != data.Period) return;

      var hqChartData = { code: 0, data: [], ver: 2.0 }; //更新数据使用2.0版本格式
      hqChartData.symbol = data.Symbol;
      hqChartData.name = data.OriginalSymbol;

      //TODO:把recvData => hqchart内部格式 格式看教程
      //HQChart使用教程30-K线图如何对接第3方数据15-轮询增量更新1分钟K线数据

      var item = recvData.tick;

      var dateTime = new Date();
      dateTime.setTime(item.id * 1000);
      var date =
        dateTime.getFullYear() * 10000 +
        (dateTime.getMonth() + 1) * 100 +
        dateTime.getDate();
      var time = dateTime.getHours() * 100 + dateTime.getMinutes();
      var newItem = [
        date,
        null,
        item.open,
        item.high,
        item.low,
        item.close,
        item.vol,
        item.amount,
        time,
      ];

      hqChartData.data.push(newItem);

      internalChart.RecvMinuteRealtimeData(hqChartData);
    },

    //日K数据下载
    RequestHistoryData(data, callback) {
      data.PreventDefault = true;
      var symbol = data.Request.Data.symbol;
      var period = data.Self.Period; //周期
      var postData = this.GeneratePostData(this.OriginalSymbol, period);

      var obj = {
        SendData: postData.Req,
        Symbol: symbol,
        OriginalSymbol: this.OriginalSymbol,
        Period: period,
        Callback: callback,
      };

      this.RequestWSData(obj, (recvData, data) => {
        this.RecvHistoryData(recvData, data);
      });
    },

    RecvHistoryData(
      recvData,
      data //接收到日线数据 转化成hqchart格式数据
    ) {
      if (recvData.rep != data.SendData.req) return;

      var hqChartData = { code: 0, data: [] };
      hqChartData.symbol = data.Symbol;
      hqChartData.name = data.OriginalSymbol;

      if (recvData.data) {
        var yClose = null; //前收盘
        for (var i in recvData.data) {
          var item = recvData.data[i];

          //时间戳转换
          var dateTime = new Date();
          dateTime.setTime(item.id * 1000);
          var date =
            dateTime.getFullYear() * 10000 +
            (dateTime.getMonth() + 1) * 100 +
            dateTime.getDate();
          var time = dateTime.getHours() * 100 + dateTime.getMinutes();

          var newItem = [
            date,
            yClose,
            item.open,
            item.high,
            item.low,
            item.close,
            item.vol,
            item.amount,
          ];

          yClose = item.close;
          hqChartData.data.push(newItem);
        }
      }

      data.Callback(hqChartData);

      this.SubscribRealtimeData(data);
    },

    //订阅最新日K线数据
    SubscribRealtimeData(data) {
      //订阅最新数据
      var postData = this.GeneratePostData(data.OriginalSymbol, data.Period);

      var obj = {
        SendData: postData.Sub,
        Symbol: data.Symbol,
        OriginalSymbol: data.OriginalSymbol,
        Period: data.Period,
      };

      this.RequestWSData(obj, (recvData, data) => {
        this.RecvRealtimeData(recvData, data);
      });
    },

    RecvRealtimeData(recvData, data) {
      if (recvData.ch != data.SendData.sub) return;

      var internalChart = this.Chart.JSChartContainer;
      var period = internalChart.Period;
      var symbol = internalChart.Symbol;
      if (symbol != data.Symbol || period != data.Period) return;

      var hqChartData = { code: 0, stock: [] };
      //TODO:把recvData => hqchart内部格式 格式看教程
      //HQChart使用教程30-K线图如何对接第3方数据14-轮询增量更新日K数据

      var stock = { symbol: data.Symbol, name: data.OriginalSymbol };
      var item = recvData.tick;
      var dateTime = new Date();
      dateTime.setTime(item.id * 1000);
      var date =
        dateTime.getFullYear() * 10000 +
        (dateTime.getMonth() + 1) * 100 +
        dateTime.getDate();
      var time = dateTime.getHours() * 100 + dateTime.getMinutes();

      stock.date = date;
      stock.yclose = null;
      stock.open = item.open;
      stock.high = item.high;
      stock.low = item.low;
      stock.price = item.close;
      stock.vol = item.vol;
      stock.amount = item.amount;

      hqChartData.stock.push(stock);

      internalChart.RecvRealtimeData(hqChartData);
    },

    RecvDragMinuteData(recvData, data) {
      if (recvData.rep != data.SendData.req) return;
      //console.log("[KLineChart::RecvDragMinuteData", recvData)
      var hqChartData = { code: 0, data: [] };
      if (recvData.data) {
        var yClose = null; //前收盘
        for (var i in recvData.data) {
          var item = recvData.data[i];

          //时间戳转换
          var dateTime = new Date();
          dateTime.setTime(item.id * 1000);
          var date =
            dateTime.getFullYear() * 10000 +
            (dateTime.getMonth() + 1) * 100 +
            dateTime.getDate();
          var time = dateTime.getHours() * 100 + dateTime.getMinutes();

          var newItem = [
            date,
            yClose,
            item.open,
            item.high,
            item.low,
            item.close,
            item.vol,
            item.amount,
            time,
          ];

          yClose = item.close;
          hqChartData.data.push(newItem);
        }
      }

      console.log("[KLineChart::RecvDragMinuteData] hqChartData ", hqChartData);
      data.Callback(hqChartData);

      this.SubscribeMinuteRealtimeData(data);
    },

    RecvDragDayData(recvData, data) {
      if (recvData.rep != data.SendData.req) return;
      console.log("[KLineChart::RecvDragDayData", recvData);

      var hqChartData = { code: 0, data: [] };
      if (recvData.data) {
        var yClose = null; //前收盘
        for (var i in recvData.data) {
          var item = recvData.data[i];

          //时间戳转换
          var dateTime = new Date();
          dateTime.setTime(item.id * 1000);
          var date =
            dateTime.getFullYear() * 10000 +
            (dateTime.getMonth() + 1) * 100 +
            dateTime.getDate();

          var newItem = [
            date,
            yClose,
            item.open,
            item.high,
            item.low,
            item.close,
            item.vol,
            item.amount,
          ];

          yClose = item.close;
          hqChartData.data.push(newItem);
        }
      }

      console.log("[KLineChart::RecvDragDayData] hqChartData ", hqChartData);
      data.Callback(hqChartData);

      this.SubscribRealtimeData(data);
    },
  },
};
</script>

<style>
#app {
  width: 100%;
}
</style>
