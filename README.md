# sourcefetch 

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)

## Getting Started

### Generating starter code

Let's begin by creating a new **package** using a utility provided by Atom.

* Launch the editor and press 
    <kbd class="platform-windows platform-linux">Ctrl+Shift+P</kbd>
     to open the **Command Palette**.

* Search for "Package Generator:
    Generate Package" and click the corresponding item on the list. You will see a
    prompt where you can enter the name of the package - _"sourcefetch"_.

* Press enter to generate the starter package, which should automatically be opened in Atom.

If you don't see package files appear in the sidebar, press
<kbd class="platform-windows platform-linux">Ctrl+K</kbd>
<kbd class="platform-windows platform-linux">Ctrl+B</kbd> (on Windows/Linux).

### Running the starter code

Let's try out the starter package before diving into the code itself. We will
first need to reload Atom to make it aware of the new package that was added.
Open the Command Palette again and run the _"Window: Reload"_ command.

Reloading the current window ensures that Atom runs the latest version of our
source code. We will be running this command every time we want to test the
changes we make to our package.   

Run the package `toggle` command by navigating to `Packages > sourcefetch > Toggle`
using the editor menu, or run `sourcefetch: Toggle` using the Command Palette.
You should see a black box appear at the top of the screen. Hide it by running
the command again.

#### The "toggle" command

Let's open `lib/sourcefetch.js`, which contains the package logic and defines
the `toggle` command.

<pre>
toggle() {
 console.log('Sourcefetch was toggled!');
 return (
   this.modalPanel.isVisible() ?
   this.modalPanel.hide() :
   this.modalPanel.show()
 );
}
</pre>

`toggle` is a function exported by the module. It uses a
[ternary operator](https://en.wikipedia.org/wiki/%3F:) to call `show` and `hide`
on the modal panel based on its visibility. `modalPanel` is an instance of
[Panel](https://atom.io/docs/api/v1.9.4/Panel), a UI element provided by the
Atom API. We declare `modalPanel` inside `export default`, which lets us access it as an
instance variable with `this`.

<pre>
this.subscriptions.add(atom.commands.add('atom-workspace', {
  'sourcefetch:toggle': () => this.toggle()
}));
</pre>

The above statement tells Atom to execute `toggle` every time the user runs
`sourcefetch:toggle`. We subscribe an [anonymous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), `() => this.toggle()`,
to be called every time the command is run. This is an example of
[event-driven programming](https://en.wikipedia.org/wiki/Event-driven_programming),
a common paradigm in JavaScript.

#### Atom Commands

Commands are nothing more than string identifiers for events triggered by the
user, defined within a package namespace. We've already used:

* `package-generator:generate-package`
* `window:reload`
* `sourcefetch:toggle`

Packages subscribe to commands in order to execute code in response to these events.

### Making your first code change

Let's make our first code change—we're going to change `toggle` to reverse
text selected by the user.

#### Change "toggle"

* Change the `toggle` function to match the snippet below.

<pre>
toggle() {
  let editor
  if (editor = atom.workspace.getActiveTextEditor()) {
    let selection = editor.getSelectedText()
    let reversed = selection.split('').reverse().join('')
    editor.insertText(reversed)
  }
}
</pre>

#### Test your changes

* Reload Atom by running `Window: Reload` in the Command Palette

* Navigate to `File > New` to create a new file, type anything you like and
    select it with the cursor.

* Run the `sourcefetch:toggle` command using the Command Palette, Atom menu, or
    by right clicking and selecting "Toggle sourcefetch"

The updated command will toggle the order of the selected text.

#### The Atom Editor API

The code we added uses the [TextEditor API](https://atom.io/docs/api/latest/TextEditor)
to access and manipulate the text inside the editor. Let's take a closer look.

<pre>
let editor
if (editor = atom.workspace.getActiveTextEditor()) { /* ... */ }
</pre>

The first two lines obtain a reference to a [**TextEditor**](https://atom.io/docs/api/latest/TextEditor)
instance. The variable assignment and following code is wrapped in a conditional
to handle the case where there is no text editor instance available, for example,
if the command was run while the user was in the settings menu.

<pre>
let selection = editor.getSelectedText()
</pre>

Calling `getSelectedText` gives us access to text selected by the user. If
no text is currently selected, the function returns an empty string.

<pre>
let reversed = selection.split('').reverse().join('')
editor.insertText(reversed)
</pre>

Our selected text is reversed using [JavaScript String methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
. Finally, we call `insertText` to replace the selected text with the
reversed counterpart. You can learn more about the different TextEditor methods
available by reading the [Atom API documentation](https://atom.io/docs/api/latest/TextEditor).

## Exploring the starter package

Now that we've made our first code change, let's take a closer look at how an
Atom package is organized by exploring the starter code.

### The main file

The main file is the entry-point to an Atom package. Atom knows where to find the
main file from an entry in `package.json`:

<pre>
"main": "./lib/sourcefetch",
</pre>

The file exports an object with lifecycle functions which Atom calls on
certain events.

* **activate** is called when the package is initially loaded by Atom.
    This function is used to initialize objects such as user interface
    elements needed by the package, and to subscribe handler functions to package
    commands.

* **deactivate** is called when the package is deactivated, for example, when
    the editor is closed or refreshed by the user.

* **serialize** is called by Atom to allow you to save the state of the package
    between uses. The returned value is passed as an argument to `activate` when
    the package is next loaded by Atom.

We are going to rename our package command to `fetch`, and remove user interface
elements we won't be using. Update the file to match the version below:

<pre>
'use babel';

import { CompositeDisposable } from 'atom'

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sourcefetch:fetch': () => this.fetch()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  fetch() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      selection = selection.split('').reverse().join('')
      editor.insertText(selection)
    }
  }
};
</pre>

### Activation commands

To improve performance, Atom packages can be _lazy loading_. We can tell Atom to
load our package only when certain commands are run by the user. These commands
are called **activation commands** and are defined in `package.json`:

<pre>
"activationCommands": {
  "atom-workspace": "sourcefetch:toggle"
},
</pre>

Update this entry to make `fetch` an activation command.

<pre>
"activationCommands": {
  "atom-workspace": "sourcefetch:fetch"
},
</pre>

Some packages, such as those which modify Atom's appearance need to be loaded
on startup. In those cases, `activationCommands` can be omitted entirely.

### Triggering commands

#### Menu items

JSON files inside the `menus` folder specify which menu items are created for
our package. Let's take a look at `menus/sourcefetch.json`:

<pre>
"context-menu": {
  "atom-text-editor": [
    {
      "label": "Toggle sourcefetch",
      "command": "sourcefetch:toggle"
    }
  ]
},
</pre>

The `context-menu` object lets us define new items in the right-click menu. Each
item is defined by a label to be displayed in the menu and a command to run when
the item is clicked.

<pre>
"context-menu": {
  "atom-text-editor": [
    {
      "label": "Fetch code",
      "command": "sourcefetch:fetch"
    }
  ]
},
</pre>

The `menu` object in the same file defines custom application menu items created
for the package. We're going to rename this entry as well:

<pre>
"menu": [
  {
    "label": "Packages",
    "submenu": [
      {
        "label": "sourcefetch",
        "submenu": [
          {
            "label": "Fetch code",
            "command": "sourcefetch:fetch"
          }
        ]
      }
    ]
  }
]
</pre>

#### Keyboard shortcuts

Commands can also be triggered with keyboard shortcuts, defined with JSON files
in the `keymaps` directory:

<pre>
{
  "atom-workspace": {
    "ctrl-alt-o": "sourcefetch:toggle"
  }
}
</pre>

The above lets package users call `toggle` with 
<kbd class="platform-windows platform-linux">Ctrl+Alt+O</kbd>
on Windows/Linux

Rename the referenced command to `fetch`:

<pre>
"ctrl-alt-o": "sourcefetch:fetch"
</pre>

Reload Atom by running the `Window: Reload` command. You should see that the
application and right-click menus are updated, and the reverse functionality
should work as before.

## Using NodeJS modules

Now that we've made our first code change and learned about Atom package structure,
let's introduce our first dependency—a module from
[Node Package Manager (npm)](https://www.npmjs.com/). We will use the **request**
module to make HTTP requests and download the HTML of a website. This functionality
will be needed later, to scrape StackOverflow pages.

### Installing dependencies

Open your command line application, navigate to your package root directory
and run:

<pre>
npm install --save request@2.73.0
apm install
</pre>

These commands add the `request` Node module to our dependencies list and
install the module into the `node_modules` directory. You should see a new entry
in `package.json`. The `@` symbol tells npm to install
the specific version we will be using for this tutorial. Running `apm install`
lets Atom know to use our newly installed module.

<pre>
"dependencies": {
  "request": "^2.73.0"
}
</pre>

### Downloading and logging HTML to the Developer Console

Import `request` into our main file by adding an import statement to the top
of `lib/sourcefetch.js`:

<pre>
import { CompositeDisposable } from 'atom'
import request from 'request'
</pre>

Now, add a new function, `download` to the module's exports, below `fetch`:

<pre>
exportdefault {  

  /* subscriptions, activate(), deactivate() */

  fetch() {
    ...
  },

  download(url) {
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(body)
      }
    })
  }
}
</pre>

This function uses `request` to download the contents of a web page and logs
the output to the Developer Console. When the HTTP request completes, our
[callback function](http://recurial.com/programming/understanding-callback-functions-in-javascript/)
will be called with the response as an argument.

The final step is to update `fetch` so that it calls `download`:

<pre>
fetch() {
  let editor
  if (editor = atom.workspace.getActiveTextEditor()) {
    let selection = editor.getSelectedText()
    this.download(selection)
  }
},
</pre>

Instead of reversing the selected text, `fetch` now treats the selection as a
URL, passing it to `download`. Let's see our changes in action:

* Reload Atom by running the `Window: Reload` command.

* Open the Developer Tools. To do this, navigate to
    `View > Developer > Toggle Developer Tools` in the menu.

* Create a new file, navigate to `File > New`.

* Enter and select a URL, for example, `http://www.atom.io`.

* Run our package command in any of the three ways previously described

**Developer Tools** make it easy to debug Atom packages. Any `console.log` statement
will print to the interactive console, and you can use the `Elements` tab to
explore the visual structure of the whole application—which is just an HTML
[Document Object Model (DOM)](https://www.wikipedia.com/en/Document_Object_Model).
