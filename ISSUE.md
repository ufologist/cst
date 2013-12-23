1. :active样式在手机上没有效果?
   Q: 其实有效果, 只是需要长按激活才能够达到active状态, 而非在桌面只需要点击一下就active了
   A: :active pseudo-class doesn't work in mobile safari
      http://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
      body上加一个空的ontouchstart就神奇的好了...
      不过这不是权宜之计, 最好还是使用fastclick来解决该问题和click延时