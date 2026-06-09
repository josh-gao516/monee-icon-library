import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon } from '../src/Icon.web';

function dump(label: string, el: React.ReactElement) {
  console.log(`\n=== ${label} ===`);
  console.log(renderToStaticMarkup(el));
}

dump('lock / line (default color)', <Icon name="lock" variant="line" />);
dump('lock / solid (#ea580c)', <Icon name="lock" variant="solid" color="#ea580c" />);
dump('credit-card / solid (2 paths)', <Icon name="credit-card" variant="solid" color="#16a34a" />);
dump('bell / line size=32', <Icon name="bell" variant="line" size={32} color="#000" />);
dump('unknown icon', <Icon name={'nope' as any} />);

console.log('\n--- done ---');
