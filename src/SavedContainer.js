import { compose, withState } from 'recompose';

import Saved from './Saved';
import Backendless from 'backendless';

var listData = [];

Backendless.Persistence.of('Offers').find().then((res) => {
  this.listData = res;
}).catch((res) => {
  console.log("Erro");
});

export default compose(
  withState('tabIndex', 'setTabIndex', 2),
  withState('data', 'setData', listData),
)(Saved);