# Simple satisfaction rating app 

## Getting Started

First download and install the app.

```bash
$ git clone https://github.com/georgegkas/simple-satisfaction-rating-app
$ cd simple-satisfaction-rating-app
$ yarn
```

Edit the `constants.json` file to add the survey title and the questions. See the bellow example:

```json
{
  "title": "How do you feel about the following games?",
  "questions": [
    "Assassin's Creed Odyssey",
    "Fortnite",
    "Minecraft",
    "Monster Hunter: World",
    "Forza Horizon 4"
  ]
}
```

Run the app.

```
$ yarn start
```

The app is now served on `http://localhost:3000`

## Example

See the running example in [simple-satisfaction-rating-app.herokuapp.com](simple-satisfaction-rating-app.herokuapp.com).

To see the results of the voting navigate to [simple-satisfaction-rating-app.herokuapp.com/results](simple-satisfaction-rating-app.herokuapp.com/results).