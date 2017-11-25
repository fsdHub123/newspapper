<template>
  <div :style="{'height':height}" class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
    <div v-if="showDot" class="dots" :style="dotClass">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  const COMPONENT_NAME = 'slide'

  export default {
    name: COMPONENT_NAME,
    props: {
      page: {
        type: Number,
        default: 0
      },
      height: {
        type: String,
        default: '140px'
      },
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      showDot: {
        type: Boolean,
        default: true
      },
      click: {
        type: Boolean,
        default: true
      },
      directionLockThreshold: {
        type: Number,
        default: 5
      },
      dotClass: {
        type: String,
        default: 'left:0;right:0;'
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    watch: {
      page (newVal) {
        this.currentPageIndex = newVal
        this.slide.goToPage(this.currentPageIndex, 0, 400)
//        console.log('watch:', newVal)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._setSlideWidth()
        if (this.showDot) {
          this._initDots()
        }
        this._initSlide()

        if (this.autoPlay) {
          this._play()
        }
      })

      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
    activated () {
      if (!this.slide) {
        return
      }
      this.slide.enable()
      let pageIndex = this.slide.getCurrentPage().pageX
      if (pageIndex > this.dots.length) {
        pageIndex = pageIndex % this.dots.length
      }
      this.slide.goToPage(pageIndex, 0, 0)
      if (this.loop) {
        pageIndex -= 1
      }
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated () {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    beforeDestroy () {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    methods: {
      hasClass (el, className) {
        let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
        return reg.test(el.className)
      },
      addClass (el, className) {
        if (this.hasClass(el, className)) {
          return
        }

        let newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
      },
      refresh () {
        this._setSlideWidth(true)
        this.slide.refresh()
      },
      next () {
        this.slide.next()
      },
      disable () {
        this.slide && this.slide.disable()
      },
      enable () {
        this.slide && this.slide.enable()
      },
      _setSlideWidth (isResize) {
        this.children = this.$refs.slideGroup.children

        let width = 0
        let slideWidth = this.$refs.slide.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          this.addClass(child, 'slide-item')

          child.style.width = slideWidth + 'px'
          child.style.height = this.height
          width += slideWidth
        }
        if (this.loop && !isResize) {
          width += 2 * slideWidth
        }
        this.$refs.slideGroup.style.width = width + 'px'
        this.$refs.slideGroup.style.height = this.height
      },
      _initSlide () {
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          listenScroll: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          click: this.click,
          directionLockThreshold: this.directionLockThreshold
        })

        this.slide.on('scrollEnd', this._onScrollEnd)

        this.slide.on('touchend', () => {
          if (this.autoPlay) {
            this._play()
          }
        })

        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
          this.$emit('slide')
        })
      },
      _onScrollEnd () {
        this.$emit('slideEnd')
        let pageIndex = this.slide.getCurrentPage().pageX
//        console.log('scrollEnd', pageIndex)
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        this.$emit('currentPage', pageIndex)
        if (this.autoPlay) {
          this._play()
        }
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _play () {
        let pageIndex = this.slide.getCurrentPage().pageX + 1
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slide.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide
    position relative
    min-height: 1px
    overflow hidden
    background $color-theme
    .slide-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slide-item
        position relative
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
          height 100%
        .desc
          position: absolute;
          bottom: 1.613rem;
          line-height: 1.2;
          left: 0;
          padding: 0 .48rem;
          font-weight: 300;
          font-size: .56rem;
          color: #fff;
    .dots
      height 8px
      position: absolute
      right: 0
      /*left: 0*/
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-d
        &.active
          /*width: 20px*/
          /*border-radius: 5px*/
          background: $color-highlight-background
</style>