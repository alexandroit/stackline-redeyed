'use strict';

(() => {
  const redeyed = globalThis.Redeyed.default;
  const source = document.querySelector('#source-input');
  const output = document.querySelector('#result-output');
  const mode = document.querySelector('#transform-mode');
  const astMode = document.querySelector('#ast-mode');
  const indicator = document.querySelector('#status-indicator');
  const status = document.querySelector('#status-text');
  const initialSource = [
    '#!/usr/bin/env node',
    '// Layout and comments remain in place.',
    'const greeting = "hello";',
    'function announce(value) {',
    '  return greeting + ", " + value;',
    '}',
    '',
    'announce("Stackline");'
  ].join('\n');

  document.querySelector('#transform-button').addEventListener('click', transform);
  document.querySelector('#reset-button').addEventListener('click', () => { source.value = initialSource; mode.value = 'angle'; astMode.checked = false; transform(); });
  document.querySelector('#copy-output-button').addEventListener('click', async (event) => { await navigator.clipboard.writeText(output.textContent); flash(event.currentTarget); });
  document.addEventListener('click', async (event) => { const button = event.target.closest('[data-copy]'); if (!button) return; await navigator.clipboard.writeText(button.dataset.copy); flash(button); });
  for (const input of [source, mode, astMode]) input.addEventListener('input', transform);

  source.value = initialSource;
  transform();

  function transform() {
    const configs = {
      angle: { Keyword: { _default: '<:>' } },
      square: { String: { _default: '[:]' } },
      comments: { Line: { _default: '/*:*/' }, Block: { _default: '/*:*/' } },
      identifiers: { Identifier: { _default: '{:}' } }
    };
    try {
      const result = redeyed(source.value, configs[mode.value], { buildAst: astMode.checked });
      output.textContent = result.code;
      document.querySelector('#source-count').textContent = `${source.value.length.toLocaleString()} characters`;
      document.querySelector('#token-count').textContent = `${result.tokens.length.toLocaleString()} tokens`;
      document.querySelector('#comment-count').textContent = `${result.comments.length.toLocaleString()} comments`;
      document.querySelector('#ast-state').textContent = result.ast ? 'AST built' : 'AST off';
      status.textContent = 'Transformation complete; original source and config were not mutated.';
      indicator.classList.remove('error');
    } catch (error) {
      output.textContent = error.message;
      status.textContent = 'The parser rejected this source.';
      indicator.classList.add('error');
    }
  }

  function flash(button) {
    const original = button.textContent;
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = original; }, 1200);
  }
})();
