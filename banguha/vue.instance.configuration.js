const banguha = (function () {
  return {
    command: {
      START: ":",
      END: ";",
      ARGS_SEPARATOR:   /\s+/,
      action:  {
        HELP:   "help",
        TM: "tm",
        JVOKAHA: "jvokaha",
        JVOZBA:   "jvozba",
        VLASISKU: "vlasisku",
        OPEN: "open",
        CLL: "cll",
        YOUTUBE: "youtube",
        EDITOR: "editor"
      }
    },
    COMMENT:   /#.*$/,
    help:  [{
        action: "...valsi / words",
        description: "type words to display translation (if available)"
      },
      {
        action: "do ciska lo xamgu jufra",
        description:   "display boxes"
      },
      {
        action:   "<kbd>enter</kbd>",
        description: "type enter to store your work in history"
      },
      {
        action: "<kbd>↑</kbd> <kbd>↓</kbd>",
        description: "use arrow (up/down) to navigate through history"
      },
      {
        action: "<pre>:help;</pre>",
        description:   "display help"
      },
      {
        action: "<pre>:command [args...];<pre>",
        description: "run some command"
      },
      // BROKEN ON GITHUB
      /* 
      { 
        action: "<pre>:vlasisku [valsi/word...];</pre>",
        description: "open an iframe to display <a href='http://vlasisku.lojban.org/'>vlasisku</a> data"
      }, */
      {
        action:   "<pre>:editor;</pre",
        description: "open a text editor that keep your words across the session"
      },
      {
        action: "<pre>:cll;</pre>",
        description: "open an iframe to display <a href='https://lojban.github.io/cll/'>cll</a> data"
      },
      {
        action: "<pre>:youtube videoID;</pre>",
        description: "<small>where videoID is the last part of the url of the video: https://www.youtube.com/watch?v=<strong class='bg-success rounded'>dQw4w9WgXcQ</strong></small>"
      },
      {
        action: "<pre>:jvozba <gismu> [gismu ...];<pre>",
        description: "do a lujvo"
      },
      {
        action: "<pre>:jvokaha &lt;lujvo&gt;;<pre>",
        description: "decompose a lujvo"
      },
      {
        action: "<pre>:tm [valste...];<pre>",
        description: "request <a href='https://glosbe.com/'> glosbe</a> for available sample about vlaste"
      },
      {
        action:   "<pre>lo melbi jufra # here you can safely run command like :jvozba melbi jufra; </pre>",
        description: "this permit to conserve boxes preview for the left part of the text"
      },
    ]
  }
})()