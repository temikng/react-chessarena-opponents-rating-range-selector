import React, { FC } from 'react';
import './App.css';
import { OpponentsRatingRangeSelector } from './components/OpponentsRatingRangeSelector';

const App: FC<{}> = () => {
  function onChange(data: any): void {
    console.log('on change opponents rating range data', data);
  }

  return (
    <div className="App">
      <OpponentsRatingRangeSelector value={1200} max={3000} min={0} onChange={onChange}/>
    </div>
  );
}

export default App;
