
## Theme Development

Developing themes is a key part of using Open Joystick Display. Getting started is easy and will allow you to make your device unique to your stream.

### Required Knowledge

These are the basic things you'll neeed to understand to build themes. If you need help, check out our  [Learning Resources](https://ojdproject.com/developer-guide)  section.

-   Basic Coding Skills
-   HTML
-   CSS
-   Graphic Design + Vector/SVG Skills Recommeneded (But Not Required)

### Recommended Tools

These are the tools you'll need to get to work. Software examples are provided below in both free and paid options.

-   Text Editor/Coding Interface
-   Raster Design Software (For Images, Not Required)
-   Vector Design Software (For SVG, Not Required)

#### Text Editors/Coding Interface Application Examples

-   Terminal Editors (Vi/Vim/Nano)*
-   Windows Notepad*
-   [Sublime Text](https://www.sublimetext.com/)  (Paid)
-   [Visual Studio Code](https://code.visualstudio.com/)  (Free)
-   [Atom](https://atom.io/)  (Free)
-   [Notepad++](https://notepad-plus-plus.org/)  (Free)

**Note:**  While you could just use a basic text editor such as Vi/Vim/Nano/Notepad, for your sanity we do recommened something more robust such as Sublime Text or Visual Studio Code.

#### Raster Design Software

-   MS Paint (Windows)
-   [Adobe Photoshop](https://www.adobe.com/)  (Paid)
-   [Adobe Fireworks](https://www.adobe.com/)  (Paid)
-   [Afinity Photo/Designer](https://affinity.serif.com/en-gb/)  (Paid)
-   [GIMP](https://www.gimp.org/downloads/)  (Free)
-   [Krita](https://krita.org/en/)  (Free)

#### Vector Design Software

-   [Adobe Illustrator](https://www.adobe.com/)  (Paid)
-   [CorelDRAW](https://www.coreldraw.com/en/)  (Paid)
-   [Inkscape](https://inkscape.org/)  (Free)

### Learning Resources

If you're new or just a little rusty- use these resources below to help you learn the skills to build themes.

#### HTML Tutorials

-   [W3Schools HTML Tutorial](https://www.w3schools.com/html/)
-   [HTML.com HTML Tutorial](https://html.com/)

#### CSS Tutorials

-   [W3Schools CSS Tutorial](https://www.w3schools.com/css/)
-   [HTML.com CSS Tutorial](https://html.com/css/)

### Learning by Example

Maybe you just want to cut to the chase and ignore the rest of this document. You can download all of our system themes from our github page and use them as a guide for your own themes. Below are links to each of the current system themes you can work off of.

-   [Microsoft Xbox](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-microsoft-xbox)
-   [Sony Playstation](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-sony-playstation)
-   [Nintendo 64](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-nintendo-64)
-   [Nintendo Famicom/NES](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-nintendo-famicom)
-   [Nintendo Super Famicom/SNES](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-nintendo-super-famicom)
-   [Nintendo Gamecube](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-nintendo-gamecube)
-   [Sega Master System](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-sega-mega-drive)
-   [Sega Mega Drive / Genesis](https://github.com/RetroWeeb/open-joystick-display/tree/master/app/themes/ojd-sega-mega-drive)

### Package Contents

The package contents for your theme is important for Open Joystick Display to understand that it is a theme. Below is a simple directory structure of each theme package.

    theme-folder/
      |- theme.json
      |- theme.html
      |- theme.css

#### Theme Folder

This is the folder in which all of your theme contents are in.  **The name of the folder should match the ID in the  `theme.json`  file.**

#### Theme.json

This contains the metadata for your theme as well as the unique identifier of your theme. Below is an example  `theme.json`  file.

    {
        "id":"sfc",
        "name":"SFC Controller",
        "author":"Anthony Dragoni (RetroWeeb)",
        "version":"1.0",
        "copyright":"Copyright 2019 Anthony Dragoni, Open Joystick Display",
        "license":"BSD 4-Clause Attribution",
        "website":"https://ojdproject.com",
        "email":"contact@ojdproject.com"
    }

#### Theme.html

This contains all of your HTML syntax. Anything goes in here, however  `<script><object><embed><iframe><video>`  tags are forbidden and will be stripped alongside any javascript events such as  `onClick`  or  `onMouseOver`.

#### Theme.css

This is the stylesheet for your theme. This will be autoloaded alongside your editor. Any class or id with the text  `ojd`  will be removed. You can use general element tags but you may mess up the application if your selectors are too liberal. However we're in the boat of giving you enough rope to hang yourself.

#### Adding Asset Folders

While you could include all of your image and svg files in the root directory. Feel free to add folders such as  `images/`  to your theme directory. In the next section we'll go over how to reference these external assets.

**Hey Listen:**  Your folder name/id and all files should be lowercase and not include spaces. While snowflake Windows may be case insensitive, many other operating systems like Linux and macOS may not be. Keep your directory and files lowercase and space-free for maximum portability.

### Defining Styles (Sub-Themes)

New in 1.0 we have styles. This allows you to define multiple styles in a theme. This allows for multiple color profiles or even entirely different controllers in relation to your theme. Examples of this are the various styles of Xbox controllers or SNES controllers.

#### Simple Style Definition

A simple style is just a style that uses the same  `theme.html`  and  `theme.css`  but loads another theme file to override certian settings in your CSS file. This is useful if you're just changing colors.

To get started you'll want to make a add attribute to your  `theme.json`  file (example below)

    "styles":[
        {"id":"purple", "name":"Purple"},
        {"id":"silver", "name":"Silver"}
    ]

You'll see both a  `purple`  and  `silver`  theme in this style array. After that all you need to do is create a  `theme-purple.css`  and  `theme-silver.css`  (Obviously, if these are not the name of your styles, name these files using the defined style id as  `theme-YOUR_STYLE_ID.css`) and make your CSS changes in there. Refresh or reload and you will now see a list of styles in the profile theme menu.

#### Complex Style Definition

Maybe changing a color isn't enough, you actually want to do a whole new layout as well. You can do this by following the steps above and then adding the  `file`  and  `mastercss`  attributes to your style object (example below).

    {"id":"streamer-white",     "name":"Streamer (White Active)",   "file":"theme-streamer.html",   "mastercss":"theme-streamer.css"},
    {"id":"streamer-purple",    "name":"Streamer (Purple Active)",  "file":"theme-streamer.html",   "mastercss":"theme-streamer.css"},

Once you have done that you can create your custom CSS and HTML files associated with that complex theme. Note that you can also still follow the simple style definition alongside of a complex one. For the example above, while you have  `theme-streamer.html`  (replacing theme.html) and  `theme-streamer.css`  (replacing theme.css) you can also make a file called  `theme-streamer-white.css`  to help simplify your workflow.

### Referencing Assets

Sometimes you may want to include an image or svg into your theme. Here is how you do it while keeping it portable.

#### In HTML

You can use the  `%DIRECTORY%`  keyword as an absolute pathing for your  `img`  or  `svg`  tags.

##### Example

    <img class='sfc-logo' src="%DIRECTORY%/images/logo.png"/>

#### In CSS

Thankfully your stylesheet is smart enough to understand relative pathing. Adding a resource is is fairly simple.

    .sfc-logo-div {
        background-image:url('../images/logo.png');
    }

### Using SVGs

Using SVGs is a little different in Open Joystick Display than in regular HTML. We don't use  `object`  tags. To get started, you'll want to make a  `div`  in your theme HTML file with the following attributes.

    <div ojd-svg='%DIRECTORY%/PATH_TO_YOUR_FILE'></div>

This will load your SVG directly into the theme without you having to do so. This comes with the added benefit of being able to directly manipulate individual objects and adding active classes like you would with regular CSS/HTML. You will want to modify your svg file with the correct `class` and `ojd` tags where you want direct manipulation. Here is an example of an  `L`  button being mapped correctly in an SVG.

    <rect
           style="display:inline;fill:#b7b7c8;stroke:none;stroke-width:0.74710143;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none"
           id="rect885-6"
           width="43.395332"
           height="12.890939"
           x="15.039778"
           y="4.0737715"
           ry="6.4454694"
           inkscape:label="btnL"
           class="snes-button"
           ojd-button="L" />

### Buttons

In this section we'll teach you how to map buttons to your theme. Doing so is fairly simple. On any element you wish to have activated add the tag  `ojd-button`  and the value of whatever button you want it to represent such as  `START`. Once an button is activated it will append the CSS class  `active`. This will allow you to control the visualization of the active state.

#### Example

##### HTML

    <div class='sfc-button' ojd-button='START'>START</div>

##### CSS

    .sfc-button {
        background:black;
        color:white;
        padding:5px;
    }
    .sfc-button.active {
        background:white;
        color:black;
    }

#### Valid Button Keywords

To control the scope and quality of themes we have a limited mapping of buttons avaliable. Below is the list of valid  `ojd-button`  keywords.

A, B, C, X, Y, Z, CROSS, CIRCLE, SQUARE, TRIANGLE, L, L2, L3, R, R2, R3, START, SELECT, ACTION, PS, XBOX, CAPTURE, RUN, PLUS, MINUS, HOME, UP, DOWN, LEFT, RIGHT, CUP, CDOWN, CLEFT, CRIGHT, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20

You can also see these in the [Input Mapper] in Open Joystick Display itself. If you feel there is a keyword missing, put an issue in at our  [GitHub](https://ojdproject.com/_target). Rule of thumb, if you can justify it with a real life example, we'll add it.

### Directionals

In general there are a few types of directionals. D-pads, c-pads, and analogs. D-pads and c-pads can be mapped as buttons, so see the above section for those. However, for analog directionals, it's a little different since the input for those are more non-specific.

Since analogs work on an X and Y axis, we want to represent this as fluid movement. To make this work you need to make a wrapper element and then put a stick element inside of that wrapper. That stick element will move in accordance to the [Input Mapper] directional ID. This stick element will have the tag  `ojd-directional`  with the value of  `0`  to  `infinity`  (this is the directional ID from [Input Mapper]).

You can also add the  `active`  class to change the visualization of the stick while in movement. Check out the example below.

##### HTML

    <div class='xbox-analog-wrapper'>
        <div ojd-directional='0' class='xbox-analog'></div>
    </div>

##### CSS

    .xbox-analog-wrapper {
        position:absolute;
        top:0px;
        left:0px;
        height:100px;
        width:100px;
        border:1px solid #CCC;
        background:black;
        border-radius:100%;
    }
    .xbox-analog {
        position:absolute;
        top:50%;
        left:50%;
        width:30px;
        height:30px;
        margin-left:-15px;
        margin-top:-15px;
        background:#CCC;
        border-radius:100%;
    }
    .xbox-analog.active{
        background:white;
    }

You'll see above that we have the wrapper element  `xbox-analog-wrapper`  and inside of it, the stick element  `xbox-analog`. The  `xbox-analog`  element will move when directional  `0`  moves.

Good design of analog inputs should go from left to right, so for example on an XBox 360 controller directional  `ojd-directional=0`  would be the  **left analog**  and  `ojd-directional=1`  for the  **right analog**. Following these mapping rules will ensure your theme is portable to others mappings.

### Triggers

Much like analog sticks, these also have non-specific values. However, the difference is that they are only on a single axis. There are a few way to represent triggers in your theme.

#### Scale Triggers

We allow for scaling up using  `ojd-trigger-scale`  and scaling down  `ojd-trigger-scale-inverted`.

`ojd-trigger-scale`  starts with a  `height=0%`  and then goes all the way up to  `height=100%`

`ojd-trigger-scale-inverted`  does the reverse, starts with  `height=100%`  and goes down to  `height=0%`.

The value of  `ojd-trigger-scale`  and  `ojd-trigger-scale-inverted`  work just like analog directionals, they are the trigger ID from [Input Mapper]. Let's look at the example below.

##### HTML

    <div class='gc-trigger-wrapper gc-l-trigger'>
        <div ojd-trigger='0' ojd-trigger-scale-inverted='0' class='gc-trigger'>L</div>
    </div>

##### CSS

    div.gc-trigger-wrapper {
        position:absolute;
        width:150px;
        height:35px;
    }
    div.gc-trigger {
        position:absolute;
        bottom:0px;
        left:0px;
        width:100%;
        height:100%;
        min-height:60%;
        background:#666;
        padding:5px;
        border-radius:20px 20px 0 0;
        text-align:center;
        color:black;
    }

#### Movement Triggers

We allow for movement up using  `ojd-trigger-move`  and scaling down  `ojd-trigger-move-inverted`.

`ojd-trigger-move`  starts with a  `top=0%`  and then goes all the way up to  `top=100%`

`ojd-trigger-move-inverted`  does the reverse, starts with  `top=100%`  and goes down to  `top=0%`.

The value of  `ojd-trigger-move`  and  `ojd-trigger-move-inverted`  work just like analog directionals, they are the trigger ID from [Input Mapper]. Let's look at the example below.

##### HTML

    <div class='move-wrapper'>
        <div class='move' ojd-trigger='0' ojd-trigger-move='0'></div>
    </div>

##### CSS

    .move-wrapper {
        position:relative;
        top:0px;
        left:0px;
        height:300px;
        width:50px;
        border:1px solid white;
        overflow:hidden;
    }
    .move {
        position:absolute;
        top:0px;
        left:0px;
        height:50px;
        width:50px;
        margin-bottom:50px;
        background:white;
    }

#### Triggers as Buttons

This is as simple as adding  `ojd-button`  to your trigger and adding a  `active`  class in your stylesheet just like with buttons. However, it's up to the user in the [Input Mapper] to make sure that trigger activates that button.

### Arcade and Fight Sticks

These are classic four-position sticks like an Atari/Commodore or a Fight Stick. Adding these are as easy as building an directional (analog) stick.

<div class='move-wrapper'>
    <div class='move' ojd-arcade-directional='true' ></div>
</div>

Follow the design guide for directional sticks and just add the attribute  `ojd-arcade-directional`. This will allow this pseudo-analog stick to be activated by the  `UP,DOWN,LEFT,RIGHT`  buttons.

### Distribution

Distribution of themes is as simply putting your theme directory in an archive such as a zip or a tar.gz.


