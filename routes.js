const { LolApi, Constants } = require('twisted')

const express = require('express')
const router = express.Router()

const api = new LolApi({
	rateLimitRetry: true,
	rateLimitRetryAttempts: 1,
	concurrency: undefined,
	key: process.env.API_KEY,
	debug: {
		logTime: false,
		logUrls: false,
		logRatelimit: false,
	},
})

router.get('/summoner', async function (req, res, next) {
	const summonerName = req.query.name
	try {
		const summoner = await api.Summoner.getByName(summonerName, Constants.Regions.EU_WEST)
		res.status(200).json({ summoner: summoner.response })
	} catch (error) {
		console.log(error)
	}
})

router.get('/matches', async function (req, res, next) {
	const summonerId = req.query.summonerId
	try {
		const matches = await api.Match.list(summonerId, Constants.Regions.EU_WEST)
		const first5matches = matches.response.matches.slice(1, 6)
		const minifiedArray = first5matches.map(match => {
			return {
				champion: match.champion,
				matchId: match.gameId,
				lane: match.lane,
			}
		})
		res.status(200).json({ matches: minifiedArray })
	} catch (error) {
		console.log(error)
	}
})

router.get('/match', async function (req, res, next) {
	const matchId = req.query.id
	try {
		const match = await api.Match.get(matchId, Constants.Regions.EU_WEST)
		const teams = match.response.teams.map(team => ({
			teamId: team.teamId,
			win: team.win,
		}))
		const participants = match.response.participants.map(player => ({
			participantId: player.participantId,
			teamId: player.teamId,
			championId: player.championId,
		}))
		const participantIdentities = match.response.participantIdentities.map(player => ({
			participantId: player.participantId,
			player: player.player.summonerName,
		}))
		res
			.status(200)
			.json({ match: { ...match.response, teams, participants, participantIdentities } })
	} catch (error) {
		console.log(error)
	}
})

router.get('/champion', async function (req, res, next) {
	const championId = req.query.id
	try {
		const champions = await api.DataDragon.getChampion()
		const championNames = Object.keys(champions.data)
		const champion = championNames.filter(champ =>
			champions.data[champ].key === championId ? true : false
		)
		res.status(200).json({ name: champions.data[champion].id })
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
