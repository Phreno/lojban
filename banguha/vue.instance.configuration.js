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
        action: "<code>:help;</code>",
        description:   "display help"
      },
      {
        action: "<code>:command [args...];<code>",
        description: "run some command"
      },
      // BROKEN ON GITHUB
      /* 
      { 
        action: "<code>:vlasisku [valsi/word...];</code>",
        description: "open an iframe to display <a href='http://vlasisku.lojban.org/'>vlasisku</a> data"
      }, */
      {
        action:   "<code>:editor;</code>",
        description: "open a text editor that keep your words across the session"
      },
      {
        action: "<code>:cll;</code>",
        description: "open an iframe to display <a href='https://lojban.github.io/cll/'>cll</a> data"
      },
      {
        action: "<code>:youtube &lt;videoID&gt;;</code>",
        description: "where <code>videoID</code> is the last part of the url of the video: <pre>https://www.youtube.com/watch?v=<strong class='bg-success rounded'>dQw4w9WgXcQ</strong></pre>"
      },
      {
        action: "<code>:jvozba <gismu> [gismu ...];<code>",
        description: "do a lujvo"
      },
      {
        action: "<code>:jvokaha &lt;lujvo&gt;;<code>",
        description: "decompose a lujvo"
      },
      {
        action: "<code>:tm [valste...];<code>",
        description: "request <a href='https://glosbe.com/'> glosbe</a> for available sample about vlaste"
      },
      {
        action:   "<code>lo melbi jufra # :jvozba melbi jufra; </code>",
        description: "«<code>#</code>» permit to conserve boxes preview for the left part of the text"
      },
    ]
  }
})()