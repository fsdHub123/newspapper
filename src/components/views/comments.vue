<template lang="html">

  <div class="comments">
    <header class="header">
      <ul class="comments-list">
        <li @click="back">返回</li>
        <li class="desc">{{}</li>
        <li>编辑</li>
      </ul>
    </header>
    <article>
      <p @click="toggle">长评论</p>
      <div></div>
    </article>
    <article>
      <p @click="toggle">短评论</p>
    </article>
  </div>

</template>

<script type="text/ecmascript-6">
  import api from 'api/index'
  export default{
    data () {
      return {
        comments: {
          long: [],
          short: []
        }
      }
    },
    components: {},
    methods: {
      back () {
        this.$router.back()
      },
      toggle () {},
      _getCommentsById (id, type) {
        var vue = this
        api.getCommentsById(id, type).then(function (data) {
//          console.log(data)
          if (type.substr(0, 1) === 'l') {
            vue.comments.long = data.comments
          } else {
            vue.comments.short = data.comments
          }
        })
      }
    },
    mounted () {
      var vue = this
      this.id = this.$route.query.id
      setTimeout(function () {
        vue._getCommentsById(vue.id, 'long-comments')
        vue._getCommentsById(vue.id, 'short-comments')
      }, 20)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .comments
    .header
      background #00a2ea
      .comments-list
        padding 0!important
        justify-content center
        display flex
        li
          color white
          line-height 50px
          height 50px
          width 50px
        .desc
          padding 0 10px  
          text-align left
          flex 1
</style>
