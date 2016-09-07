'use babel';

import { CompositeDisposable } from 'atom';
import request from 'request'

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sourcefetch:fetch': () => this.fetch()
    }));

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  fetch() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      this.download(selection)
    }
  },

  download(url) {
    request(url,(error,response,body) => {
      if (!error && response.statusCode == 200) {
        console.log(body)
      }
    })
  }

};
