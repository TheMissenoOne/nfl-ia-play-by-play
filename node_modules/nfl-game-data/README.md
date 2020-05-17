# NFL Game Data

Scrapes NFL game data from ESPN for the given team (abbreviation), season (year), game (week number), and season type ('pre', 'reg', 'post') and returns a model representing "play-by-play" data and "game details" of the form:

```javascript
{
  plays: Object[],
  gameDetails: Object,
}
```

**Disclaimer**

As with all scrapers, this scraper is subject to break with any change in the response model sent back from ESPN.

There are some occasions where the play-by-play endpoint will return a one-off response that doesn't contain the model that the scraper's regex is expecting. So far I've only seen it with a single preseason game. I don't care enough to parse the raw HTML. Sorry! Fork this repo and enhance it if you'd like.

## `Usage`

```javascript
const NFLGameData = require("nfl-game-data");

// Set team (Seattle Seahawks) and season year (2018).
const nflGameData = new NFLGameData('sea', 2018);

/**
 * Fetch game data for game 3 of the regular season.
 *
 * HTTP Request count:
 *  1 (season data) + 1 game (for plays)
 */
nflGameData.getGame(3, 'reg').then((data) => {
  const { plays, gameDetails } = data;
  // Do something...
});

// Change team to New England Patriots
nflGameData.team = 'ne';
// Change season to 2017
nflGameData.season = 2017;

/**
 * Fetch game data for every game of the Regular Season
 *
 * HTTP Request count:
 *   1 (season data) + N games (plays for each game)
 */
nflGameData.getEveryGame('reg').then((regSeasonGames) => {
  regSeasonGames.forEach(({ plays, gameDetails }) => {
    // Do something...
  });
});

/**
 * Fetch game data for every game of every season type
 *
 * HTTP Request count:
 *  1 (season data) + N games (plays for each game) for each season
 */
nflGameData.getAllGames().then((allGames) => {
  const { preseason, regularSeason, postSeason } = allGames;
  regularSeason.forEach(({ plays, gameDetails }) => {
    // Do something...
  });
});
```

### `plays` model

```javascript
[
  {
    play: {
      period: [Object],
      homeScore: 0,
      awayScore: 0,
      start: [Object],
      text:
        "S.Janikowski kicks 66 yards from SEA 35 to DAL -1. D.Thompson to DAL 34 for 35 yards (A.Calitro, A.King).",
      clock: [Object],
      type: [Object]
    },
    homeWinPercentage: 0.519,
    playId: "40103079945",
    tiePercentage: 0,
    secondsLeft: 0
  }
  ...
];
```

### `gameDetails` model

```javascript
{ date:
   { date: '2018-09-23T20:25Z',
     format: 'ddd, MMM D',
     formatMobile: 'ddd, M/D',
     isTimeTBD: false },
  opponent:
   { id: '6',
     abbrev: 'DAL',
     displayName: 'Dallas Cowboys',
     logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
     recordSummary: '',
     standingSummary: '',
     location: 'Dallas',
     links: '/nfl/team/_/name/dal/dallas-cowboys',
     homeAwaySymbol: 'vs',
     rank: '',
     neutralSite: false },
  time:
   { time: '2018-09-23T20:25Z',
     link: 'http://www.espn.com/nfl/game/_/gameId/401030799',
     state: 'post',
     tbd: false,
     format: 'h:mm A' },
  tickets: {},
  network: [ { name: 'FOX' } ],
  result:
   { winner: true,
     isTie: false,
     winLossSymbol: 'W',
     currentTeamScore: '24',
     opponentTeamScore: '13',
     link: 'http://www.espn.com/nfl/game/_/gameId/401030799' },
  timeAndNetwork:
   { time:
      { time: '2018-09-23T20:25Z',
        link: 'http://www.espn.com/nfl/game/_/gameId/401030799',
        state: 'post',
        tbd: false,
        format: 'h:mm A' },
     network: [ [Object] ] },
  record: '1-2',
  seasonType:
   { id: '2', type: 2, name: 'Regular Season', abbreviation: 'reg' },
  status:
   { id: '3',
     name: 'STATUS_FINAL',
     state: 'post',
     completed: true,
     description: 'Final',
     detail: 'Final',
     shortDetail: 'Final' },
  notes: {},
  competitionKey: 'STD',
  competitionName: 'Standard',
  week: { number: 3, text: 'Week 3', display: 3 },
  passingLeader:
   { athlete:
      { name: 'Russell Wilson',
        href: 'http://www.espn.com/nfl/player/_/id/14881/russell-wilson',
        lastName: 'Wilson' },
     value: 192 },
  rushingLeader:
   { athlete:
      { name: 'Chris Carson',
        href: 'http://www.espn.com/nfl/player/_/id/3919596/chris-carson',
        lastName: 'Carson' },
     value: 102 },
  receivingLeader:
   { athlete:
      { name: 'Tyler Lockett',
        href: 'http://www.espn.com/nfl/player/_/id/2577327/tyler-lockett',
        lastName: 'Lockett' },
     value: 77 },
  gameId: '401030799' }
```
