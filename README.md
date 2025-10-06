# CMPM 120 - Assignment 1 Framework

This repository contains a very simple framework for data-driven, text-based games in a grid-based world based on Adam Smith's [StoryGraphTool](https://github.com/rndmcnlly/StoryGraphTool). The code is split into two main files: [engine.js](engine.js) and [rules.js](rules.js). The engine provides methods to show text and buttons, while the rules contain the actual scenes in the game. For assignment 1 in CMPM 120 you should only have to edit rules.js and myWorld.json.

## Running the game 

Open this project in your favorite text editor and start a local web server. View `index.html` in your browser through the server you started. You should be able to navigate the world and collect items, and you will see some buttons labeled "Do something" that don't actually do all that much.

## JSON Format

Each map is a JSON file with the following keys:

- title: To display as a title for the game.
- credits: To show at the conclusion of the game.
- start: The coordinates of the start tile as a mapping, with "x" and "y" coordinates (integers) on the grid.
- end: The coordinates of the start tile as a mapping, with "x" and "y" coordinates (integers) on the grid.
- rooms: A mapping of room ids to rooms. The keys are of the form x_y, e.g. 0_0 would be the room at x=0, y=0, while -3_4 would be the room at x=-3, y=4.

Each room in the list is another map with the keys:

- name: The name of the room. The generator will produce a variety of castle-themed rooms (inspired by the board game [Castles of Mad King Ludwig](https://boardgamegeek.com/boardgame/155426/castles-of-mad-king-ludwig)). The names have no specific effect on gameplay.
- description: A longer textual description of what the room looks like. This is semi-randomly generated, and also has no effect on gameplay.
- items: A list of items that are found in the room. The player can automatically collect all items in the room.
- requires: A list of items that are required for the player to have before they can enter the room. You can think of these as the "key" necessary to enter the room, although it might be multiple keys, and they may not be actual "keys". **The framework does not implement this check; this is part of assignment 1**.

You can add additional keys to the map or the rooms however you see fit. Make sure to read the assignment description to understand what you *have to* support, though.

## Engine Documentation

Build your story by defining a few subclasses of `Scene` and adding your story data to a JSON file like `myStory.json`. To begin play, call `Engine.load(firstSceneClassName, pathToStoryJson)`.

### Engine:
#### Methods:
- `setTitle(title)`: Show a large header and change the title of the webpage.
- `showCaption(text)`: Show some large title text for the current scene.
- `show(text)`: Append some text to the scene description/presentation.
- `addInteraction(text, [data...])`: Adds a button players can interact with. The optional `data` arguments are passed to the interaction handler. The button is removed when the player clicks it.
- `gotoScene(sceneClass, [data...])`: Transition to a new scene by provided class name, supplying optional `data` arguments to customize the scene instance.
- `transition`: Adds a line as a marker for the end of a particular scene description.
- `itemString`: Converts a given item name into a Unicode emoji, if one exists with the given string as its shortcode (do **not** pass the colon characters!), otherwise it returns the item name unchanged. For a list of supported shortcodes, see [here](https://github.com/joypixels/emoji-toolkit/blob/master/extras/alpha-codes/eac.json). The shortcodes are listed as `alpha_code` in the JSON. For example, "alarm clock" has a short code of `":alarm_clock:"`, and a result of `"23f0"`. A quick google search of "unicode 23f0" can show you what to expect (in this case: ⏰). `itemString("alarm_clock")` will therefore return "⏰", while `itemString("wrist_watch")` (which does not exist!) will just return `"wrist_watch"` unchanged.

Navigation is presented in a 3x3 grid, where cells are added one by one, starting with the first row. Navigation cells can either contain a button or text (which may be empty). In the existing implementation, there are (up to) four buttons corresponding to the cardinal directions, with "North" being in the center cell of the first row, "West" and "East" in the left and right cells, respectively, of the middle row, and "South" in the center cell of the bottom row. The center cell in the middle row contains the text "You are here", to convey to the player where the movement buttons go relative to their position. Scenes can add cells using ttwo methods:
- `addNavigationCell(text, [data])`: Add a button which appears to the player as `text`, supplying optional `data` arguments to customize the effects of this choice. 
- `addTextCell(text)`: Add a cell with (potentially empty) text.
When the player chooses any one navigation option, the entire navigation grid is removed (including text cells).

### Scene
#### Methods:
- `enter([data...])`: Called when a scene is presented to the player (e.g. when the player enters the "room"). The `data` arguments come from the additional parameters to `gotoScene`.
- `handleNavigation([data...])`: Called when the player selects a navigation button. The `data` arguments comes from the additional parameters to `addNavigationCell`.
- `handleInteraction([data...])`: Called when the player selects an interaction button. The `data` arguments comes from the additional parameters to `addInteraction`.

#### Fields:
- `engine`: An instance of `Engine`, with the methods described above.
- `storyData`: The result of parsing the JSON file at `pathToStoryJson`.