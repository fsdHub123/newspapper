<template lang="html">

  <transition name="uu">
    <div class="article">
      <header class="header">
        <div class="back" @click="back">返回</div>
        <ul class="head-list">
          <li @click="share">分享</li>
          <li @click="yep">赞</li>
          <li @click="comments">评数{{message.comments}}</li>
          <li>赞{{message.popularity}}</li>
        </ul>
      </header>
      <div class="content-box">
        <div class="main-content" v-html="content.body"></div>
        <div class="imgBox" ref="img">
          <div class="img-mask"></div>
          <h1 class="title">{{content.title}}</h1>
          <p class="article-from">{{content.image_source}}</p>
        </div>
      </div>
      <load-in style="position: relative;z-index: 100; top: 150px" v-show="!content"></load-in>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import LoadIn from '../loading/loading.vue'
  import api from 'api/index'
  export default{
    data () {
      return {
        content: '',
        message: {}
      }
    },
    components: {
      LoadIn
    },
    methods: {
      share () {},
      yep () {},
      comments () {
        console.log(this.id)
        this.$router.push({
          path: '/comments',
          query: {
            id: parseFloat(this.id)
          }
        })
      },
      _getNewsById (id) {
        var vue = this
        api.getNewsById(id).then(function (data) {
          vue.content = data.data
          vue.$refs.img.style.backgroundImage = 'url(' + vue.content.image + ')'
          vue.$refs.img.style.backgroundSize = 'cover'
          vue._createCss()
//          console.log(vue.content)
          vue._getNewsInfoById(vue.id)
        })
      },
      _getNewsInfoById (id) {
        var vue = this
        api.getNewsInfoById(id).then(function (data) {
          vue.message = data.data
          console.log(vue.message)
        })
      },
      back () {
        this.$router.back()
      },
      _createCss () {
        var link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', this.content.css)
        document.getElementsByTagName('head')[0].appendChild(link)
      }
    },
    mounted () {
      this.id = this.$route.query.id
      this._getNewsById(this.id)
      this._createCss()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .uu-enter-active,.uu-leave-active
    transition transform 0.5s
  .uu-enter,.uu-leave-active
    transform translate3D(100%,0,0)
  .article
    .header
      position fixed
      z-index 200
      top 0
      left 0
      height 50px
      width 100%
      background #00a2ea
      color white
      .back
        width 10%
        min-width 40px
        float left
        line-height 50px
      .head-list
        display flex
        width 60%
        height 100%
        line-height 50px
        float right
        justify-content center
        li
          text-align center
          flex 1
    .content-box
      text-align left
      position absolute
      top 50px
      bottom 0
      left 0
      right 0
      .imgBox
        background-size 100%
        background-position 20%
        background-repeat no-repeat
        position absolute
        top 0
        left 0
        height 200px
        width 100%
        .img-mask
          position absolute
          bottom 0
          left 0
          right 0
          top 0
          background rgba(0,0,0,0.5)
          opacity 0.5
        .title
          color white
          position absolute
          bottom 25px
          left 0
          text-align left
          font-weight 400
          padding 0 23px
          line-height 24px
          font-size 20px
        .article-from
          bottom 10px
          font-size 12px
          color #d3d3d3
          right 15px
          position absolute
</style>
