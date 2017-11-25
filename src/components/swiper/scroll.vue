<template>
  <div ref="wrapper" class="scroll">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: { // 监听滚动事件
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: true
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      pullDownRefresh: {
        type: null,
        default: false
      },
      bounce: {
        type: Boolean,
        default: true
      },
      scrollbar: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    methods: {
      _initScroll () {
        let vue = this
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          bounce: this.bounce,
          click: this.click,
          scrollbar: this.scrollbar
        })

        if (this.listenScroll) { // 如果监听了 把pos（位置）派发给 scroll组件
          this.scroll.on('scroll', (pos) => {
            vue.$emit('scroll', pos)
          })
          this.scroll.on('touchEnd', function (pos) {
            vue.$emit('touchEnd', pos)
          })
        }

        if (this.pullup) { // 如果上拉刷新标志位传入true
          this.scroll.on('pullingUp', () => {
            this.$emit('pullUp')
          })
        }

        if (this.pullDownRefresh) {
          this.scroll.on('pullingDown', () => {
            console.log('开始')
            this.aa = 1
            console.log(this.aa)
          })
        }

        if (this.beforeScroll) { // 滚动开始 会派发一个 beforeScrollStart 事件
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .scroll
    position absolute
    top 0
    left 0
    width 100%
    z-index 2
    height 100%
</style>
