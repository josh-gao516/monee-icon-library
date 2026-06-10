import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon } from '../src/Icon.web';

function dump(label: string, el: React.ReactElement) {
  console.log(`\n=== ${label} ===`);
  console.log(renderToStaticMarkup(el));
}

dump('lock (stroke, default color)', <Icon name="lock" />);
dump('lock.fill (#ea580c)', <Icon name="lock.fill" color="#ea580c" />);
dump('creditcard.fill (2 paths, #16a34a)', <Icon name="creditcard.fill" color="#16a34a" />);
dump('bell size=32', <Icon name="bell" size={32} color="#000" />);
dump('unknown icon', <Icon name={'nope' as any} />);

console.log('\n--- done ---');
