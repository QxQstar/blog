<template>
    <main
      class="home"
      :aria-labelledby="data.heroText !== null ? 'main-title' : null"
    >
      <header class="hero">
        <img
          v-if="data.heroImage"
          :src="$withBase(data.heroImage)"
          :alt="data.heroAlt || 'hero'"
        >
        <div class="hero-content">
            <h1
                v-if="data.heroText !== null"
                id="main-title"
            >
                {{ data.heroText || $title || 'Hello' }}
            </h1>
    
            <p
                v-if="data.tagline !== null"
                class="description"
            >
                {{ data.tagline || $description || 'Welcome to your VuePress site' }}
            </p>
        </div>
        
      </header>
  
      <div
        v-if="data.features && data.features.length"
        class="features"
      >
        <a
          v-for="(feature, index) in data.features"
          :key="index"
          class="feature"
          :style="{backgroundColor: getBg()}"
          :href="feature.details"
        >
          <h2>{{ feature.title }}</h2>
        </a>
      </div>
  
      <Content class="theme-default-content custom" />
  
      <div
        v-if="data.footer"
        class="footer"
        v-html="data.footer "
      />
  
      <Content
        v-else
        slot-key="footer"
        class="footer"
      />
    </main>
  </template>
  
  <script>
  const colors = ['#fff1f0','#fff2e8','#fff7e6','#fffbe6','#fcffe6','#f6ffed','#e6fffb','#e6f4ff','#f0f5ff','#f9f0ff','#fff0f6','#efdbff','#d9f7be','#bae0ff']
  
  export default {
    name: 'Home',
  
    computed: {
      data () {
        return this.$page.frontmatter
      },
  
      actionLink () {
        return {
          link: this.data.actionLink,
          text: this.data.actionText
        }
      }
    },
    methods: {
        getBg() {
            const index = Math.floor(Math.random() * colors.length)
            return colors[index]
        }
    }
  }
  </script>
  
  <style lang="stylus">
  .home
    padding $navbarHeight 2rem 0
    max-width $homePageWidth
    margin 0px auto
    display block
    .hero
      display: flex
      margin 0 20px
      
      img
        max-width: 100%
        max-height 280px
        display block
        margin 0 auto 1.5rem
        
    .hero-content
        flex: 1
        margin-left 20px
        h1
            font-size 3rem
        h1, .description
            margin 1rem auto
        .description
            font-size 1.6rem
            line-height 1.3
            color lighten($textColor, 40%)
    .features
      border-top 1px solid $borderColor
      padding 1.2rem 0
      margin-top 1rem
      display flex
      flex-wrap wrap
      align-items flex-start
      align-content stretch
      justify-content space-between
      
    .feature
      flex-grow 1
      flex-basis 30%
      max-width 30%
      border-radius 4px
      margin-bottom 20px
      padding 0 10px
      cursor pointer
      &:hover 
        box-shadow: 0 0 10px #ebebee
      h2
        font-size 1.4rem
        font-weight 500
        border-bottom none
        padding-bottom 0
        color lighten($textColor, 10%)
      p
        color lighten($textColor, 25%)
    .footer
      padding 2.5rem
      border-top 1px solid $borderColor
      text-align center
      color lighten($textColor, 25%)
  
  @media (max-width: $MQMobile)
    .home
      .features
        flex-direction column
      .feature
        max-width 100%
        padding 0 2.5rem
  
  @media (max-width: $MQMobileNarrow)
    .home
      padding-left 1.5rem
      padding-right 1.5rem
      .hero
        img
          max-height 210px
          margin 2rem auto 1.2rem
        h1
          font-size 2rem
        h1, .description
          margin 1.2rem auto
        .description
          font-size 1.2rem
      .feature
        h2
          font-size 1.25rem
  </style>