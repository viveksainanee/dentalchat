import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import App from './App';

const HOME_TAGLINE = 'Kinda like chutney but a bit more saucy';
const HOME_BTN_TXT = 'Join Room'
const DFLT_ROOM_NAME = 'Chat Room'

test("renders App without crashing", function () {
  render(<App />);
});

test('Home and ChatRoom Render', () => {
  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <App />
    </Router>
  )
  // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(screen.getByText(HOME_TAGLINE)).toBeInTheDocument()

  const leftClick = { button: 0 }
  userEvent.click(screen.getByText(HOME_BTN_TXT), leftClick)

  // check that the content changed to the new page
  expect(screen.getByText(DFLT_ROOM_NAME)).toBeInTheDocument()
})
