/*
 * Copyright 2018-2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import { IDocumentManager } from '@jupyterlab/docmanager';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import '../style/index.css';
import { CodeSnippetManager, ICodeSnippet } from './CodeSnippet';
import { ReactWidget } from '@jupyterlab/apputils';
import { ExpandableComponent } from './ExpandableComponent';

/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_CLASS = 'elyra-CodeSnippets';
const CODE_SNIPPETS_HEADER_CLASS = 'elyra-codeSnippetsHeader';
const CODE_SNIPPET_ITEM = 'elyra-codeSnippet-item';
const BUTTON_CLASS = 'elyra-button';
const COPY_ICON_CLASS = 'elyra-copy-icon';
const INSERT_ICON_CLASS = 'elyra-add-icon';
const CODE_SNIPPET_NAME_CLASS = 'elyra-codeSnippet-name';
const CODE_SNIPPET_BUTTONS_WRAPPER_CLASS = 'elyra-codeSnippet-buttons';

/**
 * A widget for code-snippet.
 */

class CodeSnippetTable extends React.Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = { codeSnippets: [] };
  }

  async fetchData(): Promise<ICodeSnippet[]> {
    const codeSnippetManager = new CodeSnippetManager();
    const codeSnippets: ICodeSnippet[] = await codeSnippetManager.findAll();
    return codeSnippets;
  }

  // TODO: Use code mirror to display code
  // TODO: implement copy to clipboard command
  // TODO: implement insert code to file editor command (first check for code language matches file editor kernel language)
  renderCodeSnippetsDisplay(): Array<JSX.Element> {
    const codeSnippetDisplayList: Array<JSX.Element> = this.state.codeSnippets.map(
      (codeSnippet: any, index: number) => {
        const displayName =
          '[' + codeSnippet.language + '] ' + codeSnippet.displayName;

        return (
          <div key={codeSnippet.name} className={CODE_SNIPPET_ITEM}>
            <div
              key={codeSnippet.displayName}
              className={CODE_SNIPPET_NAME_CLASS}
            >
              <ExpandableComponent displayName={displayName}>
                <pre>{codeSnippet.code.join('\n')}</pre>
              </ExpandableComponent>
            </div>
            <div className={CODE_SNIPPET_BUTTONS_WRAPPER_CLASS}>
              <div key="copyButton">
                <button
                  className={BUTTON_CLASS + ' ' + COPY_ICON_CLASS}
                  onClick={(): void => {
                    console.log('COPY BUTTON CLICKED');
                  }}
                ></button>
              </div>
              <div key="insertButton">
                <button
                  className={BUTTON_CLASS + ' ' + INSERT_ICON_CLASS}
                  onClick={(): void => {
                    console.log('INSERT CODE BUTTON CLICKED');
                  }}
                ></button>
              </div>
            </div>
          </div>
        );
      }
    );

    return codeSnippetDisplayList;
  }

  componentDidMount(): void {
    this.fetchData().then((codeSnippets: ICodeSnippet[]) => {
      this.setState({
        codeSnippets: codeSnippets
      });
    });
  }

  render(): React.ReactElement {
    return (
      <div>
        <div id="codeSnippets">
          <div>{this.renderCodeSnippetsDisplay()}</div>
        </div>
      </div>
    );
  }
}

export class CodeSnippetWidget extends ReactWidget {
  render(): React.ReactElement {
    return (
      <div className={CODE_SNIPPETS_CLASS}>
        <header className={CODE_SNIPPETS_HEADER_CLASS}>
          {'</> Code Snippets'}
        </header>
        <CodeSnippetTable />
      </div>
    );
  }
}

/**
 * A namespace for CodeSnippet statics.
 */
export namespace CodeSnippetWidget {
  /**
   * Interface describing table of contents widget options.
   */
  export interface IOptions {
    /**
     * Application document manager.
     */
    docmanager: IDocumentManager;

    /**
     * Application rendered MIME type.
     */
    rendermime: IRenderMimeRegistry;
  }
}
