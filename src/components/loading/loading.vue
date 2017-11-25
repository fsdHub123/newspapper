<template lang="html">

  <div class="loading">
    <img width="24" height="24" src="./loading.gif" alt="">
    <p ref="title" class="desc">{{title}}</p>
  </div>

</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      title: {
        type: String,
        default: '正在载入'
      },
      color: {
        type: String,
        default: 'white'
      }
    },
    data () {
      return {}
    },
    components: {},
    mounted () {
      this.$refs.title.style.color = this.color
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align center
    .desc
      line-height 20px
      font-size $font-size-small
      color $color-text-l
    p
      margin 0 !important
</style>
