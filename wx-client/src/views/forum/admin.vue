<template lang="pug">
#admin
  #users(v-el:chart_wraper)
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'list',
  ready () {
    var infos = []
    this.$http
      .get('/request/forum/users')
      .then((data) => {
        if (data.body.state === 1) {
          var temp = ['']
          var count = 0
          for (let user of data.body.users) {
            let newTime = new Date(user.regDate).toLocaleString().substring(0, 10)
            let oldTime = new Date(temp[temp.length - 1]).toLocaleString().substring(0, 10)
            if (newTime === oldTime) {
              count++
            } else {
              infos.push([temp[temp.length - 1], count])
              temp.push(user.regDate)
              count = 1
            }
          }
          this.chart(data.body.users.length, infos)
        } else {
          this.toast('用户数据获取失败')
        }
      }, (err) => {
        console.log(err)
      })
  },
  data () {
    return {
    }
  },
  methods: {
    chart (sum, data) {
      var myChart = echarts.init(this.$els.chart_wraper)
      myChart.setOption({
        title: {
          text: 'VOD论坛新增用户分析 总人数：' + sum,
          top: '10px',
          left: '10%'
        },
        tooltip: {},
        xAxis: {
          type: 'time',
          splitNumber: 10,
          min: new Date('2016-11-07T17:34:20.478Z'),
          max: Date.now()
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '新增用户数',
          type: 'line',
          data: data
        }]
      })
    }
  }
}
</script>

<style lang="stylus">
#users
  width 100%
  height 100vh
</style>
