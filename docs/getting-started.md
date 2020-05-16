
## Getting Started

### Minimum Requirements

-   Windows 7/8/10, 64-Bit Linux (Debian, Ubuntu, Mint), macOS Sierra or Higher
-   Dual-Core Processor
-   2GB of Ram

**TL;DR:**  If you can run Chrome/Discord/Slack/Atom/etc. - You can run Open Joystick Display.

### Supported Devices

In general any joystick, gamepad, or controller that connects successfully to your operating system should work. There may be rare instances where software controllers or keyboard remaps may not work. If you encounter any, please submit an issue on our github page.

### Installing

Installing is as simple as extracting the package and start the executable.  _No installers, no nonsense._

**Windows Users:**  Windows SmartScreen will say this app is untrusted when you attempt to open it. This is because Microsoft requires applications to be signed for security. For now just bypass this dialog to continue. In the future this will be resolved.

**macOS Users:**  macOS will prevent you from opening this application by a simple double-click the first time. To work around this, on first load right click (CTRL+CLICK) and select 'open'. It will give you a dialog to let you proceed. After that you will not have to do it again until the next time you update.

### Uninstalling

As easy as installing, just delete the executable or folder in which you placed Open Joystick Display.

## Open Joystick Display Server (Beta)

This tool will allow you to use Open Joystick display when you have a separate gaming and encoding computer. How this works is you run the server on your gaming computer and you run the client/overlay on your encoding computer. This way you have total control of the joystick layout on the encoding computer in OBS or whatever you use. This tool is for advanced users.

![](https://ojdproject.com/images/user-guide/ojd-server.png)

### Downloads

System requirements, platforms, installation, and device support are identical to the Open Joystick Display client.

#### Windows

[Download v0.1 64-Bit Package](https://ojdproject.com/downloads/server/windows/stable/x64/open-joystick-display-server-0.1-x64-windows.zip)  

#### Linux

[Download v0.1 64-Bit Package](https://ojdproject.com/downloads/server/linux/stable/x64/open-joystick-display-server-0.1-x64-linux.tar.gz)  

#### macOS

[Download v0.1 64-Bit Package](https://ojdproject.com/downloads/server/macos/stable/x64/open-joystick-display-server-0.1-x64-mac.dmg)

### Networking / Firewall

You will need to ensure that your firewall will allow network talk on TCP port 56709 and that both your encoding and gaming computers can talk to each other. Note that this server was designed for internal network only and for performance sake it's unencrypted.

### Configuration

![](https://ojdproject.com/images/user-guide/ojd-server-driver.png)

In your broadcast profile just set the driver to network and put in the IP address or hostname and click reconnect. If you're having issues please ensure that your controller is active and working on the server side.

## Open Joystick Display Server NX for Nintendo Switch

Is your switch hacked? Do you want to be able to have an input overlay while your play lots of hot garbage in Mario Maker 2? Well it's here! Written by Nichole Mattera, you can now load a Switch module that will broadcast your inputs over the network to be used with Open Joystick Display. For more information go here:  [OJDS-NX GitHub](https://github.com/NicholeMattera/OJDS-NX/)

## Interface Overview

Open Joystick Display was designed to be powerful, yet easy to use. The interface may seem overwhelming at first, but in reality it's providing you with all of the information and tools you need to setup controller for streaming. In this section we will define each individual section of the application.

![](https://ojdproject.com/images/user-guide/layout.png)

#### Toolbar

Here you can find developer tools, user and developer guides, and notifications of new updates to Open Joystick Display.

#### Broadcast Profiles (Left)

This toolbar holds all of the configuration for your broadcast profiles. These features include themes, mappings, chroma color, zoom level, poll rate, and even window sizing for easy scene setup.

#### Input Tester (Buttom)

This is simply where you see the raw input of your joystick. Buttons, directionals, and triggers of your connected device. This will help you debug and map your buttons and axes correctly using the input mapper. In general, this mimics your operating system dialog when you connect a joystick.

#### Theme View (Center)

Whatever theme you select, it will display in the center of the screen. You will also see button actions and highlights here.

#### Input Mapper (Right)

Here you will map your buttons, directionals, and triggers to the device theme of your choice. The input mapper is extremely powerful, allowing for remapping of directionals to d-pads/c-pads and even allow for soft triggers (like Gamecube) or thottles on flight sticks.

## Broadcast Profiles

New in 1.0, broadcast profiles make it easy for you to define input profiles depending on what you're playing. This makes it easy to switch between platforms and setup scenes in OBS and XSplit.

### Management

![](https://ojdproject.com/images/user-guide/broadcast-management.png)From here you can create new profiles, clone existing profiles, or delete your current profile.

### Profile Name

![](https://ojdproject.com/images/user-guide/broadcast-name.png)From here you can update the name of your profile.

### Themes

![](https://ojdproject.com/images/user-guide/broadcast-themes.png)

#### Selecting a Theme

Themes will change how your controller looks. You can do this by selecting a theme from the menu on the broadcast profile.

#### Selecting a Theme Style

Some themes will have alternative styles and colors. If the theme supports it you can select that style from the menu right below the theme selection.

#### Installing a Custom Theme

Create a folder anywhere on your computer and put your theme in there. Clicking the [Folder] icon next to the theme section of the [Broadcast Profile] will open up a dialog. Select the folder where you placed your custom themes. If the system detected any themes, the interface will update and then select your custom theme from the theme dropdown. You can add as many custom themes as you desire in that folder.

#### Creating a Custom Theme

For more information on creating a custom theme please read our  [developer guide](https://ojdproject.com/developer-guide#themes). Creating a custom theme only requires basic knowledge of CSS and HTML.

**Note:**  You may notice that your input may not be mapped correctly if you switched your theme. Keep reading! In the next section we'll be getting to the input mapper which will make all of that work correctly.

### Mappings

![](https://ojdproject.com/images/user-guide/broadcast-mappings.png)From here you can create new mappings, clone existing mappings, or delete your current mappings. Please note that mappings configurations are global to the application and not to the profile. So if you delete a mapping it will be gone in another broadcast profile. However, mapping selection is unique to each individual broadcast profile. (Example: One profile could have SNES and another Xbox for example).

### Options

![](https://ojdproject.com/images/user-guide/broadcast-options.png)

#### Chroma Color / Key

This allows you to change the background color of the theme so that you can use Chroma Color/Key in OBS or XSplit. This is useful if you want a transparent overlay in your stream. This field will take a CSS defined color like  `red`  or a hex color like  `#000000`. Alternatively, you can just set the color to whatever you want and use it as a background.

#### Always on Top

This forces the window to always be on top while in broadcast mode.

#### Zoom Level

Controls the zoom level of your controller theme.

#### Poll Rate

Controls how often we're checking for new inputs from the controller.

### Window Sizing

![](https://ojdproject.com/images/user-guide/broadcast-windows.png)

This controls the size of the window while in broadcast mode. By clicking [Lock] it will prevent the window from being resizable in broadcast mode.

### Broadcast Mode

![](https://ojdproject.com/images/user-guide/broadcast-mode.png)

This removes the configuration interface and resizes the window to whatever you have defined in your broadcast profile. This is used for when you are streaming. You can enter this mode by simply pressing ESC on your keyboard. To exit, press ESC again to enter configuration mode.

### NintendoSpy/RetroSpy Support

New in 2.0 we now support the ability to use your Arduino for NintendoSpy/RetroSpy. This couldn't have been done without the awesome work of  [zoggins](https://github.com/zoggins/RetroSpy)  and  [jaburns](https://github.com/jaburns/NintendoSpy)  so go check out their work. This guide assumes you have some level of expertise.

As of right now, we currently support the following controller devices:

-   Nintendo Famicom (Nintendo Entertainment System)
-   Nintendo Super Famicom (Super Nintendo)
-   Nintendo 64
-   Nintendo Gamecube
-   Sega Master System and Mega Drive (Genesis)
-   NEC PC-Engine / TurboGrafx-16

#### Getting Started

We're not going to go over the entire process of setting up RetroSpy on your Arduino. If you're new to this please go and read the documentation on zoggins GitHub page  [here](https://github.com/zoggins/RetroSpy). In general you will need the following:

-   Working Arduino (or clone)
-   Working game console
-   Working controller
-   A wiring harness for your controller (see guide above).
-   RetroSpy firmware flashed to your Arduino.

Once you have done all of this and you have your ardunio working and plugged in proceed to the next step.

#### Using RetroSpy

![](https://ojdproject.com/images/user-guide/retrospy-working.png)

-   Make sure you have the RetroSpy front-end application closed. We won't be using this.
-   Launch Open Joystick Display
-   In your [Profile] settings you should see a section called [Profile Input Driver]
-   Change the driver to 'RetroSpy'
-   Select your serial port and the device you're using.
-   You should see your joystick working in the [Input Tester]
-   Make a custom mapping or choose a mapping based upon your RetroSpy device.
-   Select a corresponding theme.

**Connectivity Issues:**  If you have issues with your inputs, check to ensure that your device is connected (it will show in the port menu the device). Also check to see if your firmware is correct on your arduino. You can use [Refresh Ports] button to update the list of avaliable devices or [Refresh Driver] if you're having issues reconnecting.

#### Support Inquiries

If you're using Open Joystick Display for your RetroSpy overlay, please contact us first on our  [GitHub](https://github.com/RetroWeeb/open-joystick-display)  to make sure it's not an implementation detail on our part. If we find out it's an actual bug in the RetroSpy firmware we will relay that information to the developers.

## Input Tester

In this section we will go over each individual section of the input tester in detail. Learning these parts will help you configure your controller later using the input mapper.

### Terminology

-   **Buttons**  
    These are actual buttons that are pressed on your device. Typically buttons are binary, on or off in nature.
-   **Directionals (Dimensional Axis)**  
    These are analog inputs. Unlike buttons, they have a range of motion. Generally the range is anywhere from -1 to 1. For example, on an Microsoft XBox 360 analog stick, these use two axes. In the default state (center) axis X and axis Y would be [0, 0]. However, move those to the top left it would be [-1, -1], conversely bottom right would be [1, 1].
-   **Throttles and Triggers (Linear Axis)**  
    These are exactly the same as directionals, except they only move in one dimension instead of X and Y. Examples of this are Gamecube L/R triggers. They can be partly depressed to trigger an action. As an example, in a normal state L would be just [-1] however pressing on it slightly might give it a value of [-0.5] which would indicate that this trigger is active.  
      
    Another example is on flight sticks (joysticks) where this might indicate throttle speed. [-1] being no speed and everthing above that to [1] means x speed. These are typically used in games like Descent or Elite Dangerous.

### Buttons View

This section shows all of the avaliable buttons on the device. They will highlight on/off when a button is depressed. They also show the button ID in the center. You will use this ID for the input mapper.

### Two Dimensional Axis (Directional) View

This section shows all analog inputs in a directional view (X and Y). These are paid in order as they are detected in the device. Each axis has an number (ID) starting with the number 0. You will use this ID for the input mapper.

**Warning:**  You may see odd mappings where the X and Y don't actually pair. This is because the device vendor didn't pair the axes in order. Notable examples of this is the C-Stick on the Gamecube Controller. You're better off looking at the one dimensional view for these exceptions.

### One Dimensional Axis (Throttle/Triggers) View

This is very similar to the two dimensional view, however it decouples all of the axes to show you each of them individually. This view also shows the ID of each axis starting with the number 0. You will use this ID for the input mapper.

**Note:**  You may see extra buttons or axis that don't activate. This is because the vendor built the device with support for it but doesn't actually use it. An example of this is the 8BitDo SN30 controller. Just ignore these extras, your controller is working fine.

**Note:**  For Xbox 360 and Xbox One controllers L2 and R2 will be automatically mapped to buttons and not triggers. This is because of the way XInput behaves and we have no control over this as of right now. In the future we may be able to work around this limitation.

## Understanding the Input Mapper

This is where the magic happens. In this section you will map your buttons to the theme you have selected. This allows you a wide range of mappings in relation to the theme. An example of this is, while the XBox 360 theme works with the XBox 360 mapping, you may want to play SNES games and show a SNES theme on your stream. You would make a new mapping and map your buttons in relation to a SNES mapping (BAYX instead of ABXY). This allows you to use any and all controllers with a wide varity of themes and platforms.

**Warning:**  All configuration changes happen as you do them. If you're working on a new mapping we highly encourage you to make a new one by clicking [New] on the [Broadcast Profile]. Alternatively, you can clone your current map by clicking the [Clone] button.

### Configuration Section

This section simply lets you change the label of your mapping. It will also give you an overall count of each button, directional, or trigger you have mapped.

### Buttons Section

Here you will map button labels to button IDs from the [Input Tester].  **To add a button**, click [Add Button] and then select your label [such as A or START] and then put the button ID in the box next to it.  **To delete a button**, you simply click [Delete] next to it.

### Directionals Section

Here you will map your analog or directional pad.

**To add a directional**, click [Add Directional]. [X Axis] is the horizontal axis of your input and [Y Axis] is the vertical axis of your input. Match these axes with the IDs from the [Input Tester].

Furthermore, the [Deadzone] attribute is the level of tolerance you wish to have to 'activate' the directional. This can be a number from [0] to [1] (**the default is .25**).

You can also make it so that the directional functions like a  **D-Pad or C-Pad**  (N64) by checking the appropriate boxes. This is good when you may use your left analog with a SNES theme or your right analog for N64, for example.

**To delete a directional**, you simply click [Delete] next to it.

### Triggers Section

Triggers work the same as directionals except we're only using a single axis.

**To add a trigger**, click [Add Trigger]. [Axis] is the single axis ID you wish to use for this trigger. Match the axis with the IDs from the [Input Tester].

[Min] and [Max] are how sensitive you want the triggers to be. Generally the only value you'll be touching here is [Min]. These number can range from [-1] to [1]. View your axis on the [Input Tester] to get a good feel of what value this should be. Too sensitive and the trigger will always be on, too conservative and the trigger may not activate. This is all about your play style.

**To delete a trigger**, you simply click [Delete (Trash)] next to it.

### Fixed Triggers Section

![Example of a Fixed Trigger](https://ojdproject.com/images/user-guide/fixedtriggers.gif)

Fixed triggers were built as a work-around for controllers (typically running in Windows) such as the PlayStation 3, Switch Pro Controller, and Pokken Controllers where the directional pads are on a Point of View HAT and are not compatible as buttons or triggers in OJD. Because these are show as one single linear trigger, you can use that single value for each of the 8 directions (Up, Down, Left, Right, Up Right, Down Right, Left Up, Left Down) to activate your d-pad.

**To add a fixed trigger**, click [Add Fixed Trigger]. [Axis] is the single axis ID you wish to use for this trigger. Match the axis with the IDs from the [Input Tester].

[Value] is the value of your direction. If you hold any button on your d-pad you should see the axis change in the tester. Use this value here. [Button1] is the button you want to trigger, in most cases this will be directional. [Button2] is the second button you may want to trigger, this is useful because NW, SW, NE, SE are different values on a Point of View HAT so you will want two buttons to trigger instead of one.

**To delete a fixed trigger**, you simply click [Delete (Trash)] next to it.

## Getting Ready to Stream

![](https://ojdproject.com/images/user-guide/obs-example.png)

In this section we will go over how to use Open Joystick Display for streaming. Setup is fairly straight forward and painless.

### Entering Broadcast Mode

![](https://ojdproject.com/images/user-guide/broadcast-mode.png)

I'm sure you all want that lovely interface all over your Twitch steam, right? Joking aside, entering broadcast mode is painless. Simply hit the [ESC] key on your keyboard and it will hide the interface. Hit [ESC] again and the whole interface comes right back. It's right in the application title!

### Setting up in Open Broadcaster Software (OBS)

![](https://ojdproject.com/images/user-guide/obs-config.png)

We're making the assumption that you already have OBS installed and have a general understanding of how it works.

In OBS add a new [Scene] and add a [Window Capture]. Simply select the Open Joystick Display window and you're ready to stream. Don't forget to go into Broadcast Mode!

**Warning:**  Don't minimize Open Joystick Display otherwise OBS won't capture the output.

## What's Next?

![Congatulations Shinji](https://ojdproject.com/images/user-guide/congrats.gif)

Congatulations Shinji! You're now using Open Joystick Display! If you have an issue or feature request please post an issue on our  [GitHub.](https://github.com/RetroWeeb/open-joystick-display)

**Thanks for using Open Joystick Display!**