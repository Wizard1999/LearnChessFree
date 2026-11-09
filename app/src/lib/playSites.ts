// Trusted places to play real people (D79). Every statement carries an evidence label (project rule 3): [V] read on the site's own page on 9 Nov 2026,
// [I] our inference or advice, [not checked] stated plainly as unchecked. Nothing here is a claim about the sites we did not read. Links carry no
// referral or tracking parameters, open in a new tab with rel="noopener noreferrer", and nothing is sent to the site from this app.
export interface PlaySite {
  id: string; name: string; url: string
  /** The page the facts below were read from. */
  source: string
  offers: { text: string; label: 'V' | 'I' }[]
  safety: { text: string; label: 'V' | 'I' }[]
  notChecked: string[]
}

export const PLAY_SITES: PlaySite[] = [
  {
    id: 'lichess', name: 'Lichess', url: 'https://lichess.org/', source: 'lichess.org home page, About page and Terms of Service, read 9 Nov 2026',
    offers: [
      { text: 'Describes itself as a free, libre, no-ads, open-source chess server run by volunteers and donations.', label: 'V' },
      { text: 'The home page offers a lobby game, challenging a friend, and playing against the computer.', label: 'V' },
      { text: 'Its About page says that after a game you can request computer analysis.', label: 'V' },
      { text: 'Games from here can be fetched by username or pasted as PGN into our game review (Review a game you played elsewhere). Nothing is sent to the site except the username you type.', label: 'I' },
    ],
    safety: [
      { text: 'An account is optional; some features are not fully available without one.', label: 'V' },
      { text: 'To register you must be at least 15 (and of the legal age to enter a contract where you live), or be authorised by a parent or guardian. A teacher or parent can make "kid accounts", and kid mode turns off the ability to see public chats.', label: 'V' },
      { text: 'Its Terms forbid cheating (using an engine, an opening book, a database or another person during a game) and say suspected cheats should be reported, not accused in public.', label: 'V' },
      { text: 'You can stay out of chat: if you play with a parent or teacher account, or only against friends you know, you will meet fewer strangers.', label: 'I' },
    ],
    notChecked: ['Which time controls and rated pools are open to accounts without a sign-in.', 'The exact chat settings screens.'],
  },
  {
    id: 'chesscom', name: 'Chess.com', url: 'https://www.chess.com/play/online', source: 'chess.com Play page and User Agreement, read 9 Nov 2026',
    offers: [
      { text: 'The Play page is titled "Play Chess Online for FREE" and offers Start Game (10 min Rapid was the default shown), Custom Challenge, Play a Friend and Tournaments.', label: 'V' },
      { text: 'Paid memberships exist; the free page above is what we read, and we did not check which features need a membership.', label: 'V' },
    ],
    safety: [
      { text: 'Its User Agreement says you must be at least 13 to use the services; if you are under the legal age where you live, a parent or guardian must consent and be involved.', label: 'V' },
      { text: 'It has a Fair Play Policy that is part of the agreement, and may restrict play or close an account for suspicious behaviour.', label: 'V' },
      { text: 'Ratings on different sites are different scales and are not comparable with each other or with over-the-board ratings.', label: 'I' },
    ],
    notChecked: ['Whether you can play a first game without making an account.', 'The chat and privacy settings screens.', 'Any rated-pool rules for beginners.'],
  },
]

/** Tips for the first real games. The time-control figure is our advice [I], not a rule of either site. */
export const FIRST_GAME_TIPS: { text: string; label: 'I' }[] = [
  { text: 'Pick a time control long enough to think, for example 15 minutes with a 10-second increment (15+10). Very fast games reward habit, not thinking, and they give you less to look at afterwards.', label: 'I' },
  { text: 'Expect to lose your first games. A new account meets players who have played for years, and a loss you review is worth more than a win you do not.', label: 'I' },
  { text: 'Bring one idea from a recent lesson into each game, and look for it on both sides of the board.', label: 'I' },
  { text: 'Review every game afterwards, the same day if you can: bring it back here with its PGN and mark your own critical moments before the engine speaks.', label: 'I' },
  { text: 'Your account is yours and your parents or teacher can see it with you. Never share your password, keep personal details out of your username and profile, and report or block anyone who is unkind.', label: 'I' },
]
