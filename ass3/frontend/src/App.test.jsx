/*
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

import { shallow, configure } from 'enzyme';
import React from 'react';
// import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Plus from './components/Plus';

configure({ adapter: new Adapter() });
describe('Plus', () => {
  it('triggers onClick event handler when clicked', () => {
    const onClick = jest.fn();
    shallow(<Plus onClick={onClick} />).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
