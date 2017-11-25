<template lang="html">

  <div class="home" ref="home">
    <transition name="upload">
      <div v-show="upload" style="color: #76797e" ref="upload">
        <load-in :title="'正在更新...'" :color="'#76797d'"></load-in>
      </div>
    </transition>
    <scroll :data="list" ref="scroll" @scroll="scroll" @touchEnd="touchEnd" :scrollbar="scrollbar" :probeType="probeType">
      <div ref="list">
        <swipe :height="'220px'" v-if="tops.length > 0">
          <div v-for="item in tops"><img :src="item.image" alt="">
            <h1 class="desc">{{item.title}}</h1>
          </div>
        </swipe>
        <load-in style="margin-top: 50px" v-show="!tops.length"></load-in>
        <div class="list" v-for="x in list" v-if="list.length > 0">
          <p class="list-time">{{x.date}}</p>
          <div @click="select(y.id)" class="list-con" link v-for="y in x.stories">
            <img :src="y.images[0]" />
            <p>{{y.title}}</p>
          </div>
        </div>
      </div>
    </scroll>
    <div v-show="loading" class="loadFinish">加载完成</div>
    <div class="downLoad" v-show="download" ref="download">
      <load-in :title="'正在加载...'" :color="'#76797d'"></load-in>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import Swipe from '../swiper/swiper.vue'
  import Scroll from '../swiper/scroll.vue'
  import LoadIn from '../loading/loading.vue'
  import api from 'api/index'
  export default{
    data () {
      return {
        refreshing: false,
        trigger: null,
        loading: false,
        count: 1,
        scroller: null,
        list: [],
        swiper: '',
        tops: [],
        upload: false,
        download: false,
        probeType: 3,
        scrollbar: true
      }
    },
    components: {
      Swipe,
      Scroll,
      LoadIn
    },
    computed: {
    },
    methods: {
      scroll (pos) {
        this.loading = false
        this.maxScrollY = Math.floor(this.$refs.scroll.$el.children[0].clientHeight - this.height)
        if (pos.y > 30) {
          this.upload = true
          this.$refs.upload.style.transform = 'translateY(' + parseInt((pos.y - 30) / 2) + 'px)'
//          this.$refs.list.style.opacity = 1 - ((pos.y - 30) / 667).toFixed(1) * 2
          this.$refs.list.style.opacity = 1 - (pos.y / (this.height - 30))
        } else if (this.maxScrollY + pos.y < 30) {
          this.download = true
          this.$refs.download.style.transform = 'translateY(' + parseInt((this.maxScrollY + pos.y + 30) / 2) + 'px)'
//          this.$refs.list.style.opacity = 1 - ((pos.y - 30) / 667).toFixed(1) * 2
          this.$refs.list.style.opacity = 1 - (pos.y / (this.height - 30))
        }
      },
      touchEnd (pos) {
        var vue = this
        if (pos.y > 50) {
//            alert('正在读取数据')
          this.$refs.list.style.opacity = 0
          this.getList(1)
        } else if (this.maxScrollY + pos.y < 50) {
          //            alert('正在读取数据')
          this.$refs.list.style.opacity = 0
//          this.getList(1)
          this.loadMore()
        }
        vue.upload = false
        vue.download = false
      },
      getList(type, callback) {
        var vue = this
        if (type) {
          api.getNews().then(function(data) {
//            data.data.date = date.
            vue.tops = data.data.top_stories
            if (type === 1) {
              data.data.date = '今日新闻'
              vue.list.splice(0, 1, data.data)
            } else {
              vue.list.push(data.data)
            }
            vue.loading = false
          })
        } else {
          api.getNewsByDate(vue.GetDate(vue.count)).then(function(data) {
            var date = data.data.date
            var year = date.substring(0, 4)
            var month = date.substring(4, 6)
            var day = date.substring(6, 8)
            data.data.date = year + '年—' + month + '月' + day + '日'
            vue.list.push(data.data)
            vue.loading = false
            callback()
          })
        }
      },
      loadMore() {
        let vue = this
        vue.count--
        vue.getList(0, function () {
          vue.loading = true
          setTimeout(function () {
            vue.loading = false
            vue.$refs.scroll.refresh()
          }, 1200)
        })
      },
      GetDate(Count) {
        var dd = new Date()
        dd.setDate(dd.getDate() + Count) // 获取AddDayCount天后的日期
        var y = dd.getFullYear()
        var m = dd.getMonth() + 1 //  获取当前月份的日期
        m = m >= 10 ? m : '0' + m
        var d = dd.getDate()
        d = d >= 10 ? d : '0' + d
        return y + '' + m + '' + d
      },
      select(id) {
        this.$router.push({
          path: 'article',
          query: {
            id: id
          }
        })
      }
    },
    created () {
      this.getList(1)
    },
    mounted () {
      this.height = this.$refs.home.clientHeight
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home
    position fixed
    left 0
    background #f2f2f2
    z-index 1
    bottom 0
    right 0
    top 0
    .upload-enter-active,.upload-leave-active
      transition all 0.3
    .upload-enter,.upload-leave-to
      opacity 1
    .list
      .list-time
        padding 16px 0 8px 0
        margin 0!important
        color #76787e
        text-align left
        font-size 13px
        text-indent 1rem
      .list-con
        justify-content center
        display flex
        background white
        margin 8px 5px
        border-bottom 0.5px solid rgba(0,0,0,0.2)
        border-radius 3px
        img
          height 70px
          padding 10px
          width 75px
        p
          flex 1
          text-align left
          line-height 20px
          padding 8px 10px 10px 0
    .downLoad
      bottom -30px
      left 0
      text-align center
      width 100%
      position fixed
    .loadFinish
      bottom 0
      padding 10px
      left 0
      width 100%
      z-index 100
      color white
      background rgba(0,0,0,0.2)
      position fixed
</style>
